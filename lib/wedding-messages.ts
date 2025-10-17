// Wedding event schedule and messaging system
export interface WeddingEvent {
  name: string;
  date: string;
  time: string;
  description: string;
}

export const WEDDING_EVENTS: WeddingEvent[] = [
  {
    name: "Haldi Ceremony",
    date: "2025-10-20",
    time: "17:00", // 5PM
    description: "Join us for the beautiful Haldi ceremony!"
  },
  {
    name: "Mehendi Celebration",
    date: "2025-10-21", 
    time: "18:00", // 6PM
    description: "Second day of Mehendi celebrations!"
  },
  {
    name: "Nikah Ceremony",
    date: "2025-10-22",
    time: "20:00", // 8PM
    description: "The blessed union of Afifa and Rehan!"
  }
];

export const COUNTDOWN_SITE_URL = "afifaziya.com";

export function getDaysUntilWedding(): number {
  const weddingDate = new Date('2025-10-22');
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = weddingDate.getTime() - todayOnly.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function generateDailyCountdownMessage(): string {
  const daysLeft = getDaysUntilWedding();
  
  if (daysLeft < 0) {
    return `🎊 AFIFA & REHAN - MARRIED! 🎊\n\nWe did it! Afifa and Rehan are now husband and wife! What a magical celebration it was! Thank you for being part of our journey! 💍✨\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft === 0) {
    return `🌟 AFIFA & REHAN - TODAY IS THE DAY! 🌟\n\nWe're getting married TODAY at 8pm! This is it - the moment we've all been waiting for! See you at our wedding! 👰🤵💕\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft === 1) {
    return `⭐ AFIFA & REHAN - TOMORROW! ⭐\n\nJust 1 day left until our wedding! Can you believe it?! Tomorrow we become husband and wife! 💫\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft <= 7) {
    return `🔥 AFIFA & REHAN - FINAL WEEK! 🔥\n\nOnly ${daysLeft} days until our wedding! We're in the final countdown! The excitement is through the roof! 🚀✨\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft <= 30) {
    return `💖 AFIFA & REHAN - ${daysLeft} DAYS TO GO! 💖\n\nLess than a month until we say "I do"! Our wedding countdown is getting real! 🎉\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  return `✨ AFIFA & REHAN - ${daysLeft} DAYS COUNTDOWN! ✨\n\nOur magical wedding day is approaching! Every day brings us closer to our beautiful celebration! 💕\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
}

export function generateEventMessages(event?: WeddingEvent) {
  if (!event) return { morningMessage: "", beforeEventMessage: "", eventStartMessage: "" };
  
  const morningMessage = (() => {
    switch (event.name) {
      case "Haldi Ceremony":
        return `🌅 AFIFA & REHAN - HALDI DAY! 🌅\n\nGood morning! Today is our beautiful Haldi ceremony! The celebrations begin at 5pm. Get ready for turmeric, laughter, and pure joy! 🌻💛\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      case "Mehendi Celebration": 
        return `☀️ AFIFA & REHAN - MEHENDI DAY! ☀️\n\nGood morning! It's our Mehendi day! The festivities start at 6pm today. Time for henna, music, and magical moments! 🎨✨\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      case "Nikah Ceremony":
        return `👑 AFIFA & REHAN - WEDDING DAY! 👑\n\nGood morning! TODAY we become husband and wife! Our Nikah ceremony begins at 8pm. This is the most blessed day! 💍👰🤵\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      default:
        return "";
    }
  })();
  
  const beforeEventMessage = (() => {
    switch (event.name) {
      case "Haldi Ceremony":
        return `⏰ AFIFA & REHAN - HALDI CEREMONY ALERT! ⏰\n\nJust 1 hour to go! Our Haldi ceremony starts at 5pm! Get ready to witness the beautiful traditions! 🌻🎉\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      case "Mehendi Celebration":
        return `⏰ AFIFA & REHAN - MEHENDI CELEBRATION ALERT! ⏰\n\nJust 1 hour to go! Our Mehendi celebration starts at 6pm! Time to celebrate with colors and joy! 🎨💫\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      case "Nikah Ceremony":
        return `⏰ AFIFA & REHAN - NIKAH CEREMONY ALERT! ⏰\n\nJust 1 hour to go! Our Nikah ceremony starts at 8pm! The moment we've all been waiting for! 👰🤵💍\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      default:
        return "";
    }
  })();
  
  const eventStartMessage = (() => {
    switch (event.name) {
      case "Haldi Ceremony":
        return `🌻 AFIFA & REHAN - HALDI CEREMONY LIVE! 🌻\n\nOur beautiful Haldi ceremony is now starting! Let the turmeric blessings begin! Thank you for being part of our journey! 💛🌟\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      case "Mehendi Celebration":
        return `🎉 AFIFA & REHAN - MEHENDI CELEBRATION LIVE! 🎉\n\nOur Mehendi celebration is now in full swing! Join our joyful festivities! ✨\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      case "Nikah Ceremony":
        return `💖 AFIFA & REHAN - THE NIKAH HAS BEGUN! 💖\n\nWe are now exchanging vows! This is the most beautiful moment - we are becoming husband and wife! 👰🤵💍✨\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
      
      default:
        return "";
    }
  })();
  
  return { morningMessage, beforeEventMessage, eventStartMessage };
}

export function generateMilestoneMessage(): string {
  const daysLeft = getDaysUntilWedding();
  
  if (daysLeft === 100) {
    return `🎊 AFIFA & REHAN - 100 DAYS CELEBRATION! 🎊\n\nCan you believe it? Just 100 days until we say "I do"! This is HUGE! Our countdown has officially begun! 🚀✨\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft === 50) {
    return `🔥 AFIFA & REHAN - 50 DAYS MILESTONE! 🔥\n\nWe're officially halfway there! 50 days until our most beautiful wedding! Our love story is reaching its perfect chapter! 💫\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft === 30) {
    return `💍 AFIFA & REHAN - 30 DAYS SPECTACULAR! 💍\n\nJust ONE MONTH LEFT! 30 days until we become Mr. and Mrs.! Can you feel the magic building up?! ✨🎉\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft === 21) {
    return `🌟 AFIFA & REHAN - 3 WEEKS LEFT! 🌟\n\nJust 3 weeks until our most anticipated wedding! Our big day is SO close! The excitement is unreal! 🚀💕\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft === 14) {
    return `⚡ AFIFA & REHAN - 2 WEEKS TO GO! ⚡\n\nTwo weeks! 14 days! The final stretch! Our wedding is practically here! We can almost hear the wedding bells! 🔔💖\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft === 7) {
    return `🎯 AFIFA & REHAN - FINAL WEEK ALERT! 🎯\n\nTHIS IS IT! Just 7 days until our dream wedding! The final countdown begins NOW! Are you ready for the celebration of a lifetime?! 🎊💍\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  if (daysLeft === 3) {
    return `💥 AFIFA & REHAN - 3 DAYS LEFT! 💥\n\nThree days! 72 hours! The anticipation is KILLING us! Our wedding is almost here! Get ready for our most beautiful celebration! 🌹✨\n\nCountdown: ${COUNTDOWN_SITE_URL}`;
  }
  
  return "";
}

export function getUpcomingEvent(): WeddingEvent | null {
  const now = new Date();
  
  for (const event of WEDDING_EVENTS) {
    const eventDateTime = new Date(`${event.date}T${event.time}:00`);
    if (eventDateTime > now) {
      return event;
    }
  }
  
  return null;
}

export function getNextEventInDays(): number {
  const upcomingEvent = getUpcomingEvent();
  if (!upcomingEvent) return -1;
  
  const eventDate = new Date(`${upcomingEvent.date}T${upcomingEvent.time}:00`);
  const today = new Date();
  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}