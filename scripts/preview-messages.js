#!/usr/bin/env node

/**
 * Quick Test - Preview Wedding Messages
 *
 * This script shows you what the wedding countdown messages will look like
 * without actually sending them.
 */

const {
  generateDailyCountdownMessage,
  generateEventMessages,
  getSpecialMilestoneMessage,
  WEDDING_EVENTS,
} = require("../lib/wedding-messages");

console.log("🎊 Afifa & Rehan Wedding Message Preview 🎊\n");

// Show daily countdown message
console.log("📅 DAILY COUNTDOWN MESSAGE:");
console.log("─".repeat(50));
console.log(generateDailyCountdownMessage());
console.log("\n");

// Show event messages for each ceremony
WEDDING_EVENTS.forEach((event) => {
  console.log(`🎭 ${event.name.toUpperCase()} MESSAGES:`);
  console.log("─".repeat(50));

  const messages = generateEventMessages(event.date);

  if (messages.morningMessage) {
    console.log("🌅 Morning Message:");
    console.log(messages.morningMessage);
    console.log("");
  }

  if (messages.beforeEventMessage) {
    console.log("⏰ Before Event Message:");
    console.log(messages.beforeEventMessage);
    console.log("");
  }

  if (messages.eventStartMessage) {
    console.log("🎉 Event Start Message:");
    console.log(messages.eventStartMessage);
    console.log("");
  }

  console.log("");
});

// Show milestone messages
console.log("🎯 MILESTONE MESSAGES:");
console.log("─".repeat(50));

const milestones = [30, 14, 7, 3, 1];
milestones.forEach((days) => {
  const message = getSpecialMilestoneMessage(days);
  if (message) {
    console.log(`${days} Days Left:`);
    console.log(message);
    console.log("");
  }
});

console.log(
  "✨ All messages will include the link: https://www.afifaziya.com/"
);
console.log("");
console.log("🚀 To start the messaging system:");
console.log("   node scripts/setup-messaging.js");
console.log("   npx ts-node scripts/wedding-notifications.ts");
