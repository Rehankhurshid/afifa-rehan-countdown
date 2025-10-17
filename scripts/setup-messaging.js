#!/usr/bin/env node

/**
 * Wedding Messaging Configuration Setup
 *
 * This interactive script helps you configure the wedding countdown messaging system.
 * Run this to set up phone numbers, SMS service, and test the system.
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const configPath = path.join(__dirname, "../config/wedding-config.json");

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupMessaging() {
  console.log("🎊 Welcome to Afifa & Rehan Wedding Messaging Setup! 🎊\n");

  // Load current config
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error("Error reading config file:", error.message);
    process.exit(1);
  }

  console.log("📱 Current Wedding Schedule:");
  config.wedding.events.forEach((event) => {
    const date = new Date(`${event.date}T${event.time}`);
    console.log(
      `   ${
        event.name
      }: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
    );
  });
  console.log("");

  // Phone numbers setup
  console.log("📞 Phone Number Configuration");
  console.log(
    "Current phone numbers:",
    config.messaging.phoneNumbers.join(", ")
  );

  const updateNumbers = await question(
    "Do you want to update phone numbers? (y/n): "
  );

  if (updateNumbers.toLowerCase() === "y") {
    const phoneNumbers = [];
    console.log("Enter phone numbers (with country code, e.g., +1234567890)");
    console.log("Press Enter with empty input when done.");

    let phoneNumber;
    let index = 1;
    while (true) {
      phoneNumber = await question(`Phone ${index}: `);
      if (!phoneNumber.trim()) break;

      // Basic phone validation
      if (phoneNumber.match(/^\+\d{10,15}$/)) {
        phoneNumbers.push(phoneNumber.trim());
        console.log(`✅ Added: ${phoneNumber}`);
        index++;
      } else {
        console.log("❌ Invalid format. Use +1234567890 format.");
      }
    }

    if (phoneNumbers.length > 0) {
      config.messaging.phoneNumbers = phoneNumbers;
      console.log(`\n📱 Updated with ${phoneNumbers.length} phone numbers.`);
    }
  }

  // Service selection
  console.log("\n📡 Messaging Service Configuration");
  console.log("Available services:");
  console.log("1. Console (testing - messages shown in terminal)");
  console.log("2. Twilio SMS (real SMS messages)");
  console.log("3. WhatsApp Business API");
  console.log("4. Email notifications");

  const serviceChoice = await question("Choose service (1-4): ");

  switch (serviceChoice) {
    case "1":
      config.messaging.service = "console";
      console.log("✅ Set to Console mode (testing)");
      break;

    case "2":
      config.messaging.service = "twilio";
      console.log("\n🔧 Twilio SMS Configuration");
      console.log("You need to sign up at https://twilio.com and get:");
      console.log("- Account SID");
      console.log("- Auth Token");
      console.log("- A Twilio phone number");

      const accountSid = await question("Twilio Account SID: ");
      const authToken = await question("Twilio Auth Token: ");
      const fromNumber = await question(
        "Twilio Phone Number (e.g., +1234567890): "
      );

      if (accountSid && authToken && fromNumber) {
        config.messaging.twilio = {
          accountSid: accountSid.trim(),
          authToken: authToken.trim(),
          fromNumber: fromNumber.trim(),
        };
        console.log("✅ Twilio configured");
      } else {
        console.log("❌ Incomplete Twilio setup, keeping current config");
      }
      break;

    case "3":
      config.messaging.service = "whatsapp";
      const whatsappKey = await question("WhatsApp Business API Key: ");
      if (whatsappKey) {
        config.messaging.whatsapp.apiKey = whatsappKey.trim();
        console.log("✅ WhatsApp configured");
      }
      break;

    case "4":
      config.messaging.service = "email";
      const emailKey = await question("Email Service API Key: ");
      const fromEmail = await question("From Email Address: ");
      if (emailKey && fromEmail) {
        config.messaging.email = {
          apiKey: emailKey.trim(),
          fromEmail: fromEmail.trim(),
        };
        console.log("✅ Email configured");
      }
      break;

    default:
      console.log("Keeping current service configuration");
  }

  // Message timing
  console.log("\n⏰ Message Timing Configuration");
  console.log(`Current schedule:`);
  console.log(`- Daily messages: ${config.schedule.dailyMessageTime}`);
  console.log(
    `- Morning event messages: ${config.schedule.morningMessageTime}`
  );
  console.log(`- Milestone messages: ${config.schedule.milestoneMessageTime}`);

  const updateTiming = await question("Update message timing? (y/n): ");
  if (updateTiming.toLowerCase() === "y") {
    const dailyTime = await question(
      "Daily message time (HH:MM, e.g., 10:00): "
    );
    const morningTime = await question(
      "Morning message time (HH:MM, e.g., 08:00): "
    );
    const milestoneTime = await question(
      "Milestone message time (HH:MM, e.g., 12:00): "
    );

    if (dailyTime.match(/^\d{2}:\d{2}$/))
      config.schedule.dailyMessageTime = dailyTime;
    if (morningTime.match(/^\d{2}:\d{2}$/))
      config.schedule.morningMessageTime = morningTime;
    if (milestoneTime.match(/^\d{2}:\d{2}$/))
      config.schedule.milestoneMessageTime = milestoneTime;

    console.log("✅ Message timing updated");
  }

  // Save configuration
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("\n💾 Configuration saved successfully!");
  } catch (error) {
    console.error("❌ Error saving configuration:", error.message);
    process.exit(1);
  }

  // Test option
  console.log("\n🧪 Testing");
  const runTest = await question("Run a test message? (y/n): ");

  if (runTest.toLowerCase() === "y") {
    console.log("\n🚀 Running test...");

    // Import and test the messaging system
    try {
      const {
        initializeWeddingNotifications,
      } = require("../lib/messaging-scheduler");
      const notificationSystem = initializeWeddingNotifications(
        config.messaging.phoneNumbers
      );

      console.log("\n📋 Next 5 scheduled messages:");
      const upcoming = notificationSystem.getUpcomingMessages(5);
      upcoming.forEach((msg, i) => {
        console.log(
          `${
            i + 1
          }. [${msg.type.toUpperCase()}] ${msg.scheduledTime.toLocaleDateString()} ${msg.scheduledTime.toLocaleTimeString()}`
        );
        console.log(`   Preview: ${msg.message.substring(0, 60)}...`);
      });

      if (config.messaging.service === "console") {
        console.log("\n🎭 Sample message preview:");
        const {
          generateDailyCountdownMessage,
        } = require("../lib/wedding-messages");
        console.log(generateDailyCountdownMessage());
      }
    } catch (error) {
      console.log("Test preview not available:", error.message);
    }
  }

  console.log("\n🎊 Setup Complete! 🎊");
  console.log("\nNext steps:");
  console.log(
    "1. Test the system: npx ts-node scripts/wedding-notifications.ts"
  );
  console.log("2. Deploy to a server for continuous operation");
  console.log("3. Monitor the dashboard at /dashboard");

  rl.close();
}

// Run the setup
setupMessaging().catch(console.error);
