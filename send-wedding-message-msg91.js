const { WeddingMessageService } = require('./lib/wedding-sms-service.ts');
const { generateDailyCountdownMessage } = require('./lib/wedding-messages.ts');

async function sendTodaysWeddingMessage() {
  try {
    console.log('🎊 SENDING TODAY\'S WEDDING COUNTDOWN VIA MSG91\n');
    
    // Check service configuration
    const config = require('./config/wedding-config.json');
    
    if (config.messaging.service !== 'msg91') {
      console.log('⚠️ Service is set to:', config.messaging.service);
      console.log('Switching to MSG91...\n');
    }
    
    if (config.messaging.msg91.authKey === 'YOUR_MSG91_AUTH_KEY_HERE') {
      console.log('❌ MSG91 not configured yet');
      console.log('Please run: node update-msg91-config.js YOUR_AUTH_KEY');
      return;
    }
    
    // Initialize wedding message service
    const weddingService = new WeddingMessageService();
    
    // Generate today's message
    const todaysMessage = generateDailyCountdownMessage();
    console.log('📱 Today\'s Wedding Message:');
    console.log(todaysMessage);
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Check balance first
    console.log('💰 Checking MSG91 balance...');
    const balance = await weddingService.checkBalance();
    if (balance !== null) {
      console.log(`Balance: ${balance} credits\n`);
    }
    
    // Send daily countdown
    console.log('📤 Sending daily countdown message...');
    const success = await weddingService.sendDailyCountdown();
    
    if (success) {
      console.log('\n🎉 SUCCESS! Wedding countdown message sent via MSG91!');
      console.log('✅ All recipients received today\'s message');
      console.log('📅 Next message will be sent tomorrow');
    } else {
      console.log('\n❌ Failed to send wedding message');
      console.log('🔧 Check the error messages above for details');
    }
    
  } catch (error) {
    console.error('❌ Error sending wedding message:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('• Verify MSG91 auth key is correct');
    console.log('• Check account balance');
    console.log('• Ensure phone numbers are in correct format');
  }
}

sendTodaysWeddingMessage();