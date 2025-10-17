const { MSG91Service } = require("./lib/msg91-service.js");
const { generateDailyCountdownMessage } = require("./lib/wedding-messages.ts");

async function setupMSG91() {
  console.log("🚀 MSG91 SETUP FOR WEDDING SMS\n");

  // Check if auth key is configured
  const config = require("./config/wedding-config.json");
  const authKey = config.messaging.msg91.authKey;

  if (authKey === "YOUR_MSG91_AUTH_KEY_HERE") {
    console.log("❌ MSG91 Auth Key not configured");
    console.log("\n📋 SETUP STEPS:");
    console.log("1. Sign up at: https://msg91.com/");
    console.log("2. Get Auth Key from: https://control.msg91.com/user/");
    console.log("3. Update config/wedding-config.json with your auth key");
    console.log("4. Run this script again");
    return;
  }

  console.log("✅ Auth Key configured");
  console.log("🧪 Testing MSG91 connection...\n");

  try {
    const msg91 = new MSG91Service(authKey);

    // Test balance check first
    console.log("💰 Checking account balance...");
    const balance = await msg91.checkBalance();

    if (balance !== null) {
      console.log(`✅ Account Balance: ${balance} credits`);
    } else {
      console.log(
        "⚠️ Could not retrieve balance (but auth key might be valid)"
      );
    }

    // Generate test message
    const message = generateDailyCountdownMessage();
    console.log("\n📱 Test message to send:");
    console.log(message);
    console.log("\n" + "=".repeat(50));

    // Confirm before sending
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("\n🤔 Send test SMS to 7010766135? (y/n): ", async (answer) => {
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        console.log("\n📤 Sending test SMS via MSG91...");

        const result = await msg91.sendMessage("7010766135", message);

        if (result.success) {
          console.log("✅ TEST SMS SENT SUCCESSFULLY!");
          console.log("Message ID:", result.messageId);
          console.log("Response:", result.response);
          console.log(
            "\n🎉 MSG91 setup complete! Ready to send wedding messages."
          );
        } else {
          console.log("❌ Failed to send test SMS");
          console.log("Error:", result.error);
          console.log("\n🔧 Please check:");
          console.log("• Auth key is correct");
          console.log("• Account has sufficient balance");
          console.log("• Phone number format is correct");
        }
      } else {
        console.log("📱 Test SMS cancelled. MSG91 setup ready when you are!");
      }
      rl.close();
    });
  } catch (error) {
    console.error("❌ MSG91 Setup Error:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("• Verify auth key is correct");
    console.log("• Check internet connection");
    console.log("• Try again in a few minutes");
  }
}

setupMSG91();
