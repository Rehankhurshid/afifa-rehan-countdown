const twilio = require("twilio");

const accountSid = "AC0a7aad18ae1dd8cea8c08c4f0d864015";
const authToken = "a65f6ddbaebe56b848911b130e7ccb14";
const messageSid = "SM24ab23374a877002c2683ff0b603b3bb"; // From the test

const client = twilio(accountSid, authToken);

async function checkMessageStatus() {
  console.log("📋 Checking message delivery status...\n");

  try {
    const message = await client.messages(messageSid).fetch();

    console.log("📱 Message Details:");
    console.log(`SID: ${message.sid}`);
    console.log(`Status: ${message.status}`);
    console.log(`To: ${message.to}`);
    console.log(`From: ${message.from}`);
    console.log(`Direction: ${message.direction}`);
    console.log(`Date Created: ${message.dateCreated}`);
    console.log(`Date Updated: ${message.dateUpdated}`);

    if (message.errorCode) {
      console.log(`❌ Error Code: ${message.errorCode}`);
      console.log(`❌ Error Message: ${message.errorMessage}`);
    }

    console.log("\n📊 Status Meanings:");
    console.log("• queued: Message is queued for sending");
    console.log("• sending: Currently being sent");
    console.log("• sent: Successfully sent to carrier");
    console.log("• delivered: Delivered to recipient");
    console.log("• failed: Failed to deliver");
    console.log("• undelivered: Could not be delivered");

    if (message.status === "delivered") {
      console.log("\n✅ Message was delivered successfully!");
      console.log("Check your phone for the message.");
    } else if (
      message.status === "failed" ||
      message.status === "undelivered"
    ) {
      console.log("\n❌ Message delivery failed.");
      console.log("This could be due to:");
      console.log("• Invalid phone number");
      console.log("• Phone is off or out of coverage");
      console.log("• Carrier blocking international SMS");
      console.log("• Phone number is not verified in Twilio trial");
    } else {
      console.log("\n⏳ Message is still being processed...");
      console.log("Wait a few minutes and check again.");
    }
  } catch (error) {
    console.error("❌ Error checking status:", error.message);
  }
}

checkMessageStatus();
