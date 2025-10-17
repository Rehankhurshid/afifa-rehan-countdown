import { SMSService } from './messaging-scheduler';

// Twilio SMS Service Implementation
export class TwilioSMSService implements SMSService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    // Uncomment and install twilio package to use:
    // const twilio = require('twilio');
    // this.client = twilio(accountSid, authToken);
    this.fromNumber = fromNumber;
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Uncomment to use with actual Twilio service:
      /*
      const messageResult = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber
      });
      
      console.log(`✅ SMS sent to ${phoneNumber} (SID: ${messageResult.sid})`);
      return true;
      */
      
      // For demo purposes, just log the message
      console.log(`📱 [TWILIO DEMO] Would send to ${phoneNumber}:`);
      console.log(message);
      console.log('---');
      return true;
    } catch (error) {
      console.error(`❌ Failed to send SMS to ${phoneNumber}:`, error);
      return false;
    }
  }
}

// WhatsApp Business API Service (alternative to SMS)
export class WhatsAppService implements SMSService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.whatsapp.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Implement WhatsApp Business API call here
      console.log(`📱 [WHATSAPP DEMO] Would send to ${phoneNumber}:`);
      console.log(message);
      console.log('---');
      return true;
    } catch (error) {
      console.error(`❌ Failed to send WhatsApp message to ${phoneNumber}:`, error);
      return false;
    }
  }
}

// Email service as backup/alternative
export class EmailService implements SMSService {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  async sendMessage(emailAddress: string, message: string): Promise<boolean> {
    try {
      // Implement email service (SendGrid, AWS SES, etc.)
      console.log(`📧 [EMAIL DEMO] Would send to ${emailAddress}:`);
      console.log('Subject: Wedding Countdown Update 💕');
      console.log(message);
      console.log('---');
      return true;
    } catch (error) {
      console.error(`❌ Failed to send email to ${emailAddress}:`, error);
      return false;
    }
  }
}

// Configuration helper for different services
export interface MessagingConfig {
  service: 'twilio' | 'whatsapp' | 'email' | 'console';
  credentials: {
    accountSid?: string;
    authToken?: string;
    fromNumber?: string;
    apiKey?: string;
    fromEmail?: string;
  };
}

export function createSMSService(config: MessagingConfig): SMSService {
  switch (config.service) {
    case 'twilio':
      if (!config.credentials.accountSid || !config.credentials.authToken || !config.credentials.fromNumber) {
        throw new Error('Twilio requires accountSid, authToken, and fromNumber');
      }
      return new TwilioSMSService(
        config.credentials.accountSid,
        config.credentials.authToken,
        config.credentials.fromNumber
      );
    
    case 'whatsapp':
      if (!config.credentials.apiKey) {
        throw new Error('WhatsApp service requires apiKey');
      }
      return new WhatsAppService(config.credentials.apiKey);
    
    case 'email':
      if (!config.credentials.apiKey || !config.credentials.fromEmail) {
        throw new Error('Email service requires apiKey and fromEmail');
      }
      return new EmailService(config.credentials.apiKey, config.credentials.fromEmail);
    
    default:
      // Return console service for demo
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ConsoleSMSService } = require('./messaging-scheduler');
      return new ConsoleSMSService();
  }
}