// Next.js API Route for Vercel Cron Job
// Import our messaging services
const { Fast2SMSService } = require('../../lib/fast2sms-service.js');
const { generateDailyCountdownMessage } = require('../../lib/wedding-messages.ts');
const { canSendMessage, markMessageSent } = require('../../lib/sms-state-tracker.ts');
const weddingConfig = require('../../config/wedding-config.json');

export default async function handler(req, res) {
  // Only allow GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify this is a legitimate cron request (security check)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🚀 Starting daily wedding message cron job at 2 PM...');
    
    // Re-enable duplicate prevention for daily messages
    const messageType = 'daily';
    const canSend = canSendMessage(messageType);
    
    if (!canSend) {
      console.log('⚠️ Daily message already sent today - skipping');
      return res.status(200).json({ 
        success: true, 
        message: 'Daily message already sent today',
        skipped: true 
      });
    }

    // Generate the daily countdown message
    const message = generateDailyCountdownMessage();
    console.log('📝 Generated message:', message);

    // Initialize Fast2SMS service
    const smsService = new Fast2SMSService(weddingConfig.messaging.fast2sms.apiKey);
    
    // Get phone numbers from config
    const phoneNumbers = weddingConfig.messaging.phoneNumbers;
    console.log('📞 Target numbers:', phoneNumbers);

    // Send the SMS
    const result = await smsService.sendMessage(phoneNumbers, message);
    
    if (result.success) {
      // Mark message as sent to prevent duplicates
      markMessageSent(messageType);
      
      console.log('✅ Daily SMS sent successfully!');
      console.log('📱 Message ID:', result.messageId);
      
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        phoneNumbers: phoneNumbers,
        message: message,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Failed to send SMS:', result.error);
      
      return res.status(500).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('💥 Cron job error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}