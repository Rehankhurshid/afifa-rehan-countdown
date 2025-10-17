// Simple MSG91 Auth Test
const https = require("https");

async function testMSG91Auth() {
  const authKey = "473977AMhCluCy68f1908cP1";

  console.log("🔑 Testing MSG91 Authentication");
  console.log("Auth Key:", authKey);
  console.log("Testing balance endpoint...\n");

  // Test balance endpoint first
  const balanceOptions = {
    method: "GET",
    hostname: "control.msg91.com",
    port: null,
    path: `/api/balance.php?authkey=${authKey}&type=4`,
    headers: {
      accept: "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(balanceOptions, (res) => {
      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const body = Buffer.concat(chunks);
        const response = body.toString();

        console.log("Status Code:", res.statusCode);
        console.log("Response Headers:", res.headers);
        console.log("Raw Response:", response);

        try {
          const jsonResponse = JSON.parse(response);
          console.log("Parsed JSON:", jsonResponse);

          if (jsonResponse.balance !== undefined) {
            console.log(
              `✅ Auth successful! Balance: ${jsonResponse.balance} credits`
            );
            resolve(jsonResponse.balance);
          } else if (jsonResponse.message) {
            console.log(`❌ Error: ${jsonResponse.message}`);
            resolve(null);
          } else {
            console.log("⚠️ Unexpected response format");
            resolve(null);
          }
        } catch (parseError) {
          console.log("Raw response (not JSON):", response);
          if (
            response.includes("Invalid") ||
            response.includes("Authentication")
          ) {
            console.log("❌ Authentication failed");
          } else {
            console.log("⚠️ Unknown response format");
          }
          resolve(null);
        }
      });
    });

    req.on("error", (error) => {
      console.error("❌ Request Error:", error);
      reject(error);
    });

    req.end();
  });
}

testMSG91Auth().catch(console.error);
