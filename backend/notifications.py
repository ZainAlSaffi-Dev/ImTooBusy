import os
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# LOAD SECRETS
DISCORD_URL = os.getenv("DISCORD_WEBHOOK_URL")
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
MEETING_LINK = os.getenv("DEFAULT_MEETING_LINK", "Link provided upon acceptance")

# --- DISCORD LOGIC ---
def send_discord_alert(booking):
    """Sends a Cyberpunk-style alert to your Discord."""
    if not DISCORD_URL: 
        print("Discord Webhook URL is missing in .env")
        return

    # Determine Color (Neon Cyan for Standard, Gold for Friend)
    is_friend = "⚡" in booking['topic']
    color = 16766720 if is_friend else 65535 

    # Logic for Location Field
    loc_str = "Online (Link upon acceptance)"
    if booking.get('location_type') == 'IN_PERSON':
        loc_str = f"📍 {booking.get('location_details')}"

    embed = {
        "title": "🚨 INCOMING BOOKING REQUEST",
        "description": f"**{booking['name']}** wants to meet.",
        "color": color,
        "fields": [
            {"name": "Topic", "value": booking['topic'], "inline": False},
            {"name": "Time", "value": f"{booking['date']} @ {booking['time']}", "inline": True},
            {"name": "Location", "value": loc_str, "inline": True},
            {"name": "Email", "value": booking['email'], "inline": True}
        ],
        "footer": {"text": "ImTooBusy // System Notification"}
    }

    try:
        r = requests.post(DISCORD_URL, json={"embeds": [embed]})
        if r.status_code == 204:
            print("✅ Discord Notification Sent Successfully")
        else:
            print(f"❌ Discord Failed: {r.status_code} - {r.text}")
    except Exception as e:
        print(f"❌ Discord Error: {e}")

# --- EMAIL LOGIC ---
def send_email(to_email, subject, body):
    if not EMAIL_SENDER or not EMAIL_PASSWORD:
        print("⚠️ Email credentials missing. Skipping email.")
        return

    msg = MIMEMultipart()
    msg['From'] = EMAIL_SENDER
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

def send_acceptance_email(booking):
    # Logic: If Online -> Send Link. If In Person -> Send Address.
    if booking.get('location_type') == 'IN_PERSON':
        location_msg = f"📍 Location: {booking.get('location_details')}"
    else:
        location_msg = f"💻 Join Link: {MEETING_LINK}"

    subject = f"Meeting Confirmed: {booking['topic']}"
    body = f"""
Hi {booking['name']},

I have accepted your meeting request.

Topic: {booking['topic']}
Date: {booking['date']}
Time: {booking['time']} (AEST)

{location_msg}

See you then.

Best,
Zain Al-Saffi
    """
    
    # 1. Send to Client
    send_email(booking['email'], subject, body)
    
    # 2. Send Copy to Admin (YOU)
    admin_subject = f"✅ ACCEPTED: {booking['name']} ({booking['date']} @ {booking['time']})"
    send_email(EMAIL_SENDER, admin_subject, body) # Uses your own email logic

def send_rejection_email(booking):
    subject = f"Meeting Request Update: {booking['topic']}"
    body = f"""
Hi {booking['name']},

Thanks for reaching out. Unfortunately I won’t be able to make the following time:

Topic: {booking['topic']}
Date: {booking['date']}
Time: {booking['time']} (AEST)

If you’d like, feel free to request a different time.

Best,
Zain Al-Saffi
    """
    
    # 1. Send to Client
    send_email(booking['email'], subject, body)
    
    # 2. Send Copy to Admin (YOU)
    admin_subject = f"❌ REJECTED: {booking['name']} ({booking['date']} @ {booking['time']})"
    send_email(EMAIL_SENDER, admin_subject, body)