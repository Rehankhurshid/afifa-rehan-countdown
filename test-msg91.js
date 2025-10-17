const { MSG91Service } = require("./lib/msg91-service.js");
const { generateDailyCountdownMessage } = require("./lib/wedding-messages.ts");

async function testMSG91() {
  try {
    console.log("🚀 TESTING MSG91 SMS SERVICE\n");

    // You'll need to replace this with your actual MSG91 auth key
    const authKey = "YOUR_MSG91_AUTH_KEY_HERE";

    if (authKey === "YOUR_MSG91_AUTH_KEY_HERE") {
      console.log("❌ Please update the MSG91 auth key in the script");
      console.log("💡 Get your auth key from: https://control.msg91.com/user/");
      return;
    }

    const msg91 = new MSG91Service(authKey);
    const phoneNumber = "7010766135";
    const message = generateDailyCountdownMessage();

    console.log("📱 Message to send:");
    console.log(message);
    console.log("\n" + "=".repeat(50) + "\n");

    console.log("📤 Sending via MSG91...");
    const result = await msg91.sendMessage(phoneNumber, message);

    if (result.success) {
      console.log("✅ MESSAGE SENT SUCCESSFULLY VIA MSG91!");
      console.log("Message ID:", result.messageId);
      console.log("Response:", result.response);

      // Check balance
      console.log("\n💰 Checking account balance...");
      const balance = await msg91.checkBalance();
      if (balance !== null) {
        console.log(`Balance: ${balance} credits`);
      }
    } else {
      console.log("❌ Failed to send message");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.error("Error during MSG91 test:", error);
  }
}

console.log("⚠️  SETUP REQUIRED:");
console.log("1. Sign up at https://msg91.com/");
console.log("2. Get your Auth Key from https://control.msg91.com/user/");
console.log("3. Replace YOUR_MSG91_AUTH_KEY_HERE in this script");
console.log("4. Run the test again\n");

// Uncomment the line below after adding your auth key
// testMSG91();
