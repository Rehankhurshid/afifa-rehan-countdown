// MSG91 SMS Service Implementation for Wedding Messages (Updated for v5 API)
const https = require("https");

class MSG91Service {
  constructor(authKey, templateId = null) {
    this.authKey = authKey;
    this.templateId = templateId;
    this.hostname = "control.msg91.com";
  }

  async sendMessage(phoneNumbers, message, templateId = null) {
    // Clean phone numbers (ensure they have 91 prefix for India)
    const cleanNumbers = Array.isArray(phoneNumbers)
      ? phoneNumbers.map((num) => this.formatPhoneNumber(num))
      : [this.formatPhoneNumber(phoneNumbers)];

    // Use v5 flow API (recommended by MSG91)
    return this.sendFlowMessage(cleanNumbers, message, templateId);
  }

  formatPhoneNumber(phoneNumber) {
    // Remove any spaces, hyphens, or plus signs
    let cleaned = phoneNumber.replace(/[\s\-\+]/g, "");

    // If it starts with 91, keep as is
    if (cleaned.startsWith("91")) {
      return cleaned;
    }

    // If it's 10 digits, add 91 prefix
    if (cleaned.length === 10) {
      return "91" + cleaned;
    }

    return cleaned;
  }

  async sendFlowMessage(phoneNumbers, message, templateId = null) {
    // For MSG91 Flow API, we need a template ID
    // If no template provided, we'll use their simple SMS API instead
    if (!templateId && !this.templateId) {
      return this.sendSimpleMessage(phoneNumbers, message);
    }

    const useTemplateId = templateId || this.templateId;
    
    // Create recipients array - for now we'll put the message in VAR1
    const recipients = phoneNumbers.map(mobile => ({
      mobiles: mobile,
      VAR1: message // Put the wedding message in VAR1
    }));

    const data = JSON.stringify({
      template_id: useTemplateId,
      short_url: "0", // Disable short URL
      realTimeResponse: "1", // Get real-time response
      recipients: recipients
    });

    const options = {
      method: "POST",
      hostname: this.hostname,
      port: null,
      path: "/api/v5/flow",
      headers: {
        accept: "application/json",
        authkey: this.authKey,
        "content-type": "application/json"
      }
    };

    return this.makeRequest(options, data);
  }

  async sendSimpleMessage(phoneNumbers, message) {
    // Use the simple SMS API for plain text messages
    const data = JSON.stringify({
      authkey: this.authKey,
      mobiles: phoneNumbers.join(','),
      message: message,
      sender: "MSGIND", // Default sender ID
      route: "4", // Transactional route
      country: "91"
    });

    const options = {
      method: 'POST',
      hostname: this.hostname,
      port: null,
      path: '/api/sendhttp.php',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    };

    return this.makeRequest(options, data);
  }

  async sendTemplateMessage(templateId, phoneNumbers, variables = {}) {
    // Build recipients array with phone numbers and variables
    const recipients = phoneNumbers.map((mobile) => ({
      mobiles: mobile,
      ...variables,
    }));

    const data = JSON.stringify({
      template_id: templateId,
      short_url: "0", // Disable short URL
      realTimeResponse: "1",
      recipients: recipients,
    });

    const options = {
      method: "POST",
      hostname: this.hostname,
      port: null,
      path: "/api/v5/flow",
      headers: {
        accept: "application/json",
        authkey: this.authKey,
        "content-type": "application/json",
      },
    };

    return this.makeRequest(options, data);
  }

  makeRequest(options, data) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const body = Buffer.concat(chunks);
          const response = body.toString();

          try {
            const jsonResponse = JSON.parse(response);

            // Check for success based on MSG91 response format
            if (
              jsonResponse.type === "success" ||
              jsonResponse.message === "SMS sent successfully."
            ) {
              console.log("✅ SMS sent successfully via MSG91");
              console.log("Response:", jsonResponse);
              resolve({
                success: true,
                messageId:
                  jsonResponse.request_id ||
                  jsonResponse.data?.request_id ||
                  "unknown",
                response: jsonResponse,
              });
            } else {
              console.error("❌ MSG91 Error:", jsonResponse);
              resolve({
                success: false,
                error: jsonResponse.message || "Unknown error",
                response: jsonResponse,
              });
            }
          } catch (parseError) {
            // Handle non-JSON responses
            console.log("MSG91 Response:", response);
            if (response.includes("success") || response.includes("sent")) {
              resolve({
                success: true,
                messageId: "unknown",
                response: response,
              });
            } else {
              resolve({
                success: false,
                error: response,
                response: response,
              });
            }
          }
        });
      });

      req.on("error", (error) => {
        console.error("❌ Request Error:", error);
        reject({
          success: false,
          error: error.message,
        });
      });

      req.write(data);
      req.end();
    });
  }

  async checkBalance() {
    const options = {
      method: "GET",
      hostname: this.hostname,
      port: null,
      path: `/api/balance.php?authkey=${this.authKey}&type=4`, // type 4 for transactional
      headers: {
        accept: "application/json",
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const body = Buffer.concat(chunks);
          const response = body.toString();

          try {
            const jsonResponse = JSON.parse(response);
            if (jsonResponse.balance !== undefined) {
              console.log(`💰 MSG91 Balance: ${jsonResponse.balance} credits`);
              resolve(jsonResponse.balance);
            } else {
              console.log("Balance response:", response);
              resolve(null);
            }
          } catch (error) {
            console.log("Balance response:", response);
            resolve(null);
          }
        });
      });

      req.on("error", (error) => {
        console.error("❌ Balance Check Error:", error);
        resolve(null);
      });

      req.end();
    });
  }

  async sendSimpleMessage(phoneNumbers, message) {
    // Format phone numbers to ensure they don't have country code prefix
    const formattedNumbers = phoneNumbers.map(num => {
      // Remove any country code prefix for Indian numbers
      let cleanNum = num.toString().replace(/^\+91/, '').replace(/^91/, '');
      return cleanNum;
    });

    const data = JSON.stringify({
      authkey: this.authKey,
      mobiles: formattedNumbers.join(","),
      message: message,
      sender: "MSGIND", // Default sender ID, you may need to register your own
      route: "4", // Transactional route
      country: "91",
    });

    console.log('🔍 MSG91 Request Debug:');
    console.log('Endpoint: https://control.msg91.com/api/sendhttp.php');
    console.log('Auth Key Length:', this.authKey?.length);
    console.log('Phone Numbers:', formattedNumbers);
    console.log('Message Length:', message.length);

    const options = {
      method: "POST",
      hostname: this.hostname,
      port: null,
      path: "/api/sendhttp.php",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "content-length": data.length,
      },
    };

    return this.makeRequest(options, data);
  }

  async getBalance() {
    const options = {
      method: "GET",
      hostname: this.hostname,
      port: null,
      path: `/api/balance.php?authkey=${this.authKey}`,
      headers: {
        accept: "application/json",
      },
    };

    return new Promise((resolve) => {
      const req = require("https").request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const response = JSON.parse(data);
            if (response.balance) {
              resolve(response.balance);
            } else {
              resolve(null);
            }
          } catch (error) {
            console.error("❌ Balance Parse Error:", error);
            resolve(null);
          }
        });
      });

      req.on("error", (error) => {
        console.error("❌ Balance Check Error:", error);
        resolve(null);
      });

      req.end();
    });
  }
}

module.exports = { MSG91Service };
