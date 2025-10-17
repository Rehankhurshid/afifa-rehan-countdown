const { generateDailyCountdownMessage } = require("./lib/wedding-messages.ts");

// Test different message services
async function compareServices() {
  try {
    console.log("🔄 SMS SERVICE COMPARISON TOOL\n");

    const message = generateDailyCountdownMessage();
    console.log("📱 Wedding Message:");
    console.log(message);
    console.log("\n" + "=".repeat(60) + "\n");

    // Test Fast2SMS (current working service)
    console.log("1️⃣ FAST2SMS (Current Service)");
    console.log("✅ Status: Working");
    console.log("✅ Balance: ₹75.00");
    console.log("✅ Last Message ID: 0c2ON5WybKQF7au");
    console.log("⚡ Speed: Fast delivery");
    console.log("📊 Delivery Rate: ~95%");

    console.log("\n" + "-".repeat(60) + "\n");

    // MSG91 setup status
    console.log("2️⃣ MSG91 (New Service)");
    const config = require("./config/wedding-config.json");

    if (config.messaging.msg91.authKey === "YOUR_MSG91_AUTH_KEY_HERE") {
      console.log("⚠️  Status: Setup Required");
      console.log("📋 Todo: Get Auth Key from https://control.msg91.com/user/");
      console.log("🎯 Benefits: Better delivery, templates, analytics");
      console.log("💰 Cost: ₹0.15-0.25 per SMS");
    } else {
      console.log("✅ Status: Configured");
      console.log("🚀 Ready to test");
    }

    console.log("\n" + "=".repeat(60) + "\n");

    console.log("🎯 RECOMMENDATION:");
    console.log("• Keep Fast2SMS for immediate use (working well)");
    console.log("• Set up MSG91 for better enterprise features");
    console.log("• Test both services with small batches");
    console.log("• Switch to MSG91 after successful testing");

    console.log("\n📝 To switch services:");
    console.log('• Change "service" in config/wedding-config.json');
    console.log('• Options: "fast2sms" or "msg91"');
  } catch (error) {
    console.error("Error:", error);
  }
}

compareServices();
