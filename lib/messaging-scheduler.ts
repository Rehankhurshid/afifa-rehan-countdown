// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WEDDING_EVENTS, generateDailyCountdownMessage, generateEventMessages, generateMilestoneMessage, getDaysUntilWedding } from './wedding-messages';

export interface ScheduledMessage {
  id: string;
  phoneNumber: string;
  message: string;
  scheduledTime: Date;
  type: 'daily' | 'event' | 'milestone';
  sent: boolean;
}

export class WeddingMessageScheduler {
  private messages: ScheduledMessage[] = [];
  private phoneNumbers: string[] = [];

  constructor(phoneNumbers: string[]) {
    this.phoneNumbers = phoneNumbers;
    this.generateAllMessages();
  }

  private generateAllMessages(): void {
    this.generateDailyMessages();
    this.generateEventMessages();
    this.generateMilestoneMessages();
  }

  private generateDailyMessages(): void {
    const weddingDate = new Date('2025-10-22T20:00:00');
    const today = new Date();
    
    // Generate daily messages until wedding day
    for (let date = new Date(today); date <= weddingDate; date.setDate(date.getDate() + 1)) {
      const messageDate = new Date(date);
      messageDate.setHours(10, 0, 0, 0); // 10 AM daily
      
      this.phoneNumbers.forEach(phoneNumber => {
        this.messages.push({
          id: `daily-${phoneNumber}-${messageDate.toISOString().split('T')[0]}`,
          phoneNumber,
          message: generateDailyCountdownMessage(),
          scheduledTime: new Date(messageDate),
          type: 'daily',
          sent: false
        });
      });
    }
  }

  private generateEventMessages(): void {
    WEDDING_EVENTS.forEach(event => {
      const eventDate = new Date(event.date);
      const eventMessages = generateEventMessages(event);

      this.phoneNumbers.forEach(phoneNumber => {
        // Morning message (8 AM)
        if (eventMessages.morningMessage) {
          const morningTime = new Date(eventDate);
          morningTime.setHours(8, 0, 0, 0);
          
          this.messages.push({
            id: `morning-${phoneNumber}-${event.date}`,
            phoneNumber,
            message: eventMessages.morningMessage,
            scheduledTime: morningTime,
            type: 'event',
            sent: false
          });
        }

        // Before event message (1 hour before)
        if (eventMessages.beforeEventMessage) {
          const beforeTime = new Date(`${event.date}T${event.time}`);
          beforeTime.setHours(beforeTime.getHours() - 1);
          
          this.messages.push({
            id: `before-${phoneNumber}-${event.date}`,
            phoneNumber,
            message: eventMessages.beforeEventMessage,
            scheduledTime: beforeTime,
            type: 'event',
            sent: false
          });
        }

        // Event start message
        if (eventMessages.eventStartMessage) {
          const startTime = new Date(`${event.date}T${event.time}`);
          
          this.messages.push({
            id: `start-${phoneNumber}-${event.date}`,
            phoneNumber,
            message: eventMessages.eventStartMessage,
            scheduledTime: startTime,
            type: 'event',
            sent: false
          });
        }
      });
    });
  }

  private generateMilestoneMessages(): void {
    const milestones = [100, 50, 30, 14, 10, 7, 3, 2];
    const weddingDate = new Date('2025-10-22T20:00:00');

    milestones.forEach(days => {
      const milestoneDate = new Date(weddingDate);
      milestoneDate.setDate(milestoneDate.getDate() - days);
      milestoneDate.setHours(12, 0, 0, 0); // Noon for milestone messages

      if (milestoneDate > new Date()) {
        this.phoneNumbers.forEach(phoneNumber => {
          const message = generateMilestoneMessage();
          if (message) {
            this.messages.push({
              id: `milestone-${phoneNumber}-${days}days`,
              phoneNumber,
              message,
              scheduledTime: milestoneDate,
              type: 'milestone',
              sent: false
            });
          }
        });
      }
    });
  }

  public getMessagesToSend(): ScheduledMessage[] {
    const now = new Date();
    return this.messages.filter(msg => 
      !msg.sent && 
      msg.scheduledTime <= now
    );
  }

  public markAsSent(messageId: string): void {
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.sent = true;
    }
  }

  public getAllMessages(): ScheduledMessage[] {
    return [...this.messages];
  }

  public getUpcomingMessages(limit: number = 10): ScheduledMessage[] {
    const now = new Date();
    return this.messages
      .filter(msg => !msg.sent && msg.scheduledTime > now)
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
      .slice(0, limit);
  }
}

// SMS Service Interface (can be implemented with Twilio, SMS Gateway, etc.)
export interface SMSService {
  sendMessage(phoneNumber: string, message: string): Promise<boolean>;
}

// Example implementation with console logging (replace with actual SMS service)
export class ConsoleSMSService implements SMSService {
  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    console.log(`📱 Sending to ${phoneNumber}:`);
    console.log(message);
    console.log('---');
    return true;
  }
}

// Main messaging system
export class WeddingNotificationSystem {
  private scheduler: WeddingMessageScheduler;
  private smsService: SMSService;
  private isRunning: boolean = false;

  constructor(phoneNumbers: string[], smsService: SMSService) {
    this.scheduler = new WeddingMessageScheduler(phoneNumbers);
    this.smsService = smsService;
  }

  public async start(): Promise<void> {
    this.isRunning = true;
    console.log('🎊 Wedding notification system started!');
    
    // Check for messages every minute
    setInterval(async () => {
      if (!this.isRunning) return;
      
      const messagesToSend = this.scheduler.getMessagesToSend();
      
      for (const message of messagesToSend) {
        try {
          const success = await this.smsService.sendMessage(
            message.phoneNumber, 
            message.message
          );
          
          if (success) {
            this.scheduler.markAsSent(message.id);
            console.log(`✅ Message sent successfully to ${message.phoneNumber}`);
          }
        } catch (error) {
          console.error(`❌ Failed to send message to ${message.phoneNumber}:`, error);
        }
      }
    }, 60000); // Check every minute
  }

  public stop(): void {
    this.isRunning = false;
    console.log('🛑 Wedding notification system stopped');
  }

  public getUpcomingMessages(limit: number = 10) {
    return this.scheduler.getUpcomingMessages(limit);
  }

  public getAllMessages() {
    return this.scheduler.getAllMessages();
  }
}

// Usage example
export function initializeWeddingNotifications(phoneNumbers: string[]) {
  const smsService = new ConsoleSMSService(); // Replace with actual SMS service
  const notificationSystem = new WeddingNotificationSystem(phoneNumbers, smsService);
  
  console.log('📅 Wedding notification schedule:');
  console.log(`🎭 Daily countdown messages at 10 AM`);
  console.log(`🌅 Event morning messages at 8 AM`);
  console.log(`⏰ Before event messages 1 hour prior`);
  console.log(`🎉 Event start messages at event time`);
  console.log(`🎯 Special milestone messages at noon`);
  
  return notificationSystem;
}