# MSG91 SMS Setup Guide for Wedding Countdown

## 🚀 Quick Setup Steps

### 1. Create MSG91 Account

- Visit: https://msg91.com/
- Sign up for a free account
- Verify your email and phone number

### 2. Get Your Auth Key

- Login to: https://control.msg91.com/user/
- Go to "API Keys" section
- Copy your Auth Key

### 3. Update Configuration

Replace `YOUR_MSG91_AUTH_KEY_HERE` in these files:

- `config/wedding-config.json`
- `test-msg91.js`

### 4. Test the Service

```bash
node test-msg91.js
```

## 📱 MSG91 vs Fast2SMS Comparison

| Feature           | MSG91                       | Fast2SMS         |
| ----------------- | --------------------------- | ---------------- |
| **Reliability**   | ⭐⭐⭐⭐⭐ Enterprise grade | ⭐⭐⭐⭐ Good    |
| **Delivery Rate** | 99%+                        | 95%+             |
| **Templates**     | ✅ Advanced templates       | ❌ Limited       |
| **OTP Support**   | ✅ Built-in OTP             | ✅ Basic         |
| **Analytics**     | ✅ Detailed reports         | ✅ Basic reports |
| **Pricing**       | ₹0.15-0.25/SMS              | ₹0.17-0.30/SMS   |
| **API Quality**   | ✅ REST API v5              | ✅ Simple API    |

## 🔧 Configuration Options

### Simple SMS (Current)

```json
{
  "messaging": {
    "service": "msg91",
    "msg91": {
      "authKey": "YOUR_AUTH_KEY",
      "senderId": "MSGIND"
    }
  }
}
```

### Template SMS (Advanced)

```json
{
  "messaging": {
    "service": "msg91",
    "msg91": {
      "authKey": "YOUR_AUTH_KEY",
      "templateId": "YOUR_TEMPLATE_ID",
      "senderId": "YOUR_SENDER_ID"
    }
  }
}
```

## 🎯 Benefits of Using MSG91

1. **Better Delivery Rates**: Enterprise-grade delivery infrastructure
2. **Template Support**: Create reusable message templates
3. **Advanced Analytics**: Track delivery, clicks, and engagement
4. **Sender ID**: Custom sender ID (e.g., "AFIREHA" for your wedding)
5. **Compliance**: Better compliance with telecom regulations
6. **Scale**: Can handle high volume messaging

## 📋 Next Steps After Setup

1. **Test Message**: Send a test wedding countdown message
2. **Custom Sender ID**: Apply for custom sender ID like "AFIREHA"
3. **Template Creation**: Create message templates for better delivery
4. **Schedule Messages**: Set up automated daily messages
5. **Analytics**: Monitor delivery rates and engagement

## 🔄 Migration from Fast2SMS

The system supports both services. You can:

- Keep Fast2SMS as backup
- Switch between services by changing `"service"` in config
- Compare delivery rates between both services

## 📞 Support

- MSG91 Support: https://help.msg91.com/
- MSG91 API Docs: https://docs.msg91.com/
- Pricing: https://msg91.com/pricing

Ready to upgrade your wedding SMS system! 🎉
