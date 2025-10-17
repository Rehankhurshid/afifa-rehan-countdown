// Haldi Morning Message - 10 AM
const { Fast2SMSService } = require('../../lib/fast2sms-service.js');
const weddingConfig = require('../../config/wedding-config.json');

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🌅 Haldi Morning Message - 10 AM');
    
    const message = `🌟 AFIFA & REHAN - HALDI DAY! 🌟

Good morning! Today is the beautiful Haldi ceremony day! ✨

🕔 Haldi Ceremony: TODAY at 5:00 PM
Get ready for turmeric, joy, and blessings! 

The celebrations begin in just a few hours! 💛

Countdown: afifaziya.com

From: AFIFA & REHAN`;

    const smsService = new Fast2SMSService(weddingConfig.messaging.fast2sms.apiKey);
    const phoneNumbers = weddingConfig.messaging.phoneNumbers;
    
    const result = await smsService.sendMessage(phoneNumbers, message);
    
    if (result.success) {
      console.log('✅ Haldi morning SMS sent successfully!');
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        phoneNumbers: phoneNumbers,
        message: message,
        event: 'haldi-morning',
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('💥 Haldi morning cron error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}