#!/usr/bin/env node

// Add MSG91 Template for Wedding Countdown
// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require("https");
const fs = require("fs");

const config = {
  authKey: "473977AMhCluCy68f1908cP1",
  senderId: "rehankh90",
  templateName: "Afifa & Rehan Wedding Countdown",
  template:
    "🎉 Hey! Only a few days left until Afifa & Rehan's beautiful Nikah! 💍\n\n{{VAR1}}\n\n✨ Join us for the celebration!\nHaldi: Oct 20 at 5 PM\nMehendi: Oct 21 at 6 PM\nNikah: Oct 22 at 8 PM\n\n💕 Visit: https://www.afifaziya.com/",
};

function addTemplate() {
  console.log("📝 Adding MSG91 SMS Template...\n");
  console.log(`Template Name: ${config.templateName}`);
  console.log(`Template Content:\n${config.template}\n`);
  console.log("=".repeat(60) + "\n");

  // Create form data manually for multipart/form-data
  const boundary = "----FormBoundary" + Date.now();

  const formData = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="template"`,
    "",
    config.template,
    `--${boundary}`,
    `Content-Disposition: form-data; name="sender_id"`,
    "",
    config.senderId,
    `--${boundary}`,
    `Content-Disposition: form-data; name="template_name"`,
    "",
    config.templateName,
    `--${boundary}`,
    `Content-Disposition: form-data; name="dlt_template_id"`,
    "",
    "",
    `--${boundary}`,
    `Content-Disposition: form-data; name="smsType"`,
    "",
    "UNICODE",
    `--${boundary}--`,
    "",
  ].join("\r\n");

  const options = {
    method: "POST",
    hostname: "control.msg91.com",
    port: 443,
    path: "/api/v5/sms/addTemplate",
    headers: {
      accept: "application/json",
      authkey: config.authKey,
      "content-type": `multipart/form-data; boundary=${boundary}`,
      "content-length": Buffer.byteLength(formData),
    },
  };

  const req = https.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      try {
        console.log("📥 MSG91 Response:");
        console.log(`Status: ${res.statusCode}\n`);

        if (responseData) {
          try {
            const jsonResponse = JSON.parse(responseData);
            console.log(JSON.stringify(jsonResponse, null, 2));

            if (
              jsonResponse.status === "success" &&
              jsonResponse.data &&
              jsonResponse.data.template_id
            ) {
              console.log("\n✅ Template created successfully!");
              console.log(`\n🎉 Template ID: ${jsonResponse.data.template_id}`);
              console.log("\n📋 Next Steps:");
              console.log("1. Copy the Template ID above");
              console.log(
                "2. Update your wedding-config.json with this template_id"
              );
              console.log("3. Update the MSG91 service to use this template");
              console.log("4. Your SMS messages will now use this template\n");

              // Save the template ID to a file for reference
              fs.writeFileSync(
                "/Users/nayyarkhurshid/Desktop/AfifaRehanCountdown/my-app/MSG91_TEMPLATE_ID.txt",
                `Template ID: ${
                  jsonResponse.data.template_id
                }\nTemplate Name: ${
                  config.templateName
                }\nCreated: ${new Date().toISOString()}`
              );
              console.log("💾 Template ID saved to MSG91_TEMPLATE_ID.txt");
            } else if (jsonResponse.hasError) {
              console.log("\n❌ Error creating template:");
              console.log(jsonResponse.errors);
            }
          } catch (e) {
            console.log("Raw response:", responseData);
          }
        }
      } catch (error) {
        console.error("❌ Error parsing response:", error);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Error sending request:", error);
  });

  req.write(formData);
  req.end();
}

// Run the template creation
addTemplate();
