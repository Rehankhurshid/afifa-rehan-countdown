# AppleScript SMS Setup Guide for Wedding Countdown

## 📱 Overview

These AppleScript solutions let you send wedding countdown SMS messages directly from your Mac using your iPhone's SMS capability through Handoff/Continuity.

## ✅ Prerequisites

1. **iPhone with SMS plan** connected to your Apple ID
2. **Mac and iPhone on same WiFi** network
3. **Handoff enabled** on both devices:
   - iPhone: Settings > General > AirPlay & Handoff > Handoff (ON)
   - Mac: System Preferences > General > Allow Handoff (ON)
4. **Messages app** signed in with same Apple ID on both devices
5. **Text Message Forwarding** enabled:
   - iPhone: Settings > Messages > Text Message Forwarding > Your Mac (ON)

## 📄 Available Scripts

### 1. `WeddingSMSSender.applescript` - Simple Daily Messages

- **Purpose**: Send daily countdown messages
- **Features**: Single recipient, preview before sending
- **Best for**: Manual daily sending

### 2. `AdvancedWeddingSMS.applescript` - Multi-Recipient Manager

- **Purpose**: Send different message types to multiple people
- **Features**:
  - Multiple recipients
  - Different message types (Daily, Haldi, Mehendi, Wedding, Milestone)
  - Custom messages
  - Batch sending
- **Best for**: Managing multiple guests

### 3. `DailyWeddingSMSAutomation.applescript` - Automated Daily Sending

- **Purpose**: Fully automated daily messages
- **Features**:
  - Can be scheduled with Automator/Shortcuts
  - Auto-send option
  - Notification support
- **Best for**: Set-and-forget automation

## 🚀 Quick Setup Steps

### Step 1: Configure Phone Numbers

Edit the script files and update:

```applescript
property phoneNumbers : {"7010766135", "919876543210"}
```

### Step 2: Test Messages App

1. Open Messages app on Mac
2. Try sending a test SMS manually
3. Verify it sends through your iPhone

### Step 3: Run Scripts

- **Option A**: Double-click `.applescript` files to run
- **Option B**: Open with Script Editor and click Run
- **Option C**: Save as Applications for easy access

## 🔄 Automation Setup (Daily Messages)

### Using Shortcuts App (Recommended)

1. Open **Shortcuts** app on Mac
2. Create **New Shortcut**
3. Add **Run AppleScript** action
4. Paste the `DailyWeddingSMSAutomation.applescript` code
5. Set **Automation** to run daily at 10 AM
6. Enable **Allow Running When Away**

### Using Automator (Alternative)

1. Open **Automator** app
2. Create **Calendar Alarm**
3. Add **Run AppleScript** action
4. Paste script code
5. Save and set calendar reminder

### Using Cron (Advanced)

```bash
# Edit crontab
crontab -e

# Add line for daily 10 AM execution
0 10 * * * osascript ~/path/to/DailyWeddingSMSAutomation.applescript
```

## ⚙️ Script Configuration

### Enable Auto-Send (For Full Automation)

```applescript
property autoSend : true -- Change to true for automated sending
```

### Add More Recipients

```applescript
property phoneNumbers : {
    "7010766135",     -- Guest 1
    "919876543210",   -- Guest 2
    "919999888877"    -- Guest 3
}
```

### Customize Wedding Dates

```applescript
property weddingDate : date "October 22, 2025 8:00:00 PM"
property haldiDate : date "October 20, 2025 5:00:00 PM"
property mehendiDate : date "October 21, 2025 6:00:00 PM"
```

**⚠️ Important**: AppleScript date format is `"Month Day, Year Time"` (no day name like "Wednesday")

## 🎯 Usage Examples

### Daily Manual Sending

1. Run `WeddingSMSSender.applescript`
2. Preview message
3. Click "Send SMS"

### Event-Specific Messages

1. Run `AdvancedWeddingSMS.applescript`
2. Choose "Haldi Day" or "Mehendi Day"
3. Send to all recipients

### Fully Automated

1. Set up `DailyWeddingSMSAutomation.applescript` with Shortcuts
2. Enable auto-send
3. Messages send automatically every day at scheduled time

## 🔍 Troubleshooting

### "Messages not available" Error

- Check Handoff is enabled on both devices
- Sign out and back into Messages app
- Restart both iPhone and Mac

### SMS Not Sending

- Verify iPhone has cellular signal
- Check SMS plan is active
- Try sending manual SMS from Messages app first

### Script Permission Errors

- Go to System Preferences > Security & Privacy > Privacy
- Add Script Editor to "Accessibility" and "Automation"

### Automation Not Running

- Check Shortcuts/Automator permissions
- Verify automation is enabled
- Test script manually first

## 💡 Pro Tips

1. **Test First**: Always test with your own number before sending to guests
2. **Backup Plan**: Keep API-based services (Fast2SMS/MSG91) as backup
3. **Message Limits**: Be mindful of SMS plan limits
4. **Timing**: Schedule messages for appropriate times (10 AM recommended)
5. **Personalization**: Customize messages for different guest groups

## 🔄 Comparison: AppleScript vs API Services

| Feature              | AppleScript               | Fast2SMS/MSG91 |
| -------------------- | ------------------------- | -------------- |
| **Setup Complexity** | Medium                    | Easy           |
| **Cost**             | Free (uses your SMS plan) | Pay per SMS    |
| **Reliability**      | Good (depends on Handoff) | Excellent      |
| **Scalability**      | Limited                   | High           |
| **Automation**       | Mac-dependent             | Server-based   |
| **Customization**    | High                      | Medium         |

## 🎊 Ready to Send!

Your AppleScript wedding SMS system is ready! Choose the approach that works best for your needs:

- **Simple**: Use `WeddingSMSSender.applescript` for manual daily sending
- **Advanced**: Use `AdvancedWeddingSMS.applescript` for multi-recipient management
- **Automated**: Set up `DailyWeddingSMSAutomation.applescript` with Shortcuts for hands-off operation

Happy wedding countdown! 💍✨
