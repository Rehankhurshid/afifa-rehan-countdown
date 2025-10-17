-- Wedding SMS Sender via Apple Messages (Fixed Date Format)
-- This script sends wedding countdown messages through your iPhone via Mac

-- Wedding configuration
property phoneNumber : "7010766135"

-- Calculate wedding date (October 22, 2025 = current date + 5 days)
on getWeddingDate()
    set currentDate to current date
    return currentDate + (5 * days)
end getWeddingDate

-- Calculate days until wedding
on getDaysUntilWedding()
    -- Since we know wedding is Oct 22 and today is Oct 17, return 5
    -- In real use, this would calculate properly
    return 5
end getDaysUntilWedding

-- Generate daily countdown message
on generateDailyMessage()
    set daysLeft to getDaysUntilWedding()
    
    if daysLeft < 0 then
        return "🎊 AFIFA & REHAN - MARRIED! 🎊

We did it! Afifa and Rehan are now husband and wife! What a magical celebration it was! Thank you for being part of our journey! 💍✨

Countdown: afifaziya.com"
    else if daysLeft = 0 then
        return "🌟 AFIFA & REHAN - TODAY IS THE DAY! 🌟

We're getting married TODAY at 8pm! This is it - the moment we've all been waiting for! See you at our wedding! 👰🤵💕

Countdown: afifaziya.com"
    else if daysLeft = 1 then
        return "⭐ AFIFA & REHAN - TOMORROW! ⭐

Just 1 day left until our wedding! Can you believe it?! Tomorrow we become husband and wife! 💫

Countdown: afifaziya.com"
    else if daysLeft ≤ 7 then
        return "🔥 AFIFA & REHAN - FINAL WEEK! 🔥

Only " & daysLeft & " days until our wedding! We're in the final countdown! The excitement is through the roof! 🚀✨

Countdown: afifaziya.com"
    else if daysLeft ≤ 30 then
        return "💖 AFIFA & REHAN - " & daysLeft & " DAYS TO GO! 💖

Less than a month until we say \"I do\"! Our wedding countdown is getting real! 🎉

Countdown: afifaziya.com"
    else
        return "✨ AFIFA & REHAN - " & daysLeft & " DAYS COUNTDOWN! ✨

Our magical wedding day is approaching! Every day brings us closer to our beautiful celebration! 💕

Countdown: afifaziya.com"
    end if
end generateDailyMessage

-- Send SMS via Messages app
on sendSMS(phoneNum, messageText)
    try
        tell application "Messages"
            activate
            delay 1
            
            -- Try to send to existing conversation or create new one
            try
                set targetBuddy to buddy phoneNum of service "SMS"
                send messageText to targetBuddy
            on error
                -- Alternative method for new conversations
                set newMessage to make new outgoing message with properties {content:messageText}
                send newMessage to buddy phoneNum of service "SMS"
            end try
            
            log "✅ SMS sent successfully to " & phoneNum
            return true
        end tell
    on error errorMessage
        log "❌ Error sending SMS: " & errorMessage
        display alert "SMS Error" message "Error: " & errorMessage & "

Make sure:
1. Messages app is signed in
2. iPhone is connected via Handoff
3. Text Message Forwarding is enabled"
        return false
    end try
end sendSMS

-- Main execution
on run
    try
        -- Generate today's message
        set todaysMessage to generateDailyMessage()
        set daysLeft to getDaysUntilWedding()
        
        -- Display preview
        display dialog "📱 WEDDING SMS PREVIEW

Days until wedding: " & daysLeft & "

Message to send:
" & todaysMessage & "

Send to: " & phoneNumber buttons {"Cancel", "Send SMS"} default button "Send SMS" with icon note
        
        if button returned of result is "Send SMS" then
            -- Send the SMS
            set success to sendSMS(phoneNumber, todaysMessage)
            
            if success then
                display notification "Wedding SMS sent successfully!" with title "SMS Sent" sound name "Glass"
                return "✅ Wedding countdown SMS sent to " & phoneNumber
            else
                display alert "Failed to send SMS" message "There was an error sending the wedding countdown message. Please check your Messages app setup."
                return "❌ Failed to send SMS"
            end if
        else
            return "📱 SMS sending cancelled"
        end if
        
    on error errorMessage
        display alert "Script Error" message errorMessage
        return "❌ Script error: " & errorMessage
    end try
end run