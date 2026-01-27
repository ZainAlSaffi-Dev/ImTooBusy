import discord
from discord.ui import Button, View
import os
import asyncio
import database
import notifications
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
        # 1. Acknowledge immediately so Discord doesn't say "Interaction Failed"
        await interaction.response.defer()
        
        try:
            print(f"🔄 Attempting to ACCEPT booking {self.booking_id}...")
            
            # 2. Update Local DB
            database.update_booking_status(self.booking_id, "ACCEPTED")
            booking = database.get_booking(self.booking_id)
            
            if not booking:
                await interaction.followup.send("❌ Error: Booking not found in Database.", ephemeral=True)
                return

            # 3. Sync to Google Calendar
            import gcal
            print("📅 Creating Google Calendar Event...")
            event_id = gcal.create_google_event(booking)
            
            if event_id:
                database.update_google_event_id(self.booking_id, event_id)
                print(f"✅ Google Event Created: {event_id}")
            else:
                print("⚠️ Google Event Creation Failed (Check gcal logs)")

            # 4. Send Emails
            print("📧 Sending Emails...")
            notifications.send_acceptance_email(booking)

            # 5. Determine Link
            join_info = "Link sent via Email"
            if booking.get('location_type') == 'ONLINE':
                join_info = f"[**Click to Join Zoom**]({notifications.MEETING_LINK})"
            else:
                join_info = f"📍 {booking.get('location_details')}"

            # 6. Success Message
            await interaction.message.edit(
                content=f"✅ **ACCEPTED** by {interaction.user.name}\n{join_info}", 
                view=None
            )
            print("✅ Booking fully processed.")

        except Exception as e:
            # 🚨 CATCH THE ERROR AND PRINT IT
            error_msg = f"CRITICAL ERROR: {str(e)}"
            print(error_msg)
            await interaction.followup.send(f"⚠️ **System Crash:** {e}\n*Check Railway Logs for details.*", ephemeral=True)

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

bot_instance = CarbonBot()

async def start_bot():
    if not TOKEN:
        print("⚠️ CANNOT START DISCORD: Token is missing")
        return
    try:
        await bot_instance.start(TOKEN)
    except Exception as e:
        print(f"❌ Discord Login Failed: {e}")