// SMS State Tracking to prevent duplicate messages
import fs from 'fs';
import path from 'path';

const STATE_FILE = path.join(process.cwd(), 'sms-state.json');

export interface SMSState {
  lastSentDate: string;
  lastSentType: 'daily' | 'event' | 'milestone';
  sentMessages: string[];
  messagesSentToday: string[];
}

export function loadSMSState(): SMSState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = fs.readFileSync(STATE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    console.log('Creating new SMS state file...');
  }
  
  return {
    lastSentDate: '',
    lastSentType: 'daily',
    sentMessages: [],
    messagesSentToday: []
  };
}

export function saveSMSState(state: SMSState): void {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Error saving SMS state:', error);
  }
}

export function canSendMessage(messageType: 'daily' | 'event' | 'milestone'): boolean {
  const state = loadSMSState();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Reset daily counter if it's a new day
  if (state.lastSentDate !== today) {
    state.messagesSentToday = [];
    state.lastSentDate = today;
    saveSMSState(state);
  }
  
  // Check if we've already sent this type of message today
  if (state.messagesSentToday.includes(messageType)) {
    console.log(`⚠️ ${messageType} message already sent today (${today})`);
    return false;
  }
  
  return true;
}

export function markMessageSent(messageType: 'daily' | 'event' | 'milestone', messageId: string): void {
  const state = loadSMSState();
  const today = new Date().toISOString().split('T')[0];
  
  // Update state
  state.lastSentDate = today;
  state.lastSentType = messageType;
  state.sentMessages.push(`${today}-${messageType}-${messageId}`);
  
  // Add to today's sent messages
  if (!state.messagesSentToday.includes(messageType)) {
    state.messagesSentToday.push(messageType);
  }
  
  saveSMSState(state);
  console.log(`✅ Marked ${messageType} message as sent for ${today}`);
}