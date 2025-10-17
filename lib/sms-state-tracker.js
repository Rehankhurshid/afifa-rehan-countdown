// SMS State Tracking to prevent duplicate messages
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const STATE_FILE = path.join(process.cwd(), 'sms-state.json');

function loadSMSState() {
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

function saveSMSState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Failed to save SMS state:', error);
  }
}

function canSendMessage(messageType) {
  const state = loadSMSState();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // For daily messages, check if already sent today
  if (messageType === 'daily') {
    return state.lastSentDate !== today;
  }
  
  // For event messages, allow multiple per day but track them
  return true;
}

function markMessageSent(messageType) {
  const state = loadSMSState();
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();
  
  // Update last sent date for daily messages
  if (messageType === 'daily') {
    state.lastSentDate = today;
    state.lastSentType = messageType;
  }
  
  // Add to sent messages log
  state.sentMessages.push(`${now}: ${messageType}`);
  
  // Reset daily messages if it's a new day
  if (state.lastSentDate !== today) {
    state.messagesSentToday = [];
  }
  
  // Add to today's messages
  state.messagesSentToday.push(`${now}: ${messageType}`);
  
  saveSMSState(state);
}

function getSMSState() {
  return loadSMSState();
}

function resetSMSState() {
  const defaultState = {
    lastSentDate: '',
    lastSentType: 'daily',
    sentMessages: [],
    messagesSentToday: []
  };
  
  saveSMSState(defaultState);
  return defaultState;
}

// Export functions for use in other files
module.exports = {
  loadSMSState,
  saveSMSState,
  canSendMessage,
  markMessageSent,
  getSMSState,
  resetSMSState
};