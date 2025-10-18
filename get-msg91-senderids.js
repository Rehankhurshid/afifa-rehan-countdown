#!/usr/bin/env node

// Get available Sender IDs from MSG91
// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require("https");

const config = {
  authKey: "473977AMhCluCy68f1908cP1",
};

function getSenderIds() {
  console.log("📋 Fetching available Sender IDs from MSG91...\n");

  const options = {
    method: "GET",
    hostname: "control.msg91.com",
    port: 443,
    path: "/api/v5/sms/senderid?authkey=" + config.authKey,
    headers: {
      accept: "application/json",
      authkey: config.authKey,
    },
  };

  https
    .get(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          console.log("📥 MSG91 Response:");
          console.log(`Status: ${res.statusCode}\n`);

          if (responseData) {
            try {
              const jsonResponse = JSON.parse(responseData);
              console.log(JSON.stringify(jsonResponse, null, 2));
            } catch (e) {
              console.log("Raw response:", responseData);
            }
          }
        } catch (error) {
          console.error("❌ Error:", error);
        }
      });
    })
    .on("error", (error) => {
      console.error("❌ Error:", error);
    });
}

getSenderIds();
