#!/usr/bin/env node

// Test MSG91 v5 Flow API with Template
// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require("https");

const config = {
  authKey: "473977AMhCluCy68f1908cP1",
  templateId: "68f23e859462012a75669ec3",
  phoneNumbers: ["917010766135", "919073236126"],
};

function sendTestWithTemplate() {
  const phoneNumbers = config.phoneNumbers; // Already formatted with 91 prefix

  const countdownMessage = `
⏰ COUNTDOWN UPDATE:
Days Left: 5 days 🎊
Time: 20:00 (8:00 PM)

Get ready for the most beautiful celebration! 💕
  `;

  // Build the request body according to MSG91 v5 Flow API format
  const data = JSON.stringify({
    template_id: config.templateId,
    short_url: "0",
    realTimeResponse: "1",
    recipients: phoneNumbers.map((mobile) => ({
      mobiles: mobile,
      VAR1: countdownMessage.trim(),
    })),
  });

  console.log(
    "📤 Sending test message via MSG91 v5 Flow API with Template...\n"
  );
  console.log(`Template ID: ${config.templateId}`);
  console.log(`Phone Numbers: ${phoneNumbers.join(", ")}`);
  console.log(`Message Variable (VAR1):\n${countdownMessage}\n`);
  console.log("=".repeat(60) + "\n");

  const options = {
    method: "POST",
    hostname: "control.msg91.com",
    port: 443,
    path: "/api/v5/flow",
    headers: {
      accept: "application/json",
      authkey: config.authKey,
      "content-type": "application/json",
    },
  };

  const req = https.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      try {
        console.log("✅ MSG91 v5 Flow API Response:");
        console.log(`Status: ${res.statusCode}\n`);

        if (responseData) {
          try {
            const jsonResponse = JSON.parse(responseData);
            console.log(JSON.stringify(jsonResponse, null, 2));

            if (jsonResponse.type === "success" || res.statusCode === 200) {
              console.log("\n✅ Message sent successfully with template!");
            } else {
              console.log("\n⚠️ Check the response above for details");
            }
          } catch (e) {
            console.log("Raw response:", responseData);
          }
        }
      } catch (error) {
        console.error("❌ Error parsing response:", error);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Error sending request:", error);
  });

  req.write(data);
  req.end();
}

// Run the test
sendTestWithTemplate();
