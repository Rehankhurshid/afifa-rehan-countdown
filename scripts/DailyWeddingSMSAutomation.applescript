-- Daily Wedding SMS Automation
-- This script automatically sends daily countdown messages
-- Perfect for scheduling with Automator or Shortcuts

-- Configuration (EDIT THESE VALUES)
property phoneNumbers : {"7010766135"} -- Add your guest phone numbers here
property weddingDate : date "October 22, 2025 8:00:00 PM"
property enableNotifications : true
property autoSend : false -- Set to true for fully automated sending

-- Calculate days until wedding
on getDaysUntilWedding()
    set currentDate to current date
    set timeDiff to weddingDate - currentDate
    set daysLeft to (timeDiff / days) as integer
    return daysLeft
end getDaysUntilWedding

-- Generate today's message
on generateTodaysMessage()
    set daysLeft to getDaysUntilWedding()
    
    if daysLeft < 0 then
        return "🎊 AFIFA & REHAN - MARRIED! 🎊

We did it! Thank you for being part of our journey! 💍✨

afifaziya.com"
    else if daysLeft = 0 then
        return "🌟 AFIFA & REHAN - TODAY IS THE DAY! 🌟

We're getting married TODAY at 8pm! See you at our wedding! 👰🤵💕

afifaziya.com"
    else if daysLeft = 1 then
        return "⭐ AFIFA & REHAN - TOMORROW! ⭐

Just 1 day left until our wedding! Tomorrow we become husband and wife! 💫

afifaziya.com"
    else if daysLeft ≤ 7 then
        return "🔥 AFIFA & REHAN - FINAL WEEK! 🔥

Only " & daysLeft & " days until our wedding! The excitement is through the roof! 🚀✨

afifaziya.com"
    else if daysLeft ≤ 30 then
        return "💖 AFIFA & REHAN - " & daysLeft & " DAYS TO GO! 💖

Less than a month until we say \"I do\"! 🎉

afifaziya.com"
    else
        return "✨ AFIFA & REHAN - " & daysLeft & " DAYS COUNTDOWN! ✨

Our magical wedding day is approaching! 💕

afifaziya.com"
    end if
end generateTodaysMessage

-- Send SMS function
on sendSMS(phoneNum, messageText)
    try
        tell application "Messages"
            set targetService to 1st account whose service type = SMS
            set targetBuddy to participant phoneNum of targetService
            set newMessage to make new text chat with properties {participants:{targetBuddy}}
            send messageText to newMessage
            delay 1
            return true
        end tell
    on error
        return false
    end try
end sendSMS

-- Main automation function
on run
    try
        set daysLeft to getDaysUntilWedding()
        
        -- Skip if wedding has passed by more than a week
        if daysLeft < -7 then
            log "Wedding countdown completed - no more messages to send"
            return "Countdown completed"
        end if
        
        set todaysMessage to generateTodaysMessage()
        
        if autoSend then
            -- Automatic sending (for scheduled automation)
            set successCount to 0
            repeat with phoneNum in phoneNumbers
                if sendSMS(phoneNum, todaysMessage) then
                    set successCount to successCount + 1
                end if
            end repeat
            
            if enableNotifications then
                display notification "Daily wedding SMS sent to " & successCount & " recipients" with title "Wedding Countdown" subtitle daysLeft & " days to go!" sound name "Glass"
            end if
            
            return "Sent to " & successCount & " recipients"
        else
            -- Manual confirmation
            display dialog "🎊 DAILY WEDDING COUNTDOWN

Days remaining: " & daysLeft & "

Today's message:
" & todaysMessage & "

Recipients: " & (count of phoneNumbers) & " people" buttons {"Skip Today", "Send Now"} default button "Send Now" with icon note giving up after 30
            
            if button returned of result is "Send Now" then
                set successCount to 0
                repeat with phoneNum in phoneNumbers
                    if sendSMS(phoneNum, todaysMessage) then
                        set successCount to successCount + 1
                    end if
                end repeat
                
                display notification "Wedding SMS sent!" with title "Daily Countdown" subtitle "Sent to " & successCount & " people" sound name "Glass"
                return "✅ Daily message sent to " & successCount & " recipients"
            else
                return "📱 Skipped today's message"
            end if
        end if
        
    on error errorMessage
        if enableNotifications then
            display notification "Error sending daily wedding SMS" with title "Wedding Countdown Error" subtitle errorMessage
        end if
        return "❌ Error: " & errorMessage
    end try
end run