# Wedding Countdown Messaging System

Automated daily countdown messages and event notifications for Afifa & Rehan's wedding celebration!

## 📱 What This System Does

### Daily Countdown Messages (10 AM every day)

- Sends daily countdown with days remaining
- Special messages for milestone days (100, 50, 30, 14, 10, 7, 3, 2 days)
- Links to your countdown website

### Event-Specific Messages

- **October 20th, 2025 - Haldi Ceremony (5 PM)**

  - Morning message (8 AM): Day announcement
  - Before event (4 PM): "Starting in 1 hour" reminder
  - Event start (5 PM): "Ceremony has begun!"

- **October 21st, 2025 - Mehendi Celebration (6 PM)**

  - Morning message (8 AM): Day announcement
  - Before event (5 PM): "Starting in 1 hour" reminder
  - Event start (6 PM): "Celebration is live!"

- **October 22nd, 2025 - Nikah Ceremony (8 PM)**
  - Morning message (8 AM): "THE WEDDING DAY IS HERE!"
  - Before event (7 PM): "Nikah in 1 hour!"
  - Event start (8 PM): "The Nikah has begun!"

## 🚀 Quick Setup

### Option 1: Console Demo (Test Messages)

```bash
cd /Users/nayyarkhurshid/Desktop/AfifaRehanCountdown/my-app
npm install
npx ts-node scripts/wedding-notifications.ts
```

### Option 2: Twilio SMS (Real Messages)

1. **Install Twilio:**

   ```bash
   npm install twilio
   ```

2. **Get Twilio Credentials:**

   - Sign up at [twilio.com](https://twilio.com)
   - Get your Account SID and Auth Token
   - Buy a phone number

3. **Configure and Run:**
   ```typescript
   // In scripts/wedding-notifications.ts, replace the configuration:
   const config = {
     service: "twilio" as const,
     credentials: {
       accountSid: "your_account_sid_here",
       authToken: "your_auth_token_here",
       fromNumber: "+1234567890", // Your Twilio number
     },
   };
   ```

### Option 3: WhatsApp Business API

1. **Setup WhatsApp Business API**
2. **Configure service in the script**

## 📞 Phone Number Setup

Edit the phone numbers in `scripts/wedding-notifications.ts`:

```typescript
const PHONE_NUMBERS = [
  "+1234567890", // Family member
  "+0987654321", // Friend
  "+1122334455", // Another contact
  // Add more numbers as needed
];
```

## 📅 Message Schedule

| Event           | Time         | Message Type       |
| --------------- | ------------ | ------------------ |
| Daily Countdown | 10:00 AM     | General countdown  |
| Milestone Days  | 12:00 PM     | Special milestones |
| Event Mornings  | 8:00 AM      | Day announcements  |
| Before Events   | 1 hour prior | Starting soon      |
| Event Start     | Event time   | Now beginning      |

## 🎯 Sample Messages

### Daily Countdown

```
💖 5 DAYS TO GO! 💖

Afifa and Rehan's special day is getting closer! Time to start the final preparations! ✨

Countdown: https://www.afifaziya.com/
```

### Haldi Day Morning

```
🌅 HALDI DAY IS HERE! 🌅

Good morning! Today is October 20th - the first celebration begins! Haldi ceremony starts at 5PM. Get ready for the beautiful turmeric ritual and joyful celebrations! �✨

Countdown: https://www.afifaziya.com/
```

### Wedding Day

```
🌟 THE WEDDING DAY IS HERE! 🌟

Good morning! Today, October 22nd, 2025 - Afifa and Rehan will become husband and wife! The Nikah ceremony begins at 8PM. What a blessed day! 💍👰🤵

Countdown: https://www.afifaziya.com/
```

## 🔧 Customization

### Adding More Events

Edit `lib/wedding-messages.ts` to add more ceremonies:

```typescript
export const WEDDING_EVENTS: WeddingEvent[] = [
  // ... existing events
  {
    name: "Reception",
    date: "2025-10-23",
    time: "19:00", // 7PM
    description: "Grand wedding reception!",
  },
];
```

### Changing Message Times

Edit `lib/messaging-scheduler.ts`:

```typescript
// Change daily message time (currently 10 AM)
messageDate.setHours(10, 0, 0, 0);

// Change morning message time (currently 8 AM)
morningTime.setHours(8, 0, 0, 0);
```

### Custom Messages

Modify messages in `lib/wedding-messages.ts` to match your style and language preferences.

## 🖥️ Deployment Options

### Option 1: Local Computer

- Run the script on your computer
- Keep it running until the wedding

### Option 2: Cloud Server (Recommended)

- Deploy to Heroku, AWS, DigitalOcean, etc.
- Set up as a background service

### Option 3: Cron Jobs

- Set up cron jobs to run at specific times
- More reliable for long-term scheduling

## 📋 Monitoring

The system logs all messages and provides status updates:

- ✅ Message sent successfully
- ❌ Failed to send message
- 📋 Upcoming messages preview

## 🔒 Security Notes

- Keep your Twilio credentials secure
- Don't commit API keys to Git
- Use environment variables for sensitive data

## 💡 Pro Tips

1. **Test First**: Run with console output before using real SMS
2. **Backup Numbers**: Have multiple contact methods
3. **Time Zones**: Ensure all times are in the correct timezone
4. **Message Limits**: Check your SMS service limits
5. **Opt-out**: Provide a way for recipients to stop messages

## 🎊 Wedding Day Schedule Summary

- **October 20**: Haldi Ceremony at 5 PM
- **October 21**: Mehendi Celebration at 6 PM
- **October 22**: Nikah Ceremony at 8 PM

May Afifa and Rehan's wedding be filled with joy, love, and beautiful memories! 💕✨
