// Quick MSG91 Config Updater
// Run this after getting your auth key from MSG91

const fs = require("fs");
const path = require("path");

function updateMSG91Config(authKey) {
  try {
    const configPath = path.join(__dirname, "config", "wedding-config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // Update MSG91 auth key
    config.messaging.msg91.authKey = authKey;

    // Write back to file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log("✅ MSG91 Auth Key updated successfully!");
    console.log("🧪 Now run: node setup-msg91.js");
    return true;
  } catch (error) {
    console.error("❌ Error updating config:", error);
    return false;
  }
}

// Get auth key from command line argument
const authKey = process.argv[2];

if (!authKey) {
  console.log("🔑 MSG91 Config Updater");
  console.log("\nUsage: node update-msg91-config.js YOUR_AUTH_KEY");
  console.log("\nExample: node update-msg91-config.js 423423XXXXXXXXXX");
  console.log("\n📝 Steps:");
  console.log("1. Get your auth key from https://control.msg91.com/user/");
  console.log("2. Run: node update-msg91-config.js YOUR_AUTH_KEY");
  console.log("3. Test with: node setup-msg91.js");
} else {
  updateMSG91Config(authKey);
}
