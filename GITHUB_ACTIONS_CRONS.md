# Cron Jobs Migration: Vercel to GitHub Actions

## Overview
All wedding countdown SMS cron jobs have been migrated from Vercel to GitHub Actions for better control and flexibility.

## Changes Made

### 1. GitHub Actions Workflow Created
- **File**: `.github/workflows/wedding-crons.yml`
- **Scheduled Jobs**: 10 cron jobs configured to run at specified times
- **Trigger**: Scheduled via GitHub Actions with manual dispatch support

### 2. Vercel Configuration Removed
- **File**: `vercel.json`
- **Change**: Removed all cron job definitions from `vercel.json`
- **Status**: Vercel will no longer execute any scheduled cron jobs

## Cron Jobs Configured

| Job | Schedule | Description |
|-----|----------|-------------|
| Daily SMS | `0 14 * * *` | Daily wedding countdown at 2 PM UTC |
| Haldi Morning | `0 10 20 10 *` | Oct 20 at 10 AM UTC |
| Haldi Afternoon | `0 14 20 10 *` | Oct 20 at 2 PM UTC |
| Haldi Ceremony | `0 17 20 10 *` | Oct 20 at 5 PM UTC |
| Mehendi Morning | `0 10 21 10 *` | Oct 21 at 10 AM UTC |
| Mehendi Afternoon | `0 14 21 10 *` | Oct 21 at 2 PM UTC |
| Mehendi Ceremony | `0 18 21 10 *` | Oct 21 at 6 PM UTC |
| Wedding Morning | `0 10 22 10 *` | Oct 22 at 10 AM UTC |
| Wedding Afternoon | `0 14 22 10 *` | Oct 22 at 2 PM UTC |
| Wedding Ceremony | `0 20 22 10 *` | Oct 22 at 8 PM UTC |

## Required GitHub Secrets

Add these secrets to your GitHub repository settings:

1. **CRON_SECRET** - Authorization token for cron job verification
2. **MSG91_AUTH_KEY** - MSG91 API authentication key
3. **MSG91_SENDER_ID** - MSG91 sender ID

## Manual Testing

You can manually trigger any cron job from the GitHub Actions tab:
1. Go to repository → Actions → "Wedding Countdown Cron Jobs"
2. Click "Run workflow" dropdown
3. Select "Run workflow" to trigger immediately

## Cron API Routes

All cron job endpoints remain in `/api/cron/` directory:
- `api/cron/daily-wedding-sms.js`
- `api/cron/haldi-morning.js`
- `api/cron/haldi-afternoon.js`
- `api/cron/haldi-ceremony.js`
- `api/cron/mehendi-morning.js`
- `api/cron/mehendi-afternoon.js`
- `api/cron/mehendi-ceremony.js`
- `api/cron/wedding-morning.js`
- `api/cron/wedding-afternoon.js`
- `api/cron/wedding-ceremony.js`

## Advantages of GitHub Actions

✅ Better logging and monitoring in GitHub UI
✅ Manual trigger capability for testing
✅ No dependency on Vercel's cron infrastructure
✅ Complete audit trail of executions
✅ Easy to modify schedules in version control
✅ Secret management through GitHub

## Rollback

If you need to revert to Vercel crons:
1. Restore the original cron configuration in `vercel.json`
2. Disable or delete the GitHub Actions workflow
3. Re-deploy to Vercel
