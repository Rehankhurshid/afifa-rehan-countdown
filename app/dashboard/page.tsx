"use client";

import React, { useState, useEffect } from 'react';
import { ScheduledMessage } from '../../lib/messaging-scheduler';

export default function MessagingDashboard() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [upcomingMessages, setUpcomingMessages] = useState<ScheduledMessage[]>([]);
  const [isSystemRunning, setIsSystemRunning] = useState(false);

  // Demo data for display purposes
  useEffect(() => {
    // In a real implementation, this would connect to your actual messaging system
    const demoMessages: ScheduledMessage[] = [
      {
        id: 'demo-1',
        phoneNumber: '+1234567890',
        message: '💖 5 DAYS TO GO! 💖\n\nAfifa and Rehan\'s special day is getting closer!',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        type: 'daily',
        sent: false
      },
      {
        id: 'demo-2', 
        phoneNumber: '+1234567890',
        message: '🌅 MEHENDI DAY IS HERE! 🌅\n\nGood morning! Today is October 20th',
        scheduledTime: new Date('2025-10-20T08:00:00'),
        type: 'event',
        sent: false
      },
      {
        id: 'demo-3',
        phoneNumber: '+1234567890', 
        message: '🌟 THE WEDDING DAY IS HERE! 🌟\n\nGood morning! Today, October 22nd, 2025',
        scheduledTime: new Date('2025-10-22T08:00:00'),
        type: 'event',
        sent: false
      }
    ];
    
    setUpcomingMessages(demoMessages);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-pink-100 text-pink-800'; 
      case 'milestone': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎊 Wedding Messaging Dashboard
          </h1>
          <p className="text-gray-600">
            Afifa & Rehan Wedding Countdown Messages
          </p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSystemRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isSystemRunning ? '🟢 System Running' : '🔴 System Stopped'}
            </div>
            <button
              onClick={() => setIsSystemRunning(!isSystemRunning)}
              className={`px-4 py-2 rounded-md font-medium ${
                isSystemRunning 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isSystemRunning ? 'Stop System' : 'Start System'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Messages</h3>
            <p className="text-3xl font-bold text-blue-600">{upcomingMessages.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900">Sent Today</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
            <p className="text-3xl font-bold text-orange-600">{upcomingMessages.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900">Days to Wedding</h3>
            <p className="text-3xl font-bold text-pink-600">
              {Math.ceil((new Date('2025-10-22').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </p>
          </div>
        </div>

        {/* Upcoming Messages */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Upcoming Messages</h2>
          
          <div className="space-y-3">
            {upcomingMessages.slice(0, 10).map((message) => (
              <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMessageTypeColor(message.type)}`}>
                        {message.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(message.scheduledTime)}
                      </span>
                      <span className="text-sm text-gray-600">
                        → {message.phoneNumber}
                      </span>
                    </div>
                    <p className="text-gray-900 whitespace-pre-line text-sm">
                      {message.message.substring(0, 150)}
                      {message.message.length > 150 && '...'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎭 Wedding Event Schedule</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-900">October 20, 2025 - Haldi Ceremony</h3>
              <p className="text-gray-600">5:00 PM</p>
              <p className="text-sm text-gray-500">Messages: Morning (8 AM), Before (4 PM), Start (5 PM)</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">October 21, 2025 - Mehendi Celebration</h3>
              <p className="text-gray-600">6:00 PM</p>
              <p className="text-sm text-gray-500">Messages: Morning (8 AM), Before (5 PM), Start (6 PM)</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-gray-900">October 22, 2025 - Nikah Ceremony</h3>
              <p className="text-gray-600">8:00 PM</p>
              <p className="text-sm text-gray-500">Messages: Morning (8 AM), Before (7 PM), Start (8 PM)</p>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 Setup Instructions</h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>1. Configure phone numbers in <code>config/wedding-config.json</code></p>
            <p>2. Set up Twilio credentials for SMS sending</p>
            <p>3. Run <code>npx ts-node scripts/wedding-notifications.ts</code></p>
            <p>4. Monitor messages in this dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}