#!/usr/bin/env node

// MSG91 v5 Flow API - Send SMS with Template
// Using the exact format from MSG91 documentation
// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require("https");

const config = {
  authKey: "473977AMhCluCy68f1908cP1",
  templateId: "68f241016f2ec4660c7c1bc5", // Wedding Day Event Time Notification
  phoneNumber: "917010766135", // Already formatted with 91 prefix
};

function sendSmsViaMsg91Flow() {
  console.log("🚀 SENDING SMS VIA MSG91 v5 FLOW API\n");
  console.log("=".repeat(70));

  // Build the request body according to MSG91 v5 Flow API format
  const data = JSON.stringify({
    template_id: config.templateId,
    short_url: "0", // Disable short URLs
    realTimeResponse: "1", // Get real-time response
    recipients: [
      {
        mobiles: config.phoneNumber,
        VAR1: "🎉 The Nikah is Starting Now! 💍\n\nThe moment we've been waiting for has arrived!\n\n🎊 Join us to witness the beautiful ceremony\n🌟 Afifa & Rehan's blessed union\n\n💕 Welcome to the celebration!\nhttps://www.afifaziya.com/",
      },
    ],
  });

  console.log("\n📝 Request Details:");
  console.log(`URL: https://control.msg91.com/api/v5/flow`);
  console.log(`Method: POST`);
  console.log(`Content-Type: application/json`);
  console.log(`Auth Key: ${config.authKey}`);
  console.log(`\n📋 Request Body:`);
  console.log(JSON.stringify(JSON.parse(data), null, 2));

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

  console.log("\n📤 Sending request...\n");

  const req = https.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("=".repeat(70));
      console.log("\n📥 MSG91 API Response:");
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`\nResponse Headers:`);
      Object.entries(res.headers).forEach(([key, value]) => {
        if (key !== "set-cookie") {
          console.log(`  ${key}: ${value}`);
        }
      });

      console.log(`\nResponse Body:`);
      if (responseData) {
        try {
          const jsonResponse = JSON.parse(responseData);
          console.log(JSON.stringify(jsonResponse, null, 2));

          // Check response
          console.log("\n" + "=".repeat(70));
          if (jsonResponse.type === "success") {
            console.log("\n✅ SUCCESS! SMS Sent Successfully");
            if (jsonResponse.message) {
              console.log(`Message ID: ${jsonResponse.message}`);
            }
          } else if (
            jsonResponse.message &&
            jsonResponse.message.includes("Template Not Yet Approved")
          ) {
            console.log("\n⏳ TEMPLATE PENDING APPROVAL");
            console.log("The template is awaiting MSG91 approval.");
            console.log("Check your email for approval status.");
            console.log(
              "\n💡 Tip: Use the simple SMS API (sendhttp.php) for immediate delivery"
            );
            console.log("   Run: node test-msg91-simple.js");
          } else if (jsonResponse.hasError) {
            console.log("\n❌ Error:");
            console.log(jsonResponse.errors);
          } else {
            console.log("\n⚠️ Response received - Check details above");
          }
        } catch (e) {
          console.log("Raw response:", responseData);
        }
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
sendSmsViaMsg91Flow();
