// Wedding event schedule and messaging system

const WEDDING_EVENTS = [
  {
    name: "Haldi Ceremony",
    date: "2025-10-20",
    time: "17:00", // 5PM
    description: "Join us for the beautiful Haldi ceremony!",
  },
  {
    name: "Mehendi Celebration",
    date: "2025-10-21",
    time: "18:00", // 6PM
    description: "Second day of Mehendi celebrations!",
  },
  {
    name: "Nikah Ceremony",
    date: "2025-10-22",
    time: "20:00", // 8PM
    description: "The blessed union of Afifa and Rehan!",
  },
];

const COUNTDOWN_SITE_URL = "afifaziya.com";

function getDaysUntilWedding() {
  const weddingDate = new Date("2025-10-22T20:00:00");
  const today = new Date();

  // Calculate the difference in time
  const timeDifference = weddingDate.getTime() - today.getTime();

  // Calculate the difference in days
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

  return daysDifference;
}

function generateDailyCountdownMessage() {
  const days = getDaysUntilWedding();

  if (days < 0) {
    return `🎉 AFIFA & REHAN - WE'RE MARRIED! 🎉

Thank you for being part of our beautiful wedding journey! 💒

Our love story continues as husband and wife! ❤️

Visit our memories: ${COUNTDOWN_SITE_URL}

With love,
Mr. & Mrs. AFIFA & REHAN`;
  }

  if (days === 0) {
    return `💒 AFIFA & REHAN - TODAY IS THE DAY! 💒

Our wedding day is finally here! The moment we've been waiting for! 🎉✨

Nikah ceremony at 8:00 PM tonight!

Two hearts becoming one today! 💍

Countdown: ${COUNTDOWN_SITE_URL}

From: AFIFA & REHAN`;
  }

  if (days === 1) {
    return `🔥 AFIFA & REHAN - TOMORROW! 🔥

Only 1 day left! Can you believe it?! Tomorrow we become husband and wife! 💍✨

The excitement is beyond words! 🚀

Countdown: ${COUNTDOWN_SITE_URL}

From: AFIFA & REHAN`;
  }

  return `🔥 AFIFA & REHAN - FINAL WEEK! 🔥

Only ${days} days until our wedding! We're in the final countdown! The excitement is through the roof! 🚀✨

Countdown: ${COUNTDOWN_SITE_URL}

From: AFIFA & REHAN`;
}

function generateEventMessages(event) {
  if (!event) {
    // Return default event messages
    return {
      morning:
        "Good morning! Today is a special day in our wedding celebrations! ✨",
      afternoon: "Afternoon reminder: Don't forget about today's celebration!",
      live: "The celebration is starting now! Join us! 🎉",
    };
  }

  const eventDate = new Date(event.date);
  const today = new Date();
  const isToday = eventDate.toDateString() === today.toDateString();

  if (!isToday) {
    return null;
  }

  return {
    morning: `🌅 Good morning! Today is the ${event.name}! Join us at ${event.time} for ${event.description}`,
    afternoon: `🌞 Afternoon reminder: ${event.name} is in a few hours at ${event.time}!`,
    live: `🎉 ${event.name} is starting now! ${event.description}`,
  };
}

function generateMilestoneMessage() {
  const days = getDaysUntilWedding();

  if (days === 7) {
    return `🌟 AFIFA & REHAN - ONE WEEK TO GO! 🌟

Exactly 1 week until our wedding! The final countdown begins! 

Can you feel the excitement? We sure can! 💫

Countdown: ${COUNTDOWN_SITE_URL}

From: AFIFA & REHAN`;
  }

  if (days === 3) {
    return `🚀 AFIFA & REHAN - 3 DAYS LEFT! 🚀

Only 3 more days! We're so close now! The anticipation is incredible! 

Almost time to say "I do"! 💍

Countdown: ${COUNTDOWN_SITE_URL}

From: AFIFA & REHAN`;
  }

  return null;
}

function getUpcomingEvent() {
  const today = new Date();

  for (const event of WEDDING_EVENTS) {
    const eventDate = new Date(event.date);
    if (eventDate >= today) {
      return event;
    }
  }

  return null;
}

function getNextEventInDays() {
  const upcomingEvent = getUpcomingEvent();
  if (!upcomingEvent) return -1;

  const today = new Date();
  const eventDate = new Date(upcomingEvent.date);
  const timeDiff = eventDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Export functions for use in other files
module.exports = {
  WEDDING_EVENTS,
  COUNTDOWN_SITE_URL,
  getDaysUntilWedding,
  generateDailyCountdownMessage,
  generateEventMessages,
  generateMilestoneMessage,
  getUpcomingEvent,
  getNextEventInDays,
};
