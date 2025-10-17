// Test script for Vercel Cron Function
const http = require("http");

async function testCronFunction() {
  console.log("🧪 Testing Vercel Cron Function...\n");

  // Test locally (when running `npm run dev`)
  const hostname = "localhost";
  const port = 3000;
  const path = "/api/cron/daily-wedding-sms";

  const data = JSON.stringify({});

  const options = {
    hostname: hostname,
    port: port,
    path: path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer AfifaRehan2025Wedding!",
      "Content-Length": data.length,
    },
  };

  const req = http.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("📱 Response Status:", res.statusCode);
      console.log("📱 Response Data:");
      try {
        const parsedResponse = JSON.parse(responseData);
        console.log(JSON.stringify(parsedResponse, null, 2));
      } catch (error) {
        console.log(responseData);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request failed:", error.message);
  });

  req.write(data);
  req.end();
}

console.log("⚠️  Make sure your Next.js dev server is running:");
console.log("   npm run dev");
console.log("   Then run this test\n");

testCronFunction();
