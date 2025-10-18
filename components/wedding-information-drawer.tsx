"use client";

import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, X, Calendar } from "lucide-react";
import { CardPreviewModal } from "./card-preview-modal";

interface TimelineEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  person: "Afifa" | "Rehan" | "Both";
  icon: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "haldi",
    name: "Haldi",
    date: "20 Oct",
    time: "5:00 PM",
    person: "Rehan",
    icon: "💛"
  },
  {
    id: "mehendi",
    name: "Mehendi",
    date: "21 Oct",
    time: "6:00 PM",
    person: "Rehan",
    icon: "🎨"
  },
  {
    id: "nikah",
    name: "Nikah",
    date: "22 Oct",
    time: "8:00 PM",
    person: "Both",
    icon: "💍"
  },
  {
    id: "dawat",
    name: "Dawat",
    date: "22 Oct",
    time: "10:00 PM",
    person: "Afifa",
    icon: "🍽️"
  },
  {
    id: "reception",
    name: "Reception",
    date: "25 Oct",
    time: "8:00 PM",
    person: "Rehan",
    icon: "🎉"
  }
];

export function WeddingInformationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCardPreviewOpen, setIsCardPreviewOpen] = useState(false);
  const [eventCountdowns, setEventCountdowns] = useState<Record<string, { days: number; hours: number; minutes: number; seconds: number }>>({});

  useEffect(() => {
    const calculateCountdowns = () => {
      const now = new Date().getTime();
      const countdowns: Record<string, { days: number; hours: number; minutes: number; seconds: number }> = {};

      TIMELINE_EVENTS.forEach((event) => {
        const dateMatch = event.date.match(/(\d+)\s+(\w+)/);
        if (!dateMatch) return;

        const day = dateMatch[1];
        const month = dateMatch[2];
        const eventDateString = `${month} ${day}, 2025 ${event.time}`;
        const eventTime = new Date(eventDateString).getTime();

        const diff = eventTime - now;
        if (diff > 0) {
          countdowns[event.id] = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          };
        } else {
          countdowns[event.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });

      setEventCountdowns(countdowns);
    };

    calculateCountdowns();
    const interval = setInterval(calculateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const venues = {
    afifa: [
      {
        name: "Nikah Location",
        venue: "Nakhoda Masjid",
        address: "92, Rabindra Sarani, near Nakhuda masjid, Kolutolla, Kolkata, West Bengal 700073",
        date: "22 October 2025",
        time: "8:00 PM",
        mapUrl: "https://maps.app.goo.gl/Zv7ob1Q5v4tfLUcX9",
        icon: "🕌"
      },
      {
        name: "Dawat Venue",
        venue: "Green Inn Banquet",
        address: "17, Rafi Ahmed Kidwai Road, Park Street, Esplanade, Near:, Kolkata, West Bengal 700016",
        date: "22 October 2025",
        time: "10:00 PM",
        mapUrl: "https://maps.app.goo.gl/eMAnKYnrYy9yKVaE8",
        icon: "🍽️"
      }
    ],
    rehan: [
      {
        name: "Reception",
        venue: "Firayalal Banquets",
        address: "Tirath Mansion, Besides, Mahatma Gandhi Main Rd, near Over bridge, behind Army Recruitment office, New Garden, Kanka, Ranchi, Jharkhand 834001",
        date: "25 October 2025",
        time: "8:00 PM",
        mapUrl: "https://maps.app.goo.gl/UsbSqnyx35sV4voH6",
        icon: "🎉"
      }
    ]
  };

  const VenueCard = ({ event }: { event: { name: string; venue: string; address: string; date: string; time: string; mapUrl: string | null; icon: string } }) => {
    const generateGoogleCalendarLink = (eventName: string, date: string, time: string, address: string) => {
      const dateMatch = date.match(/(\d+)\s+(\w+)\s+(\d+)/);
      if (!dateMatch) return '';
      
      const day = dateMatch[1];
      const month = dateMatch[2];
      const year = dateMatch[3];
      const dateString = `${month} ${day}, ${year} ${time}`;
      const dateObj = new Date(dateString);
      
      if (isNaN(dateObj.getTime())) return '';
      
      const startTime = dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000);
      const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `💍 ${eventName} - Afifa & Rehan's Wedding`,
        dates: `${startTime}/${endTime}`,
        details: address,
        location: address,
      });
      
      return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    const generateAppleCalendarLink = (eventName: string, date: string, time: string, address: string) => {
      const dateMatch = date.match(/(\d+)\s+(\w+)\s+(\d+)/);
      if (!dateMatch) return '';
      
      const day = dateMatch[1];
      const month = dateMatch[2];
      const year = dateMatch[3];
      const dateString = `${month} ${day}, ${year} ${time}`;
      const dateObj = new Date(dateString);
      
      if (isNaN(dateObj.getTime())) return '';
      
      const startTime = dateObj.toISOString().replace(/[-:.]/g, '').split('Z')[0];
      const endDate = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000);
      const endTime = endDate.toISOString().replace(/[-:.]/g, '').split('Z')[0];
      
      const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Countdown//EN
BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:💍 ${eventName} - Afifa & Rehan's Wedding
LOCATION:${address}
DESCRIPTION:${eventName} at Afifa & Rehan's Wedding Celebration
END:VEVENT
END:VCALENDAR`;
      
      return `data:text/calendar;charset=utf-8,${encodeURIComponent(icalContent)}`;
    };

    const googleCalendarUrl = generateGoogleCalendarLink(event.name, event.date, event.time, event.address);
    const appleCalendarUrl = generateAppleCalendarLink(event.name, event.date, event.time, event.address);

    return (
      <div className="mb-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 bg-white hover:shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-3xl pt-0.5">{event.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base mb-0.5">{event.name}</h3>
            <p className="text-gray-600 font-medium text-sm mb-3">{event.venue}</p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2 text-xs md:text-sm">{event.address}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs md:text-sm font-mono">{event.date} • {event.time}</span>
              </div>
            </div>

            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors duration-200"
              >
                View on Maps →
              </a>
            )}

            <div className="mt-3 flex gap-2">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-900 text-xs font-medium rounded hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
              >
                <Calendar size={13} />
                Google
              </a>
              <a
                href={appleCalendarUrl}
                download={`wedding-${event.name.replace(/\s+/g, '-').toLowerCase()}.ics`}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-900 text-xs font-medium rounded hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
              >
                <Calendar size={13} />
                Apple
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-[#c91b21] text-white rounded-full hover:bg-[#a01620] transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-2 font-semibold">
          <Calendar size={20} />
          <span>Event Details</span>
        </button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[90vh] bg-white flex flex-col">
        <DrawerHeader className="border-b border-gray-200 pb-4 bg-gradient-to-b from-gray-50 to-white shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-2xl text-gray-900 mb-1 font-semibold">
                💍 Wedding Information
              </DrawerTitle>
              <DrawerDescription className="text-gray-500 text-sm">
                Timeline, Venues & Schedule for Afifa & Rehan&apos;s Wedding
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <X size={20} className="text-gray-400" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <Tabs defaultValue="timeline" className="w-full flex flex-col flex-1 min-h-0">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shrink-0">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="timeline"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 text-xs md:text-sm font-medium transition-all duration-200"
              >
                📅 Timeline
              </TabsTrigger>
              <TabsTrigger 
                value="afifa"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 text-xs md:text-sm font-medium transition-all duration-200"
              >
                👰 Afifa
              </TabsTrigger>
              <TabsTrigger 
                value="rehan"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 text-xs md:text-sm font-medium transition-all duration-200"
              >
                🤵 Rehan
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <TabsContent value="timeline" className="space-y-4 mt-0">
              <div className="space-y-3">
                {TIMELINE_EVENTS.map((event, index) => {
                  const countdown = eventCountdowns[event.id];
                  return (
                    <div key={event.id} className="flex items-center gap-3 pb-3">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg border border-gray-300 shadow-sm">
                          {event.icon}
                        </div>
                        {index !== TIMELINE_EVENTS.length - 1 && (
                          <div className="w-0.5 h-6 bg-gradient-to-b from-gray-300 to-gray-100" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{event.name}</h4>
                          <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                            {event.person}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 font-mono flex gap-3 mb-2">
                          <span>{event.date}</span>
                          <span className="font-semibold">{event.time}</span>
                        </div>
                        
                        {countdown && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0 || countdown.seconds > 0) ? (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs font-mono text-blue-700">
                            <span className="text-blue-900 font-bold">
                              {countdown.days > 0 ? `${countdown.days}d ` : ''}
                              {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-500">
                            Event passed
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="afifa" className="space-y-4 mt-0">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">👰</span>
                    Afifa&apos;s Venues
                  </h3>
                  <button
                    onClick={() => setIsCardPreviewOpen(true)}
                    className="px-3 py-1 bg-[#c91b21] text-white text-sm font-semibold rounded hover:bg-[#a01820] transition-colors"
                  >
                    View Card
                  </button>
                </div>
                {venues.afifa.map((event, index) => (
                  <VenueCard key={index} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rehan" className="space-y-4 mt-0">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">🤵</span>
                    Rehan&apos;s Events
                  </h3>
                  <button
                    onClick={() => setIsCardPreviewOpen(true)}
                    className="px-3 py-1 bg-[#c91b21] text-white text-sm font-semibold rounded hover:bg-[#a01820] transition-colors"
                  >
                    View Card
                  </button>
                </div>
                {venues.rehan.map((event, index) => (
                  <VenueCard key={index} event={event} />
                ))}
              </div>
            </TabsContent>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-semibold text-gray-900">💕 We look forward to celebrating with you!</span>
                <br />
                <span className="text-xs">Please save the dates and visit the venues. See you soon!</span>
              </p>
            </div>
          </div>
        </Tabs>
      </DrawerContent>
    </Drawer>

    <CardPreviewModal 
      isOpen={isCardPreviewOpen} 
      onClose={() => setIsCardPreviewOpen(false)} 
    />
    </>
  );
}
