#!/usr/bin/env node

// Test MSG91 v5 Flow API - Send test message to 7010766135
// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require("https");

const config = {
  authKey: "473977AMhCluCy68f1908cP1",
  phoneNumber: "7010766135",
  templateId: "YOUR_TEMPLATE_ID_HERE", // You need to replace this with your actual template ID
};

function sendMsg91FlowTest() {
  const phoneNumber = "91" + config.phoneNumber; // Format: 917010766135

  const message =
    "🎉 Test Message from Afifa & Rehan Wedding Countdown! This is a test message from MSG91 API v5 Flow. 💕 Visit: https://www.afifaziya.com/";

  // Build the request body according to MSG91 v5 Flow API format
  const data = JSON.stringify({
    template_id: config.templateId,
    short_url: "0", // Disable short URLs
    realTimeResponse: "1", // Get real-time response
    recipients: [
      {
        mobiles: phoneNumber,
        VAR1: message,
      },
    ],
  });

  console.log("📤 Sending test message via MSG91 v5 Flow API...");
  console.log(`To: ${phoneNumber}`);
  console.log(`Template ID: ${config.templateId}`);
  console.log(`Message: ${message}\n`);

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
        console.log(`Status: ${res.statusCode}`);
        console.log("Headers:", res.headers);

        if (responseData) {
          try {
            const jsonResponse = JSON.parse(responseData);
            console.log(JSON.stringify(jsonResponse, null, 2));

            if (jsonResponse.type === "success" || res.statusCode === 200) {
              console.log("\n✅ Message sent successfully!");
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

  console.log("📤 Request body:", data);
  console.log("\n");
  req.write(data);
  req.end();
}

// Check if template ID is set
if (config.templateId === "YOUR_TEMPLATE_ID_HERE") {
  console.log("⚠️  TEMPLATE ID REQUIRED!");
  console.log("\nTo use the MSG91 v5 Flow API:");
  console.log("1. Log in to https://control.msg91.com/");
  console.log("2. Go to SMS > Templates");
  console.log("3. Create or get your template ID");
  console.log("4. Replace 'YOUR_TEMPLATE_ID_HERE' in this script");
  console.log("5. Run the test again\n");
  console.log("Template format example:");
  console.log('  "Hi {{VAR1}}, Welcome to Afifa & Rehan Wedding Countdown!"');
  console.log(
    "\nOr run the simpler sendhttp.php test instead (no template needed)"
  );
} else {
  // Run the test
  sendMsg91FlowTest();
}
