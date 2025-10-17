// Simple Twilio SMS test
const twilio = require("twilio");

// Test configuration from your setup
const accountSid = "AC0a7aad18ae1dd8cea8c08c4f0d864015";
const authToken = "a65f6ddbaebe56b848911b130e7ccb14";
const fromNumber = "+16812022778";
const toNumbers = ["+917010766135"];

// Sample wedding countdown message
const testMessage = `💖 5 DAYS TO GO! 💖

Afifa and Rehan's special day is getting closer! Time to start the final preparations! ✨

🎭 Wedding Schedule:
• Oct 20: Haldi Ceremony at 5 PM
• Oct 21: Mehendi Celebration at 6 PM  
• Oct 22: Nikah Ceremony at 8 PM

Countdown: https://www.afifaziya.com/`;

async function testTwilio() {
  console.log("🎊 Afifa & Rehan Wedding SMS Test 🎊\n");

  // Initialize Twilio client
  const client = twilio(accountSid, authToken);

  console.log("📱 Configuration:");
  console.log(`From: ${fromNumber}`);
  console.log(`To: ${toNumbers.join(", ")}`);
  console.log("");

  console.log("📝 Test Message:");
  console.log("─".repeat(50));
  console.log(testMessage);
  console.log("─".repeat(50));
  console.log("");

  console.log("🧪 Testing Twilio connection...");

  try {
    // Test with just one number first
    const testNumber = toNumbers[0];
    console.log(`📤 Sending test SMS to ${testNumber}...`);

    const message = await client.messages.create({
      body: testMessage,
      from: fromNumber,
      to: testNumber,
    });

    console.log(`✅ SMS sent successfully!`);
    console.log(`Message SID: ${message.sid}`);
    console.log(`Status: ${message.status}`);

    console.log("\n🎯 Test completed successfully!");
    console.log("Your Twilio SMS is working perfectly.");
    console.log("\nTo send to all numbers, run the full messaging system.");
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);

    if (error.code) {
      console.error(`Error Code: ${error.code}`);
    }

    console.log("\n🔧 Troubleshooting:");
    console.log("1. Verify your Twilio credentials");
    console.log("2. Check if your Twilio phone number is verified");
    console.log("3. Ensure recipient numbers are in correct format");
    console.log("4. Check your Twilio account balance");
  }
}

// Only run test if explicitly confirmed
console.log("🚨 This will send a REAL SMS message!");
console.log("Testing now...");

// Run the actual test:
testTwilio().catch(console.error);
