// Script to update all cron jobs to use Twilio
const fs = require('fs');
const path = require('path');

const cronFiles = [
  'api/cron/haldi-morning.js',
  'api/cron/haldi-afternoon.js', 
  'api/cron/haldi-ceremony.js',
  'api/cron/mehendi-morning.js',
  'api/cron/mehendi-afternoon.js',
  'api/cron/mehendi-ceremony.js',
  'api/cron/wedding-morning.js',
  'api/cron/wedding-afternoon.js',
  'api/cron/wedding-ceremony.js'
];

cronFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Fast2SMS import with Twilio
    content = content.replace(
      'const { Fast2SMSService } = require(\'../../lib/fast2sms-service.js\');',
      'const { TwilioService } = require(\'../../lib/twilio-service.js\');'
    );
    
    // Replace service initialization
    content = content.replace(
      /const smsService = new Fast2SMSService\(weddingConfig\.messaging\.fast2sms\.apiKey\);/g,
      `const smsService = new TwilioService(
      weddingConfig.messaging.twilio.accountSid,
      weddingConfig.messaging.twilio.authToken,
      weddingConfig.messaging.twilio.fromNumber
    );`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to update ${filePath}:`, error.message);
  }
});

console.log('🎉 All cron jobs updated to use Twilio!');