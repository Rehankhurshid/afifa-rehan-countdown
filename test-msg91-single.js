#!/usr/bin/env node

// Test MSG91 Service - Send to 7010766135 only
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MSG91Service } = require("./lib/msg91-service.js");

async function testMsg91Service() {
  try {
    console.log("🚀 TESTING MSG91 SERVICE\n");
    console.log("=".repeat(60));

    const authKey = "473977AMhCluCy68f1908cP1";
    const msg91 = new MSG91Service(authKey, "68f241016f2ec4660c7c1bc5"); // Wedding Day Event Time Notification

    const phoneNumber = "7010766135";

    const weddingEventMessage = `
🎉 The Nikah is Starting Now! 💍

The moment we've been waiting for has arrived!

🎊 Join us to witness the beautiful ceremony
🌟 Afifa & Rehan's blessed union

💕 Welcome to the celebration!
https://www.afifaziya.com/
    `.trim();

    console.log("\n📱 Test Configuration:");
    console.log(`Phone Number: ${phoneNumber}`);
    console.log(`Auth Key: ${authKey}`);
    console.log(`Template ID: 68f241016f2ec4660c7c1bc5`);
    console.log(`Template: Wedding Day Event Time Notification`);
    console.log(`Service: MSG91 (v5 Flow API)\n`);

    console.log("📤 Sending message...\n");

    const result = await msg91.sendMessage(phoneNumber, weddingEventMessage);

    console.log("📥 MSG91 Response:");
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      console.log("\n✅ MESSAGE SENT SUCCESSFULLY!");
      console.log(`Message ID: ${result.messageId}`);
    } else {
      console.log("\n⚠️ Response received - Check details above");
      console.log("\nNote: If template not approved yet, use simple SMS API");
      console.log("Run: node test-msg91-simple.js");
    }
  } catch (error) {
    console.error("❌ Error during test:", error.message);
  }
}

testMsg91Service();
