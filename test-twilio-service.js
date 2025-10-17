// Test script for Twilio SMS service
const { TwilioService } = require('./lib/twilio-service.js');
const { generateDailyCountdownMessage } = require('./lib/wedding-messages.js');
const weddingConfig = require('./config/wedding-config.json');

async function testTwilioService() {
  console.log('🧪 Testing Twilio SMS Service\n');
  
  // Initialize Twilio service
  const twilioService = new TwilioService(
    weddingConfig.messaging.twilio.accountSid,
    weddingConfig.messaging.twilio.authToken,
    weddingConfig.messaging.twilio.fromNumber
  );
  
  console.log('📞 Twilio Configuration:');
  console.log(`Account SID: ${weddingConfig.messaging.twilio.accountSid}`);
  console.log(`From Number: ${weddingConfig.messaging.twilio.fromNumber}`);
  console.log(`Target Numbers: ${weddingConfig.messaging.phoneNumbers.join(', ')}\n`);
  
  // Test 1: Check Balance
  console.log('1️⃣ Checking Account Balance...');
  try {
    const balance = await twilioService.getBalance();
    if (balance !== null) {
      console.log(`✅ Account Balance: $${balance}`);
    } else {
      console.log('⚠️ Could not fetch balance (but this might still work for sending)');
    }
  } catch (error) {
    console.error('❌ Balance check failed:', error.message);
  }
  
  console.log('\n2️⃣ Testing Message Generation...');
  const message = generateDailyCountdownMessage();
  console.log('✅ Generated Message:');
  console.log(`"${message}"`);
  console.log(`📏 Message Length: ${message.length} characters`);
  
  // Test 3: Send SMS
  console.log('\n3️⃣ Sending Test SMS via Twilio...');
  const phoneNumbers = weddingConfig.messaging.phoneNumbers;
  
  try {
    const result = await twilioService.sendMessage(phoneNumbers, message);
    
    if (result.success) {
      console.log('✅ SMS sent successfully via Twilio!');
      console.log('📱 Message ID:', result.messageId);
      console.log('📊 Results:', JSON.stringify(result.results, null, 2));
    } else {
      console.log('❌ SMS sending failed:');
      console.log('📱 Error:', result.error);
      console.log('📊 Results:', JSON.stringify(result.results, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Message sending failed:', error.message);
  }
  
  console.log('\n🏁 Twilio Test Complete!');
}

// Run the test
testTwilioService().catch(console.error);