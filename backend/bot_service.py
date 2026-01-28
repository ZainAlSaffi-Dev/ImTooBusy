import discord
from discord.ui import Button, View
import os
import asyncio
import database
import notifications
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("DISCORD_BOT_TOKEN")
CHANNEL_ID = int(os.getenv("DISCORD_CHANNEL_ID", "0"))
ADMIN_ID = os.getenv("DISCORD_ADMIN_ID")

class BookingView(View):
    def __init__(self, booking_id):
        super().__init__(timeout=None)
        self.booking_id = booking_id

    @discord.ui.button(label="Accept", style=discord.ButtonStyle.green, custom_id="accept_btn")
    async def accept_button(self, interaction: discord.Interaction, button: Button):
        # 1. Acknowledge instantly
        await interaction.response.defer()
        
        try:
            print(f"🔄 Processing acceptance for {self.booking_id}...")

            # 2. Database Update
            database.update_booking_status(self.booking_id, "ACCEPTED")
            booking = database.get_booking(self.booking_id)
            
            if not booking:
                await interaction.followup.send("❌ Error: Booking lost.", ephemeral=True)
                return

            # --- ⚡ UI UPDATE MOVED HERE ⚡ ---
            # We calculate the link and update the message FIRST so it feels instant.
            link = notifications.MEETING_LINK
            if booking.get('location_type') == 'ONLINE':
                if link and link.startswith("http"):
                    join_info = f"[**Click to Join Zoom**]({link})"
                else:
                    join_info = f"**Link:** {link}"
            else:
                join_info = f"📍 {booking.get('location_details')}"

            # Update the message immediately to show "ACCEPTED"
            await interaction.message.edit(
                content=f"✅ **ACCEPTED** by {interaction.user.name}\n{join_info}", 
                view=None
            )

            # --- 3. HEAVY TASKS (Run in background AFTER UI update) ---
            import gcal 
            
            # Use asyncio.gather to run GCal and Email at the same time (Parallel)
            # This is optional but makes the background work faster.
            print("⏳ Starting background sync...")
            
            # Define wrapper for GCal to handle the return value side-effect
            def sync_gcal():
                ev_id = gcal.create_google_event(booking)
                if ev_id:
                    database.update_google_event_id(self.booking_id, ev_id)
                return ev_id

            # Run both tasks concurrently
            await asyncio.gather(
                asyncio.to_thread(sync_gcal),
                asyncio.to_thread(notifications.send_acceptance_email, booking)
            )
            
            print("✅ Background Process Complete.")

        except Exception as e:
            print(f"CRITICAL ERROR: {e}")
            # Since we might have already edited the message, we send a followup
            await interaction.followup.send(f"⚠️ Error during background sync: {e}", ephemeral=True)

    @discord.ui.button(label="Reject", style=discord.ButtonStyle.red, custom_id="reject_btn")
    async def reject_button(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        
        try:
            print(f"🔄 Rejecting booking {self.booking_id}...")
            database.update_booking_status(self.booking_id, "REJECTED")
            booking = database.get_booking(self.booking_id)
            
            if booking:
                notifications.send_rejection_email(booking)

            await interaction.message.edit(content=f"❌ **REJECTED** by {interaction.user.name}", view=None)
            
        except Exception as e:
            print(f"❌ Rejection Error: {e}")
            await interaction.followup.send(f"⚠️ Error rejecting: {e}", ephemeral=True)

class BanView(View):
    def __init__(self, ip_address):
        super().__init__(timeout=86400)  # 24 hours
        self.ip_address = ip_address

    async def _disable_buttons(self):
        for child in self.children:
            child.disabled = True

    @discord.ui.button(label="Unban", style=discord.ButtonStyle.green, custom_id="unban_ip_btn")
    async def unban_button(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        try:
            database.unban_ip(self.ip_address)
            await self._disable_buttons()
            await interaction.message.edit(content=f"✅ **UNBANNED** {self.ip_address} by {interaction.user.name}", view=self)
        except Exception as e:
            await interaction.followup.send(f"⚠️ Error unbanning: {e}", ephemeral=True)

    @discord.ui.button(label="Keep Ban", style=discord.ButtonStyle.secondary, custom_id="keep_ban_btn")
    async def keep_ban_button(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        await self._disable_buttons()
        await interaction.message.edit(content=f"🔒 **BAN KEPT** for {self.ip_address}", view=self)

class CarbonBot(discord.Client):
    def __init__(self):
        intents = discord.Intents.default()
        intents.messages = True
        super().__init__(intents=intents)
        self.ready_event = asyncio.Event()

    async def on_ready(self):
        print(f"🤖 Carbon Bot Active: {self.user}")
        self.ready_event.set()

    async def send_booking_request(self, booking_data, booking_id):
        try:
            await asyncio.wait_for(self.ready_event.wait(), timeout=5.0)
        except asyncio.TimeoutError:
            print("⚠️ Discord Bot timed out. Skipping.")
            return

        channel = self.get_channel(CHANNEL_ID)
        if not channel:
            print(f"❌ Error: Could not find Discord Channel ID: {CHANNEL_ID}")
            return

        is_friend = "⚡" in booking_data['topic']
        color = 0x00FF00 if is_friend else 0x00FFFF

        embed = discord.Embed(
            title="🚨 INCOMING TRANSMISSION",
            description=f"**{booking_data['name']}** is requesting a slot.",
            color=color
        )
        embed.add_field(name="Topic", value=booking_data['topic'], inline=False)
        embed.add_field(name="Time", value=f"{booking_data['date']} @ {booking_data['time']}", inline=True)
        
        loc_str = "Online"
        if booking_data.get('location_type') == 'IN_PERSON':
            loc_str = f"📍 {booking_data.get('location_details')}"
        embed.add_field(name="Location", value=loc_str, inline=True)
        
        embed.set_footer(text=f"ID: {booking_id} // Waiting for manual override...")

        view = BookingView(booking_id=booking_id)
        ping_msg = f"<@{ADMIN_ID}>" if ADMIN_ID else ""
        
        await channel.send(content=ping_msg, embed=embed, view=view)

    async def send_ban_alert(self, ip_address, reason, duration_minutes, email=None, user_agent=None):
        try:
            await asyncio.wait_for(self.ready_event.wait(), timeout=5.0)
        except asyncio.TimeoutError:
            print("⚠️ Discord Bot timed out. Skipping ban alert.")
            return

        channel = self.get_channel(CHANNEL_ID)
        if not channel:
            print(f"❌ Error: Could not find Discord Channel ID: {CHANNEL_ID}")
            return

        expires_at = datetime.now() + timedelta(minutes=duration_minutes)
        embed = discord.Embed(
            title="🚫 IP BANNED",
            description="An IP address has been banned by the security system.",
            color=0xFF5555
        )
        embed.add_field(name="IP Address", value=ip_address, inline=False)
        embed.add_field(name="Reason", value=reason, inline=False)
        embed.add_field(name="Expires At", value=expires_at.strftime("%Y-%m-%d %H:%M:%S"), inline=True)
        if email:
            embed.add_field(name="Email", value=email, inline=True)
        if user_agent:
            # Trim user agent to avoid exceeding Discord field limits
            ua = user_agent[:200] + ("..." if len(user_agent) > 200 else "")
            embed.add_field(name="User Agent", value=ua, inline=False)

        view = BanView(ip_address=ip_address)
        ping_msg = f"<@{ADMIN_ID}>" if ADMIN_ID else ""

        await channel.send(content=ping_msg, embed=embed, view=view)

bot_instance = CarbonBot()

async def start_bot():
    if not TOKEN:
        print("⚠️ CANNOT START DISCORD: Token is missing")
        return
    try:
        await bot_instance.start(TOKEN)
    except Exception as e:
        print(f"❌ Discord Login Failed: {e}")