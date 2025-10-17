// Script to get Indian Twilio number for better local delivery

const twilio = require("twilio");

const accountSid = "AC0a7aad18ae1dd8cea8c08c4f0d864015";
const authToken = "a65f6ddbaebe56b848911b130e7ccb14";

async function getIndianNumber() {
  console.log("🇮🇳 Getting Indian Phone Number from Twilio\n");

  const client = twilio(accountSid, authToken);

  try {
    console.log("🔍 Searching for available Indian numbers...");

    // Search for Indian numbers
    const numbers = await client
      .availablePhoneNumbers("IN")
      .mobile.list({ limit: 5 });

    if (numbers.length > 0) {
      console.log("📱 Available Indian numbers:");
      numbers.forEach((number, index) => {
        console.log(
          `${index + 1}. ${number.phoneNumber} - ${number.locality || "India"}`
        );
      });

      console.log("\n💰 To purchase a number:");
      console.log("1. Go to Twilio Console > Phone Numbers");
      console.log("2. Buy Numbers > Search for Indian numbers");
      console.log("3. Purchase one for ~$1-2/month");
      console.log("4. Update your config with the new number");
    } else {
      console.log("❌ No Indian numbers available right now");
      console.log(
        "💡 Alternative: Use your current US number - it still works!"
      );
    }
  } catch (error) {
    console.error("❌ Error searching numbers:", error.message);

    if (error.message.includes("not supported")) {
      console.log("\n💡 Indian numbers might not be available in your region");
      console.log("🔄 Alternatives:");
      console.log("1. Use WhatsApp templates (recommended)");
      console.log("2. Keep current US number");
      console.log("3. Try UK/Canada numbers (+44, +1)");
    }
  }
}

getIndianNumber();
