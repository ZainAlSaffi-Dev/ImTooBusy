import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Force load the .env file
load_dotenv()

SENDER = os.getenv("EMAIL_SENDER")
PASSWORD = os.getenv("EMAIL_PASSWORD")

print("\n📧 EMAIL DIAGNOSTIC TOOL")
print("--------------------------------")
print(f"1. Checking Variables...")
print(f"   • SENDER:   {SENDER if SENDER else '❌ MISSING'}")
print(f"   • PASSWORD: {'✅ FOUND' if PASSWORD else '❌ MISSING'}")

if not SENDER or not PASSWORD:
    print("\n❌ STOP: You are missing variables in your .env file.")
    print("   Make sure EMAIL_SENDER and EMAIL_PASSWORD are set.")
    exit()

print("\n2. Attempting Google Login (SSL)...")
try:
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.set_debuglevel(1) # 👈 THIS WILL SHOW THE REAL ERROR
    
    server.login(SENDER, PASSWORD)
    print("\n✅ LOGIN SUCCESSFUL!")
    
    print("\n3. Sending Test Email...")
    msg = MIMEText("If you read this, the email system is working!")
    msg['Subject'] = "ImTooBusy Test Email"
    msg['From'] = SENDER
    msg['To'] = SENDER # Send to yourself
    
    server.send_message(msg)
    server.quit()
    print("\n✅ EMAIL SENT! Check your Inbox (and Spam).")

except smtplib.SMTPAuthenticationError:
    print("\n❌ AUTHENTICATION FAILED!")
    print("   • Did you use your normal Gmail password? You MUST use an 'App Password'.")
    print("   • Go to: Google Account -> Security -> 2-Step Verification -> App Passwords.")
except Exception as e:
    print(f"\n❌ CRITICAL ERROR: {e}")