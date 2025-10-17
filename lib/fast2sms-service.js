// Fast2SMS Service Implementation for Wedding Messages

class Fast2SMSService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://www.fast2sms.com/dev/bulkV2";
  }

  async sendMessage(phoneNumbers, message) {
    // Clean phone numbers (remove +91 if present, Fast2SMS expects 10 digits)
    const cleanNumbers = Array.isArray(phoneNumbers)
      ? phoneNumbers.map((num) => num.replace(/^\+91/, "").replace(/^\+/, ""))
      : [phoneNumbers.replace(/^\+91/, "").replace(/^\+/, "")];

    const numbersStr = cleanNumbers.join(",");

    const url = `${this.baseUrl}?authorization=${
      this.apiKey
    }&route=q&message=${encodeURIComponent(
      message
    )}&flash=0&numbers=${numbersStr}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.return === true) {
        console.log(`✅ SMS sent successfully via Fast2SMS`);
        console.log(`Message ID: ${result.request_id}`);
        console.log(`Numbers: ${numbersStr}`);
        return {
          success: true,
          messageId: result.request_id,
          response: result,
        };
      } else {
        console.error(`❌ Fast2SMS Error: ${result.message}`);
        return {
          success: false,
          error: result.message,
          response: result,
        };
      }
    } catch (error) {
      console.error(`❌ Network Error:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async checkBalance() {
    try {
      const response = await fetch(
        `https://www.fast2sms.com/dev/wallet?authorization=${this.apiKey}`
      );
      const result = await response.json();

      if (result.return === true) {
        console.log(`💰 Account Balance: ₹${result.wallet}`);
        return result.wallet;
      } else {
        console.error(`❌ Error checking balance: ${result.message}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error checking balance:`, error.message);
      return null;
    }
  }
}

module.exports = { Fast2SMSService };
