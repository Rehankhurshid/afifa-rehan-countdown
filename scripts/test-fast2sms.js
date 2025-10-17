// Fast2SMS Test Script for Wedding Messages

const { Fast2SMSService } = require("../lib/fast2sms-service");

// Configuration
const FAST2SMS_API_KEY =
  "2d6tZjXsRnrkEYgMwhOeSxuvGW809TqyNKbIDopJ3ziUaAB54f2jaUpWN9u8Owr5vQ4dtRXTPeMzCYcJ";
const TEST_NUMBERS = ["7010766135"]; // Your number without +91

// Wedding message
const weddingMessage = `Hi! Afifa and Rehan's wedding is in 5 days! 

The celebrations are:
• Oct 20: Haldi at 5pm
• Oct 21: Mehendi at 6pm  
• Oct 22: Wedding at 8pm

Hope to see you there!

From the family ❤️`;

async function testFast2SMS() {
  console.log("🇮🇳 Fast2SMS Wedding Message Test 🇮🇳\n");

  if (FAST2SMS_API_KEY === "YOUR_FAST2SMS_API_KEY_HERE") {
    console.log("❌ Please update FAST2SMS_API_KEY in the script first!");
    console.log("");
    console.log("📋 Setup Steps:");
    console.log("1. Go to https://www.fast2sms.com/");
    console.log("2. Sign up for free account");
    console.log("3. Go to Dev API section");
    console.log("4. Copy your API Authorization Key");
    console.log("5. Update FAST2SMS_API_KEY in this script");
    console.log("6. Run the test again");
    return;
  }

  // Initialize Fast2SMS service
  const smsService = new Fast2SMSService(FAST2SMS_API_KEY);

  console.log("💰 Checking account balance...");
  const balance = await smsService.checkBalance();

  if (balance === null) {
    console.log("❌ Unable to check balance. Please verify your API key.");
    return;
  }

  if (balance < 1) {
    console.log(
      "❌ Insufficient balance. Please recharge your Fast2SMS account."
    );
    console.log("💡 You can get free credits by signing up!");
    return;
  }

  console.log("📱 Test Configuration:");
  console.log(`API Key: ${FAST2SMS_API_KEY.substring(0, 10)}...`);
  console.log(`Test Numbers: ${TEST_NUMBERS.join(", ")}`);
  console.log("");

  console.log("📝 Message to Send:");
  console.log("─".repeat(50));
  console.log(weddingMessage);
  console.log("─".repeat(50));
  console.log("");

  console.log("🚀 Sending test message...");

  const result = await smsService.sendMessage(TEST_NUMBERS, weddingMessage);

  if (result.success) {
    console.log("🎉 Test completed successfully!");
    console.log("✅ Fast2SMS is working perfectly for your wedding messages!");
    console.log("");
    console.log("🎯 Next Steps:");
    console.log("1. Update wedding-config.json with Fast2SMS settings");
    console.log("2. Add all guest phone numbers");
    console.log("3. Start the automated messaging system");
  } else {
    console.log("❌ Test failed. Please check:");
    console.log("• API key is correct");
    console.log("• Phone numbers are valid Indian numbers");
    console.log("• Account has sufficient balance");
    console.log("• Internet connection is working");
  }
}

// Run the test
testFast2SMS().catch(console.error);

// Export for other scripts
module.exports = { testFast2SMS };
