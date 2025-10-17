// Wedding Ceremony Time - 8 PM
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

    console.log('💒 Wedding Ceremony Starting NOW - 8 PM');
    
    const message = `💒 AFIFA & REHAN - NIKAH STARTING NOW! 💒

The sacred Nikah ceremony is beginning RIGHT NOW! 💍✨

🕗 Time: 8:00 PM - LIVE!
💫 Two hearts becoming one!

This is the moment our love story becomes eternal! 

Thank you for being part of this blessed union! 🙏

May Allah bless our new journey together! 

Countdown: afifaziya.com

From: MR. & MRS. AFIFA & REHAN ❤️`;

    const smsService = new Fast2SMSService(weddingConfig.messaging.fast2sms.apiKey);
    const phoneNumbers = weddingConfig.messaging.phoneNumbers;
    
    const result = await smsService.sendMessage(phoneNumbers, message);
    
    if (result.success) {
      console.log('✅ Wedding ceremony SMS sent successfully!');
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        phoneNumbers: phoneNumbers,
        message: message,
        event: 'wedding-ceremony',
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
    console.error('💥 Wedding ceremony cron error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}