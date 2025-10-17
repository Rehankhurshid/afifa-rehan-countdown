// Enhanced Wedding SMS Service with duplicate prevention
import { Fast2SMSService } from './fast2sms-service.js';
import { MSG91Service } from './msg91-service.js';
import { generateDailyCountdownMessage, generateEventMessages, generateMilestoneMessage, getUpcomingEvent, WEDDING_EVENTS } from './wedding-messages';
import { canSendMessage, markMessageSent } from './sms-state-tracker';
import weddingConfig from '../config/wedding-config.json';

export class WeddingMessageService {
  private smsService: Fast2SMSService | MSG91Service;
  private phoneNumbers: string[];
  private serviceName: string;

  constructor() {
    this.serviceName = weddingConfig.messaging.service;
    this.phoneNumbers = weddingConfig.messaging.phoneNumbers;

    // Initialize the appropriate SMS service
    if (this.serviceName === 'msg91') {
      this.smsService = new MSG91Service(weddingConfig.messaging.msg91.authKey);
    } else {
      // Default to Fast2SMS
      this.smsService = new Fast2SMSService(weddingConfig.messaging.fast2sms.apiKey);
    }
  }

  async sendDailyCountdown(): Promise<boolean> {
    if (!canSendMessage('daily')) {
      return false;
    }

    try {
      const message = generateDailyCountdownMessage();
      console.log('🎊 SENDING DAILY COUNTDOWN MESSAGE:');
      console.log(message);
      console.log('\n' + '='.repeat(50) + '\n');

      const results = [];
      for (const phoneNumber of this.phoneNumbers) {
        const result = await this.smsService.sendMessage(phoneNumber, message);
        results.push(result);
        
        if (result.success) {
          markMessageSent('daily', result.messageId);
          console.log(`✅ Daily message sent to ${phoneNumber} via ${this.serviceName} - ID: ${result.messageId}`);
        } else {
          console.log(`❌ Failed to send daily message to ${phoneNumber}: ${result.error}`);
        }
        
        // Add delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return results.every(r => r.success);
    } catch (error) {
      console.error('Error sending daily countdown:', error);
      return false;
    }
  }

  async sendEventMessages(eventType: 'morning' | 'before' | 'start'): Promise<boolean> {
    const messageType = 'event';
    if (!canSendMessage(messageType)) {
      return false;
    }

    try {
      const upcomingEvent = getUpcomingEvent();
      if (!upcomingEvent) {
        console.log('No upcoming events found');
        return false;
      }

      const eventMessages = generateEventMessages(upcomingEvent);
      let message = '';
      
      switch (eventType) {
        case 'morning':
          message = eventMessages.morningMessage;
          break;
        case 'before':
          message = eventMessages.beforeEventMessage;
          break;
        case 'start':
          message = eventMessages.eventStartMessage;
          break;
      }

      if (!message) {
        console.log('No message generated for event type:', eventType);
        return false;
      }

      console.log(`🎉 SENDING ${eventType.toUpperCase()} EVENT MESSAGE:`);
      console.log(message);
      console.log('\n' + '='.repeat(50) + '\n');

      const results = [];
      for (const phoneNumber of this.phoneNumbers) {
        const result = await this.smsService.sendMessage(phoneNumber, message);
        results.push(result);
        
        if (result.success) {
          markMessageSent(messageType, result.messageId);
          console.log(`✅ ${eventType} event message sent to ${phoneNumber} via ${this.serviceName} - ID: ${result.messageId}`);
        } else {
          console.log(`❌ Failed to send ${eventType} event message to ${phoneNumber}: ${result.error}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return results.every(r => r.success);
    } catch (error) {
      console.error(`Error sending ${eventType} event messages:`, error);
      return false;
    }
  }

  async sendMilestoneMessage(): Promise<boolean> {
    if (!canSendMessage('milestone')) {
      return false;
    }

    try {
      const message = generateMilestoneMessage();
      
      if (!message) {
        console.log('No milestone message for current day count');
        return false;
      }

      console.log('🌟 SENDING MILESTONE MESSAGE:');
      console.log(message);
      console.log('\n' + '='.repeat(50) + '\n');

      const results = [];
      for (const phoneNumber of this.phoneNumbers) {
        const result = await this.smsService.sendMessage(phoneNumber, message);
        results.push(result);
        
        if (result.success) {
          markMessageSent('milestone', result.messageId);
          console.log(`✅ Milestone message sent to ${phoneNumber} via ${this.serviceName} - ID: ${result.messageId}`);
        } else {
          console.log(`❌ Failed to send milestone message to ${phoneNumber}: ${result.error}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return results.every(r => r.success);
    } catch (error) {
      console.error('Error sending milestone message:', error);
      return false;
    }
  }

  async checkBalance(): Promise<number | null> {
    return await this.smsService.checkBalance();
  }
}