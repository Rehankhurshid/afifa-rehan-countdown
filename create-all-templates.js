#!/usr/bin/env node

// Create all MSG91 templates for Wedding Countdown
// eslint-disable-next-line @typescript-eslint/no-require-imports
const https = require("https");
const fs = require("fs");

const config = {
  authKey: "473977AMhCluCy68f1908cP1",
  senderId: "rehankh90",
};

const templates = [
  {
    name: "Daily Wedding Countdown",
    content:
      "🎉 Only {{VAR1}} days left for Afifa & Rehan's beautiful Nikah! 💍\n\n✨ Join us for the celebration!\nHaldi: Oct 20 at 5 PM\nMehendi: Oct 21 at 6 PM\nNikah: Oct 22 at 8 PM\n\n💕 Visit: https://www.afifaziya.com/",
  },
  {
    name: "Haldi Morning Message",
    content:
      "🌟 Good Morning! 🌟\n\nIt's Haldi Day! 💛\n\n{{VAR1}}\n\nJoin us today at 5:00 PM for the beautiful Haldi ceremony!\n\n✨ Location: [Venue Details]\n💕 Can't wait to celebrate with you!\n\nhttps://www.afifaziya.com/",
  },
  {
    name: "Mehendi Morning Message",
    content:
      "🌟 Good Morning! 🌟\n\nIt's Mehendi Day! 🎨\n\n{{VAR1}}\n\nJoin us today at 6:00 PM for the colorful Mehendi celebration!\n\n✨ Location: [Venue Details]\n💕 Henna, music, and celebration await!\n\nhttps://www.afifaziya.com/",
  },
  {
    name: "Wedding Day Morning",
    content:
      "🌟 Good Morning! 🌟\n\nIt's the Big Day! 💍\n\n{{VAR1}}\n\nThe moment we've been waiting for has arrived!\nJoin us at 8:00 PM for Afifa & Rehan's Nikah ceremony!\n\n✨ Location: [Venue Details]\n💕 Let's celebrate love!\n\nhttps://www.afifaziya.com/",
  },
  {
    name: "Haldi Afternoon Reminder",
    content:
      "⏰ Reminder: Haldi Ceremony Today! 💛\n\n{{VAR1}}\n\n🕔 Time: 5:00 PM\n📍 Location: [Venue Details]\n\n✨ See you soon!\n💕 Afifa & Rehan\n\nhttps://www.afifaziya.com/",
  },
  {
    name: "Mehendi Afternoon Reminder",
    content:
      "⏰ Reminder: Mehendi Celebration Today! 🎨\n\n{{VAR1}}\n\n🕔 Time: 6:00 PM\n📍 Location: [Venue Details]\n\n✨ See you soon!\n💕 Afifa & Rehan\n\nhttps://www.afifaziya.com/",
  },
  {
    name: "Wedding Day Afternoon Reminder",
    content:
      "⏰ Reminder: Nikah Ceremony Today! 💍\n\n{{VAR1}}\n\n🕔 Time: 8:00 PM\n📍 Location: [Venue Details]\n\n✨ See you soon!\n💕 Afifa & Rehan\n\nhttps://www.afifaziya.com/",
  },
  {
    name: "Haldi Event Time Notification",
    content:
      "🎉 Haldi is Starting Now! 💛\n\n{{VAR1}}\n\n🎊 Join us for:\n🌟 Turmeric ritual\n🌟 Music & celebration\n🌟 Family bonding\n\n💕 See you at the venue!\nhttps://www.afifaziya.com/",
  },
  {
    name: "Mehendi Event Time Notification",
    content:
      "🎉 Mehendi is Starting Now! 🎨\n\n{{VAR1}}\n\n🎊 Join us for:\n🌟 Henna application\n🌟 Music & dancing\n🌟 Unforgettable moments\n\n💕 See you at the venue!\nhttps://www.afifaziya.com/",
  },
  {
    name: "Wedding Day Event Time Notification",
    content:
      "🎉 The Nikah is Starting Now! 💍\n\n{{VAR1}}\n\n🎊 The moment we've been waiting for!\n🌟 Afifa & Rehan's blessed union\n🌟 Join us to witness the beautiful ceremony\n\n💕 Welcome to the celebration!\nhttps://www.afifaziya.com/",
  },
];

let createdCount = 0;
let templateIds = {};

function createTemplate(templateData, index) {
  return new Promise((resolve) => {
    const boundary = "----FormBoundary" + Date.now() + index;

    const formData = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="template"`,
      "",
      templateData.content,
      `--${boundary}`,
      `Content-Disposition: form-data; name="sender_id"`,
      "",
      config.senderId,
      `--${boundary}`,
      `Content-Disposition: form-data; name="template_name"`,
      "",
      templateData.name,
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
          if (responseData) {
            try {
              const jsonResponse = JSON.parse(responseData);

              if (
                jsonResponse.status === "success" &&
                jsonResponse.data &&
                jsonResponse.data.template_id
              ) {
                createdCount++;
                templateIds[templateData.name] = jsonResponse.data.template_id;
                console.log(
                  `✅ [${createdCount}/${templates.length}] ${templateData.name}`
                );
                console.log(
                  `   Template ID: ${jsonResponse.data.template_id}\n`
                );
              } else if (jsonResponse.hasError) {
                console.log(
                  `❌ [${index + 1}/${templates.length}] ${templateData.name}`
                );
                console.log(`   Error: ${jsonResponse.errors}`);
              }
            } catch (e) {
              console.log(
                `⚠️  [${index + 1}/${templates.length}] ${
                  templateData.name
                } - Parse error`
              );
            }
          }
        } catch (error) {
          console.error(`Error with ${templateData.name}:`, error);
        }
        resolve();
      });
    });

    req.on("error", (error) => {
      console.error(`Error creating ${templateData.name}:`, error);
      resolve();
    });

    req.write(formData);
    req.end();
  });
}

async function createAllTemplates() {
  console.log("📝 Creating MSG91 Templates for Wedding Countdown...\n");
  console.log("=".repeat(60));
  console.log("Creating 10 templates for:\n");
  console.log("  • Daily countdown messages");
  console.log("  • Haldi day (10 AM, 2 PM, 5 PM)");
  console.log("  • Mehendi day (10 AM, 2 PM, 6 PM)");
  console.log("  • Wedding day (10 AM, 2 PM, 8 PM)");
  console.log("\n" + "=".repeat(60) + "\n");

  // Create templates sequentially with a slight delay
  for (let i = 0; i < templates.length; i++) {
    await createTemplate(templates[i], i);
    // Add delay to avoid API rate limiting
    if (i < templates.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Summary
  console.log("=".repeat(60));
  console.log(`\n✅ TEMPLATE CREATION COMPLETE!\n`);
  console.log(`Created: ${createdCount}/${templates.length} templates\n`);

  if (createdCount > 0) {
    console.log("📋 Template IDs:\n");
    Object.entries(templateIds).forEach(([name, id]) => {
      console.log(`  ${name}`);
      console.log(`  → ${id}\n`);
    });

    // Save to file
    const summary = {
      createdAt: new Date().toISOString(),
      totalCreated: createdCount,
      templates: templateIds,
    };

    fs.writeFileSync(
      "/Users/nayyarkhurshid/Desktop/AfifaRehanCountdown/my-app/MSG91_TEMPLATE_IDS.json",
      JSON.stringify(summary, null, 2)
    );

    console.log("💾 Template IDs saved to MSG91_TEMPLATE_IDS.json\n");
    console.log("📋 Next Steps:");
    console.log("1. Templates are awaiting MSG91 approval");
    console.log("2. Check your email for approval notifications");
    console.log(
      "3. Once approved, update your cron jobs to use these template IDs"
    );
    console.log("4. Or use the simple SMS API for immediate delivery\n");
  }
}

createAllTemplates();
