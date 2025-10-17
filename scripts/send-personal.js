const twilio = require("twilio");

const accountSid = "AC0a7aad18ae1dd8cea8c08c4f0d864015";
const authToken = "a65f6ddbaebe56b848911b130e7ccb14";
const fromNumber = "+16812022778";
const toNumbers = ["+917010766135"];

// Personal, non-promotional message format
const personalMessage = `Hi! Just wanted to share that Afifa and Rehan's wedding is in 5 days! 

The celebrations are:
• Oct 20: Haldi at 5pm
• Oct 21: Mehendi at 6pm  
• Oct 22: Wedding at 8pm

Hope to see you there! Check the countdown at afifaziya.com

From the family ❤️`;

async function sendPersonalMessage() {
  console.log("📱 Sending Personal Wedding Invitation Message\n");

  const client = twilio(accountSid, authToken);

  console.log("📝 Personal Message Format:");
  console.log("─".repeat(50));
  console.log(personalMessage);
  console.log("─".repeat(50));
  console.log("");

  console.log("✨ Features to avoid promotional filtering:");
  console.log('• Personal greeting ("Hi!")');
  console.log('• Family tone ("From the family")');
  console.log("• No ALL CAPS or excessive emojis");
  console.log("• Simple URL without https://");
  console.log("• Conversational language");
  console.log("• No marketing keywords");
  console.log("");

  try {
    const testNumber = toNumbers[0];
    console.log(`📤 Sending personal message to ${testNumber}...`);

    const message = await client.messages.create({
      body: personalMessage,
      from: fromNumber,
      to: testNumber,
    });

    console.log(`✅ Personal message sent!`);
    console.log(`Message SID: ${message.sid}`);
    console.log(`Status: ${message.status}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

sendPersonalMessage();
