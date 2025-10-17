# Vercel Cron Job Setup for Wedding SMS Automation

## 🚀 Automated Daily Wedding Messages

Your wedding countdown now includes **fully automated daily SMS messages** via Vercel Cron Functions!

### ⏰ Schedule

- **Daily at 9:00 AM UTC** (adjust timezone as needed)
- **Automatic countdown calculation** (currently 5 days remaining)
- **Duplicate prevention** - won't send multiple messages per day
- **Fast2SMS integration** - using your existing ₹60 balance

### 🔧 Setup Required

#### 1. Add Environment Variable in Vercel Dashboard

```bash
CRON_SECRET=your-secret-key-here
```

**Steps:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `afifa-rehan-countdown` project
3. Go to Settings → Environment Variables
4. Add: `CRON_SECRET` = `AfifaRehan2025Wedding!` (or any secure string)

#### 2. Deploy the Changes

The cron job will be automatically configured after deployment.

### 📱 How It Works

1. **Every day at 9 AM UTC**, Vercel triggers `/api/cron/daily-wedding-sms`
2. **Checks duplicate prevention** - skips if already sent today
3. **Generates countdown message** with accurate days remaining
4. **Sends via Fast2SMS** to both phone numbers:
   - `7010766135`
   - `9073236126`
5. **Logs success/failure** in Vercel Function logs

### 🔍 Monitoring

**Check cron job status:**

- Vercel Dashboard → Functions → View function logs
- Look for daily executions at 9 AM UTC

**Manual test the endpoint:**

```bash
curl -X POST https://your-app.vercel.app/api/cron/daily-wedding-sms \
  -H "Authorization: Bearer AfifaRehan2025Wedding!"
```

### 📅 Message Schedule

**Current countdown messages will be sent daily until October 22, 2025:**

- **Day 5 (Oct 17)**: "FINAL WEEK! Only 5 days until our wedding!"
- **Day 4 (Oct 18)**: "4 days to go! The excitement builds!"
- **Day 3 (Oct 19)**: "3 days left! Almost here!"
- **Day 2 (Oct 20)**: "2 days! Haldi ceremony today at 5 PM!"
- **Day 1 (Oct 21)**: "Tomorrow is the day! Mehendi at 6 PM!"
- **Day 0 (Oct 22)**: "It's our wedding day! Nikah at 8 PM!"

### 🛡️ Security Features

- **Authorization header** required to prevent unauthorized access
- **Environment variable** protection for cron secret
- **Duplicate prevention** to avoid spam
- **Error logging** for debugging

### ⚙️ Customization Options

**Change schedule time** (edit `vercel.json`):

- `"0 9 * * *"` = 9 AM UTC daily
- `"0 14 * * *"` = 2 PM UTC daily (9 AM EST)
- `"30 12 * * *"` = 12:30 PM UTC daily

**Add special event messages:**
The system can be extended to send special messages on:

- October 20: Haldi ceremony day
- October 21: Mehendi ceremony day
- October 22: Wedding day

### 🎉 Ready to Go!

Once you add the `CRON_SECRET` environment variable in Vercel, your wedding countdown will be **fully automated**!

No more manual intervention needed - the messages will be sent automatically every day until the wedding! 💒✨
