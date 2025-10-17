// Mehendi Ceremony Time - 6 PM
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

    console.log('🎨 Mehendi Ceremony Starting NOW - 6 PM');
    
    const message = `🌿 AFIFA & REHAN - MEHENDI STARTING NOW! 🌿

The beautiful Mehendi ceremony is beginning RIGHT NOW! 🎨✨

🕕 Time: 6:00 PM - LIVE!
🌸 Let the henna artistry begin!

May these intricate designs bring beauty, love, and cherished memories! 

Thank you for celebrating this artistic tradition with us! 🙏

Countdown: afifaziya.com

From: AFIFA & REHAN`;

    const smsService = new Fast2SMSService(weddingConfig.messaging.fast2sms.apiKey);
    const phoneNumbers = weddingConfig.messaging.phoneNumbers;
    
    const result = await smsService.sendMessage(phoneNumbers, message);
    
    if (result.success) {
      console.log('✅ Mehendi ceremony SMS sent successfully!');
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        phoneNumbers: phoneNumbers,
        message: message,
        event: 'mehendi-ceremony',
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
    console.error('💥 Mehendi ceremony cron error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}