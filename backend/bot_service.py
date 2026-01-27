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

class BookingView(View):
    def __init__(self, booking_id):
        super().__init__(timeout=None)
        self.booking_id = booking_id

    @discord.ui.button(label="Accept", style=discord.ButtonStyle.green, custom_id="accept_btn")
    async def accept_button(self, interaction: discord.Interaction, button: Button):
        # 1. DEFER: Tell Discord to wait (gives us 15 minutes instead of 3 seconds)
        await interaction.response.defer()

        # 2. Do the heavy lifting (DB + Email)
        database.update_booking_status(self.booking_id, "ACCEPTED")
        booking = database.get_booking(self.booking_id)
        
        if booking:
            import gcal 
            gcal.create_google_event(booking)
            notifications.send_acceptance_email(booking)

        # 3. EDIT: Since we deferred, we edit the message directly instead of using 'response'
        await interaction.message.edit(content=f"✅ **ACCEPTED** by {interaction.user.name}", view=None)

    @discord.ui.button(label="Reject", style=discord.ButtonStyle.red, custom_id="reject_btn")
    async def reject_button(self, interaction: discord.Interaction, button: Button):
        # 1. DEFER
        await interaction.response.defer()

        # 2. Do the heavy lifting
        database.update_booking_status(self.booking_id, "REJECTED")
        booking = database.get_booking(self.booking_id)
        if booking:
            notifications.send_rejection_email(booking)

        # 3. EDIT
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
        await channel.send(embed=embed, view=view)

bot_instance = CarbonBot()

async def start_bot():
    if not TOKEN:
        print("⚠️ CANNOT START DISCORD: Token is missing in .env")
        return
    try:
        await bot_instance.start(TOKEN)
    except Exception as e:
        print(f"❌ Discord Login Failed: {e}")