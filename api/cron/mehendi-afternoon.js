// Mehendi Afternoon Message - 2 PM
const { TwilioService } = require("../../lib/twilio-service.js");
const weddingConfig = require("../../config/wedding-config.json");

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("🌞 Mehendi Afternoon Reminder - 2 PM");

    const message = `🎨 AFIFA & REHAN - MEHENDI IN 4 HOURS! 🎨

Afternoon reminder: The beautiful Mehendi ceremony is just 4 hours away! 

🕕 Time: 6:00 PM TODAY
🌿 Get ready for stunning henna artistry!

Come with comfortable clothes and excitement for intricate designs! 

See you for the artistic celebration! ✨

Countdown: afifaziya.com

From: AFIFA & REHAN`;

    const smsService = new TwilioService(
      weddingConfig.messaging.twilio.accountSid,
      weddingConfig.messaging.twilio.authToken,
      weddingConfig.messaging.twilio.fromNumber
    );
    const phoneNumbers = weddingConfig.messaging.phoneNumbers;

    const result = await smsService.sendMessage(phoneNumbers, message);

    if (result.success) {
      console.log("✅ Mehendi afternoon SMS sent successfully!");
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        phoneNumbers: phoneNumbers,
        message: message,
        event: "mehendi-afternoon",
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("💥 Mehendi afternoon cron error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
