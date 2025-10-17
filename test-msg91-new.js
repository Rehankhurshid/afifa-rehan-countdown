const { MSG91Service } = require('./lib/msg91-service.js');
const weddingConfig = require('./config/wedding-config.json');
const { generateDailyCountdownMessage } = require('./lib/wedding-messages.ts');

async function testMSG91Service() {
  console.log('🧪 Testing MSG91 Service Integration\n');
  
  console.log('🔑 Auth Key Check:');
  console.log(`Auth Key: ${weddingConfig.messaging.msg91.authKey ? 'Found' : 'Not Found'}`);
  console.log(`Auth Key Length: ${weddingConfig.messaging.msg91.authKey?.length || 0} characters`);
  console.log(`Auth Key Preview: ${weddingConfig.messaging.msg91.authKey?.substring(0, 8)}...`);
  
  const smsService = new MSG91Service(weddingConfig.messaging.msg91.authKey);
  
  // Test 1: Check Balance
  console.log('1️⃣ Checking Account Balance...');
  try {
    const balance = await smsService.getBalance();
    if (balance) {
      console.log(`✅ Account Balance: ${balance}`);
    } else {
      console.log('⚠️ Could not fetch balance (but this might still work for sending)');
    }
  } catch (error) {
    console.error('❌ Balance check failed:', error.message);
  }
  
  console.log('\n2️⃣ Testing Message Generation...');
  try {
    const message = generateDailyCountdownMessage();
    console.log('✅ Generated Message:');
    console.log(`"${message}"`);
    console.log(`📏 Message Length: ${message.length} characters`);
    
    // Test 3: Send Simple SMS (without template)
    console.log('\n3️⃣ Sending Simple SMS...');
    const phoneNumbers = weddingConfig.messaging.phoneNumbers;
    console.log(`📞 Target Phone Numbers: ${phoneNumbers.join(', ')}`);
    
    const result = await smsService.sendSimpleMessage(phoneNumbers, message);
    
    if (result && result.type === 'success') {
      console.log('✅ SMS sent successfully via Simple API!');
      console.log('📱 Response:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ SMS sending failed:');
      console.log('📱 Response:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Message sending failed:', error.message);
    console.error('🔍 Full error:', error);
  }
  
  console.log('\n🏁 MSG91 Test Complete!');
}

// Run the test
testMSG91Service().catch(console.error);