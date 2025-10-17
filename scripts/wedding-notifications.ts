#!/usr/bin/env node

/**
 * Wedding Countdown Messaging System
 * 
 * This script demonstrates how to set up automated wedding countdown messages.
 * 
 * To use with real SMS service:
 * 1. Install Twilio: npm install twilio
 * 2. Replace ConsoleSMSService with TwilioSMSService
 * 3. Add your Twilio credentials and phone numbers
 * 4. Run this script on a server (or use cron jobs)
 */

import { initializeWeddingNotifications, WeddingNotificationSystem, ScheduledMessage } from '../lib/messaging-scheduler';

// Configuration
const PHONE_NUMBERS = [
  '+1234567890', // Replace with actual phone numbers
  '+0987654321'  // Add family and friends
];

async function main() {
  console.log('🎊 Afifa & Rehan Wedding Countdown Messaging System 🎊\n');
  
  // Initialize the notification system
  const notificationSystem = initializeWeddingNotifications(PHONE_NUMBERS);
  
  // Show upcoming messages
  console.log('\n📋 Next 10 scheduled messages:');
  const upcomingMessages = notificationSystem.getUpcomingMessages(10);
  
  upcomingMessages.forEach((msg: ScheduledMessage, index: number) => {
    console.log(`${index + 1}. [${msg.type.toUpperCase()}] ${msg.scheduledTime.toLocaleDateString()} ${msg.scheduledTime.toLocaleTimeString()}`);
    console.log(`   To: ${msg.phoneNumber}`);
    console.log(`   Preview: ${msg.message.substring(0, 50)}...`);
    console.log('');
  });
  
  // Start the messaging system
  console.log('🚀 Starting messaging system...');
  await notificationSystem.start();
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down messaging system...');
    notificationSystem.stop();
    process.exit(0);
  });
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { main };