// Wedding Afternoon Message - 2 PM
const { Fast2SMSService } = require("../../lib/fast2sms-service.js");
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

    console.log("💍 Wedding Afternoon Reminder - 2 PM");

    const message = `💍 AFIFA & REHAN - NIKAH IN 6 HOURS! 💍

Afternoon reminder: Our sacred Nikah ceremony is just 6 hours away! 

🕗 Time: 8:00 PM TODAY
💒 The blessed union is almost here!

Get ready to witness the most beautiful moment of our lives! 

We can't wait to celebrate with all of you! ✨

Countdown: afifaziya.com

From: AFIFA & REHAN`;

    const smsService = new Fast2SMSService(
      weddingConfig.messaging.fast2sms.apiKey
    );
    const phoneNumbers = weddingConfig.messaging.phoneNumbers;

    const result = await smsService.sendMessage(phoneNumbers, message);

    if (result.success) {
      console.log("✅ Wedding afternoon SMS sent successfully!");
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        phoneNumbers: phoneNumbers,
        message: message,
        event: "wedding-afternoon",
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
    console.error("💥 Wedding afternoon cron error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
