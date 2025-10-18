#!/usr/bin/env node

// Test MSG91 Simple SMS API - Send to 7010766135 only
// No template approval needed
// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require("https");

const config = {
  authKey: "473977AMhCluCy68f1908cP1",
  phoneNumber: "917010766135", // Already formatted with 91 prefix
};

function testSimpleSMS() {
  const message = `🎉 Wedding Countdown Update! 💍

Only 4 days left until Afifa & Rehan's beautiful Nikah!

⏰ Nikah Time: Oct 22 at 8:00 PM

🌟 Event Schedule:
• Haldi: Oct 20 at 5 PM
• Mehendi: Oct 21 at 6 PM  
• Nikah: Oct 22 at 8 PM

💕 Visit: https://www.afifaziya.com/
From: Afifa & Rehan`;

  // MSG91 Simple SMS API (sendhttp.php)
  const queryParams = new URLSearchParams({
    authkey: config.authKey,
    mobiles: config.phoneNumber,
    message: message,
    sender: "rehankh90", // Your sender ID
    route: "4", // Transactional route
    country: "91",
  });

  const path = `/api/sendhttp.php?${queryParams.toString()}`;

  console.log("🚀 TESTING MSG91 SIMPLE SMS API\n");
  console.log("=".repeat(60));
  console.log("\n📱 Test Configuration:");
  console.log(`Phone Number: ${config.phoneNumber}`);
  console.log(`Auth Key: ${config.authKey}`);
  console.log(`Sender ID: rehankh90`);
  console.log(`API: Simple SMS (No Template Needed)\n`);

  console.log("📤 Sending message...\n");

  https
    .get(`https://control.msg91.com${path}`, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          console.log("✅ MSG91 Response:");
          console.log(`Status: ${res.statusCode}\n`);

          // Try to parse as JSON
          try {
            const response = JSON.parse(data);
            console.log(JSON.stringify(response, null, 2));

            if (response.type === "success") {
              console.log("\n✅ MESSAGE SENT SUCCESSFULLY!");
              if (response.message && response.message[0]) {
                console.log(`Message ID: ${response.message[0].msgid}`);
              }
            }
          } catch (e) {
            // If not JSON, it might be hex-encoded message ID
            console.log("Raw response:", data);

            // Check if it looks like a hex message ID
            if (/^[0-9a-f]+$/.test(data.trim())) {
              try {
                const decoded = Buffer.from(data.trim(), "hex").toString(
                  "utf-8"
                );
                console.log("\n✅ MESSAGE SENT SUCCESSFULLY!");
                console.log(`Message ID: ${decoded}`);
              } catch (e2) {
                console.log("Message ID (hex):", data.trim());
              }
            }
          }
        } catch (error) {
          console.error("❌ Error parsing response:", error);
        }
      });
    })
    .on("error", (error) => {
      console.error("❌ Error sending request:", error);
    });
}

testSimpleSMS();
