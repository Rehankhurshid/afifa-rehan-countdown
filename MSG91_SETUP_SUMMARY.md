# MSG91 Wedding Countdown Setup - Summary

## ✅ Setup Complete

### Configuration

- **Auth Key:** `473977AMhCluCy68f1908cP1`
- **Template ID:** `68f23e859462012a75669ec3`
- **Sender ID:** `rehankh90`
- **Template Type:** UNICODE (supports emojis)

### Phone Numbers (Correctly Formatted)

- **Number 1:** `917010766135` (with 91 prefix)
- **Number 2:** `919073236126` (with 91 prefix)

### Phone Number Formatting Rules

The system uses this logic:

1. If number already starts with "91" → use as-is
2. If number is 10 digits → add "91" prefix
3. Otherwise → use as-is

### Template Details

- **Name:** Afifa & Rehan Wedding Countdown
- **Content:** Includes emojis and multi-line text
- **Variable:** {{VAR1}} for countdown messages

### Current Status

- ⏳ **Template Status:** Awaiting MSG91 Approval
  - MSG91 templates require manual approval by the platform
  - Approval usually takes 2-4 hours
  - You'll receive an email when approved

### Simple SMS API (No Template Approval Needed)

- Already tested and working ✅
- Message ID: `5jqrAX1eWLSy`
- Delivered to both phone numbers

### Next Steps

1. Wait for MSG91 template approval (check your email)
2. Once approved, the v5 Flow API will work automatically
3. Or use the simpler sendhttp.php API (no approval needed)

### Test Files

- `test-msg91-template.js` - Test with template (v5 Flow API)
- `test-msg91.js` - Test simple SMS
- `add-msg91-template.js` - Create new templates
- `get-msg91-senderids.js` - Get available sender IDs

### Using with Cron Jobs

To use MSG91 in your cron jobs, update the service in:

- `config/wedding-config.json` - Change `"service": "msg91"`
- Create MSG91-based cron job endpoints

---

**Created:** October 17, 2025
**Auth Key:** Valid ✅
**Phone Numbers:** Correctly formatted with 91 prefix ✅
**Sender ID:** Verified ✅
