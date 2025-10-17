// Simple test to verify Twilio SMS functionality
import { TwilioSMSService } from '../lib/sms-services';
import { generateDailyCountdownMessage } from '../lib/wedding-messages';
import config from '../config/wedding-config.json';

async function testTwilioSMS() {
  console.log('🎊 Testing Afifa & Rehan Wedding SMS System 🎊\n');
  
  // Create Twilio service
  const twilioService = new TwilioSMSService(
    config.messaging.twilio.accountSid,
    config.messaging.twilio.authToken,
    config.messaging.twilio.fromNumber
  );
  
  console.log('📱 Configuration:');
  console.log(`From Number: ${config.messaging.twilio.fromNumber}`);
  console.log(`To Numbers: ${config.messaging.phoneNumbers.join(', ')}`);
  console.log('');
  
  // Generate a test message
  const testMessage = generateDailyCountdownMessage();
  console.log('📝 Sample Message:');
  console.log('─'.repeat(50));
  console.log(testMessage);
  console.log('─'.repeat(50));
  console.log('');
  
  // Ask for confirmation before sending real SMS
  console.log('🚨 WARNING: This will send a REAL SMS message to the configured numbers!');
  console.log('Make sure the phone numbers are correct.');
  console.log('');
  console.log('To send a test SMS, uncomment the lines below in the script.');
  console.log('For now, this is just a preview.');
  
  // Uncomment these lines to send actual SMS:
  /*
  try {
    for (const phoneNumber of config.messaging.phoneNumbers) {
      console.log(`📤 Sending test SMS to ${phoneNumber}...`);
      const success = await twilioService.sendMessage(phoneNumber, testMessage);
      
      if (success) {
        console.log(`✅ SMS sent successfully to ${phoneNumber}`);
      } else {
        console.log(`❌ Failed to send SMS to ${phoneNumber}`);
      }
    }
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
  }
  */
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Verify phone numbers are correct');
  console.log('2. Test with one number first');
  console.log('3. Run full messaging system with: npx ts-node scripts/wedding-notifications.ts');
}

testTwilioSMS().catch(console.error);