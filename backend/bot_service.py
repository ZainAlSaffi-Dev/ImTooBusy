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
ADMIN_ID = os.getenv("DISCORD_ADMIN_ID") # <--- NEW: Load your ID

class BookingView(View):
    def __init__(self, booking_id):
        super().__init__(timeout=None)
        self.booking_id = booking_id

    @discord.ui.button(label="Accept", style=discord.ButtonStyle.green, custom_id="accept_btn")
    async def accept_button(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()
        
        # 1. Update Local DB
        database.update_booking_status(self.booking_id, "ACCEPTED")
        booking = database.get_booking(self.booking_id)
        
        # 2. Sync to Google Calendar & Email
        if booking:
            import gcal 
            # A. Create Event & Save ID
            event_id = gcal.create_google_event(booking)
            if event_id:
                database.update_google_event_id(self.booking_id, event_id)
            
            # B. Send Emails (Client + Admin)
            notifications.send_acceptance_email(booking)

        # 3. Determine Link to show in Discord
        join_info = "Link sent via Email"
        if booking.get('location_type') == 'ONLINE':
            join_info = f"[**Click to Join Zoom**]({notifications.MEETING_LINK})"
        else:
            join_info = f"📍 {booking.get('location_details')}"

        # 4. Edit Discord Message
        await interaction.message.edit(
            content=f"✅ **ACCEPTED** by {interaction.user.name}\n{join_info}", 
            view=None
        )

    @discord.ui.button(label="Reject", style=discord.ButtonStyle.red, custom_id="reject_btn")
    async def reject_button(self, interaction: discord.Interaction, button: Button):
        await interaction.response.defer()

        database.update_booking_status(self.booking_id, "REJECTED")
        booking = database.get_booking(self.booking_id)
        if booking:
            notifications.send_rejection_email(booking)

        await interaction.message.edit(content=f"❌ **REJECTED** by {interaction.user.name}", view=None)

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
            print("⚠️ Discord Bot timed out (Not connected). Skipping notification.")
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

        # --- THE FIX: ADD THE PING HERE ---
        ping_msg = f"<@{ADMIN_ID}>" if ADMIN_ID else ""
        
        await channel.send(content=ping_msg, embed=embed, view=view)

bot_instance = CarbonBot()

async def start_bot():
    if not TOKEN:
        print("⚠️ CANNOT START DISCORD: Token is missing in .env")
        return
    try:
        await bot_instance.start(TOKEN)
    except Exception as e:
        print(f"❌ Discord Login Failed: {e}")