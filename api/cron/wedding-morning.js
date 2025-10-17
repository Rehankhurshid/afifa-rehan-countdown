// Wedding Morning Message - 10 AM
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

    console.log('💒 Wedding Morning Message - 10 AM');
    
    const message = `💒 AFIFA & REHAN - WEDDING DAY! 💒

Good morning! TODAY IS OUR WEDDING DAY! ✨🎉

🕗 Nikah Ceremony: TODAY at 8:00 PM
The moment we've all been waiting for is finally here! 

Our journey of love culminates today! 💍

This is the day our two hearts become one! 

Countdown: afifaziya.com

From: AFIFA & REHAN`;

    const smsService = new Fast2SMSService(weddingConfig.messaging.fast2sms.apiKey);
    const phoneNumbers = weddingConfig.messaging.phoneNumbers;
    
    const result = await smsService.sendMessage(phoneNumbers, message);
    
    if (result.success) {
      console.log('✅ Wedding morning SMS sent successfully!');
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        phoneNumbers: phoneNumbers,
        message: message,
        event: 'wedding-morning',
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
    console.error('💥 Wedding morning cron error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}