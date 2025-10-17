// Twilio SMS Service Implementation
const https = require('https');
const querystring = require('querystring');

class TwilioService {
  constructor(accountSid, authToken, fromNumber) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
    this.hostname = 'api.twilio.com';
    this.basePath = `/2010-04-01/Accounts/${this.accountSid}`;
  }

  async sendMessage(phoneNumbers, message) {
    try {
      console.log('📤 Sending SMS via Twilio...');
      console.log('📞 Phone Numbers:', phoneNumbers);
      console.log('📝 Message Length:', message.length);

      // Format phone numbers for international delivery
      const formattedNumbers = phoneNumbers.map(num => {
        // Add +91 country code for Indian numbers if not present
        let formattedNum = num.toString().replace(/\s/g, ''); // Remove spaces
        if (!formattedNum.startsWith('+')) {
          if (!formattedNum.startsWith('91')) {
            formattedNum = '+91' + formattedNum;
          } else {
            formattedNum = '+' + formattedNum;
          }
        }
        return formattedNum;
      });

      console.log('📞 Formatted Numbers:', formattedNumbers);

      // Send to all numbers (Twilio sends one by one)
      const results = [];
      for (const phoneNumber of formattedNumbers) {
        try {
          const result = await this.sendSingleMessage(phoneNumber, message);
          results.push({ phoneNumber, success: true, sid: result.sid });
        } catch (error) {
          results.push({ phoneNumber, success: false, error: error.message });
        }
      }

      // Check if at least one message was sent successfully
      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        return {
          success: true,
          messageId: results.filter(r => r.success)[0].sid,
          results: results,
          response: `Sent to ${successCount}/${results.length} numbers`
        };
      } else {
        return {
          success: false,
          error: 'Failed to send to any numbers',
          results: results
        };
      }

    } catch (error) {
      console.error('❌ Twilio SMS Error:', error);
      return {
        success: false,
        error: error.message,
        response: error.toString()
      };
    }
  }

  async sendSingleMessage(phoneNumber, message) {
    return new Promise((resolve, reject) => {
      const postData = querystring.stringify({
        From: this.fromNumber,
        To: phoneNumber,
        Body: message
      });

      const options = {
        hostname: this.hostname,
        port: 443,
        path: `${this.basePath}/Messages.json`,
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            
            if (res.statusCode === 201) {
              console.log(`✅ Twilio SMS sent to ${phoneNumber}:`, response.sid);
              resolve(response);
            } else {
              console.error(`❌ Twilio Error for ${phoneNumber}:`, response);
              reject(new Error(response.message || `HTTP ${res.statusCode}`));
            }
          } catch (parseError) {
            console.error('❌ Twilio Response Parse Error:', parseError);
            reject(parseError);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Twilio Request Error:', error);
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  async getBalance() {
    return new Promise((resolve) => {
      const options = {
        hostname: this.hostname,
        port: 443,
        path: `${this.basePath}/Balance.json`,
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (res.statusCode === 200) {
              resolve(response.balance);
            } else {
              console.log('Twilio Balance Error:', response);
              resolve(null);
            }
          } catch (error) {
            console.error('❌ Balance Parse Error:', error);
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Balance Request Error:', error);
        resolve(null);
      });

      req.end();
    });
  }
}

module.exports = { TwilioService };