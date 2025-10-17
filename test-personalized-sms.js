const { Fast2SMSService } = require("./lib/fast2sms-service.js");
const {
  generateDailyCountdownMessage,
  generateEventMessages,
  WEDDING_EVENTS,
} = require("./lib/wedding-messages.ts");

async function testPersonalizedMessage() {
  try {
    console.log(
      "Testing personalized wedding message without website link...\n"
    );

    // Initialize Fast2SMS service
    const fast2sms = new Fast2SMSService(
      "2d6tZjXsRnrkEYgMwhOeSxuvGW809TqyNKbIDopJ3ziUaAB54f2jaUpWN9u8Owr5vQ4dtRXTPeMzCYcJ"
    );

    // Get a sample daily message
    const dailyMessage = generateDailyCountdownMessage();
    console.log("Daily message to send:");
    console.log(dailyMessage);
    console.log("\n" + "=".repeat(50) + "\n");

    // Send the message
    const result = await fast2sms.sendMessage("7010766135", dailyMessage);

    if (result.success) {
      console.log("✅ Personalized message sent successfully!");
      console.log("Message ID:", result.messageId);
      console.log("Response:", result.response);
    } else {
      console.log("❌ Failed to send message");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testPersonalizedMessage();
