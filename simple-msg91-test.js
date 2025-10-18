const https = require("https");

const authKey = "473977AMhCluCy68f1908cP1";
const phoneNumber = "917010766135"; // Full number with country code
const message = "Test message from AFIFA & REHAN countdown";

const queryParams = new URLSearchParams({
  authkey: authKey,
  mobiles: phoneNumber,
  message: message,
  sender: "MSGIND",
  route: "4",
  country: "91",
});

const path = `/api/sendhttp.php?${queryParams.toString()}`;

console.log("📤 Sending MSG91 test...");
console.log("Auth Key:", authKey);
console.log("Phone:", phoneNumber);
console.log("Path:", path.substring(0, 80) + "...");

const options = {
  method: "GET",
  hostname: "control.msg91.com",
  port: null,
  path: path,
  headers: {
    accept: "application/json",
  },
};

const req = https.request(options, (res) => {
  const chunks = [];

  res.on("data", (chunk) => {
    chunks.push(chunk);
  });

  res.on("end", () => {
    const body = Buffer.concat(chunks).toString();
    console.log("\n📨 Response from MSG91:");
    console.log(body);
  });
});

req.on("error", (error) => {
  console.error("❌ Error:", error);
});

req.end();
