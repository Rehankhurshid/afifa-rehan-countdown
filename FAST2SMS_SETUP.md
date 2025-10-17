# Fast2SMS Setup for Wedding Messages 🇮🇳

Fast2SMS is perfect for Indian wedding messages! Here's how to set it up:

## 🚀 Quick Setup Steps:

### 1. **Create Fast2SMS Account**

- Go to: https://www.fast2sms.com/
- Sign up for FREE account
- Verify your mobile number
- Get FREE credits for testing!

### 2. **Get Your API Key**

- Login to Fast2SMS dashboard
- Go to **"Dev API"** section
- Copy your **API Authorization Key**
- It looks like: `weBQKBrtZzLnD2ZUEnUYJIO40zZGnjgZm3BA1SAUd0qZ56gHm0`

### 3. **Update Configuration**

Edit `/config/wedding-config.json`:

```json
{
  "messaging": {
    "service": "fast2sms",
    "fast2sms": {
      "apiKey": "YOUR_ACTUAL_API_KEY_HERE"
    },
    "phoneNumbers": ["7010766135", "9876543210"]
  }
}
```

**Note:** Use 10-digit Indian numbers (without +91)

### 4. **Test the Setup**

```bash
# Update the API key in the test script first
node scripts/test-fast2sms.js
```

## ✅ **Advantages of Fast2SMS:**

### **🇮🇳 Perfect for India:**

- **High delivery rates** to Indian numbers
- **Local Indian service** - trusted by carriers
- **DLT approved** messages
- **Bulk SMS** capabilities

### **💰 Cost Effective:**

- **FREE credits** for new signups
- **Very cheap** rates (₹0.25-0.50 per SMS)
- **No monthly fees**
- **Pay as you use**

### **📱 Better Delivery:**

- **No international blocks**
- **Faster delivery** (local servers)
- **DND bypass** for service messages
- **Real-time delivery reports**

## 🎯 **Message Types Supported:**

### **Service Messages (Recommended):**

- Wedding invitations
- Event reminders
- Personal updates
- **Higher delivery rates**

### **Promotional Messages:**

- Marketing content
- Bulk announcements
- **Cheaper rates**

## 📋 **Phone Number Format:**

✅ **Correct:** `7010766135` (10 digits)
❌ **Wrong:** `+917010766135` or `917010766135`

## 🔧 **API Features:**

### **Bulk SMS:**

- Send to multiple numbers at once
- Up to 100 numbers per request
- **Perfect for wedding guest lists**

### **Scheduling:**

- Schedule messages for future delivery
- **Perfect for automated countdown**

### **Delivery Reports:**

- Real-time status updates
- Failed/successful delivery tracking

## 💡 **Pro Tips:**

### **1. Message Content:**

- Keep under 160 characters for single SMS
- Use Unicode for Hindi/regional languages
- Avoid promotional keywords

### **2. Timing:**

- Send between 9 AM - 9 PM
- Avoid festival/holiday periods
- **Perfect for wedding countdowns!**

### **3. Testing:**

- Test with your own number first
- Check delivery status
- Verify message formatting

## 🎊 **Ready Messages for Wedding:**

### **Daily Countdown:**

```
Hi! Afifa & Rehan's wedding in 5 days!

Oct 20: Haldi 5pm
Oct 21: Mehendi 6pm
Oct 22: Wedding 8pm

Check afifaziya.com
Love, Family ❤️
```

### **Event Reminder:**

```
Good morning!

Haldi ceremony today at 5pm!
Hope to see you there! 🌻

From Afifa & Rehan's family
```

## 🚀 **Next Steps:**

1. **Sign up** at Fast2SMS
2. **Get API key** from Dev API section
3. **Update** `test-fast2sms.js` with your API key
4. **Run test:** `node scripts/test-fast2sms.js`
5. **Add guest numbers** to config
6. **Start messaging system**

Fast2SMS will give you much better delivery rates for Indian numbers! 🇮🇳💕
