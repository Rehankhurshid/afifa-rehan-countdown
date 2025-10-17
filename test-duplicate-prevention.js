const { Fast2SMSService } = require("./lib/fast2sms-service.js");
const { generateDailyCountdownMessage } = require("./lib/wedding-messages.ts");
const {
  canSendMessage,
  markMessageSent,
} = require("./lib/sms-state-tracker.ts");

async function testDuplicatePrevention() {
  try {
    console.log("🔒 TESTING DUPLICATE PREVENTION SYSTEM\n");

    const fast2sms = new Fast2SMSService(
      "2d6tZjXsRnrkEYgMwhOeSxuvGW809TqyNKbIDopJ3ziUaAB54f2jaUpWN9u8Owr5vQ4dtRXTPeMzCYcJ"
    );
    const phoneNumber = "7010766135";
    const message = generateDailyCountdownMessage();

    console.log("Message to send:");
    console.log(message);
    console.log("\n" + "=".repeat(50) + "\n");

    // First attempt
    console.log("🔍 First send attempt...");
    if (canSendMessage("daily")) {
      console.log("✅ Can send message - proceeding...");
      const result = await fast2sms.sendMessage(phoneNumber, message);

      if (result.success) {
        markMessageSent("daily", result.messageId);
        console.log(`✅ Message sent successfully! ID: ${result.messageId}`);
      } else {
        console.log(`❌ Failed to send: ${result.error}`);
        return;
      }
    } else {
      console.log("⚠️ Cannot send - duplicate prevention active");
    }

    console.log("\n" + "=".repeat(50) + "\n");

    // Second attempt (should be blocked)
    console.log("🔍 Second send attempt (should be blocked)...");
    if (canSendMessage("daily")) {
      console.log("⚠️ Duplicate prevention failed - would send again!");
    } else {
      console.log("✅ Duplicate prevention working - blocked second send");
    }
  } catch (error) {
    console.error("Error during test:", error);
  }
}

testDuplicatePrevention();
