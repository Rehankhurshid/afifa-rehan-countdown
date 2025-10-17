// Haldi Ceremony Message - 5 PM
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

    console.log("🌅 Haldi Ceremony Starting NOW - 5 PM");

    const message = `🌟 AFIFA & REHAN - HALDI STARTING NOW! 🌟

The beautiful Haldi ceremony is beginning RIGHT NOW! 💛✨

🕔 Time: 5:00 PM - LIVE!
🌼 Let the turmeric blessings flow!

May this sacred ceremony bring joy, prosperity, and golden memories! 

Thank you for being part of our journey! 🙏

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
      console.log("✅ Haldi ceremony SMS sent successfully!");
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        phoneNumbers: phoneNumbers,
        message: message,
        event: "haldi-ceremony",
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
    console.error("💥 Haldi ceremony cron error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
