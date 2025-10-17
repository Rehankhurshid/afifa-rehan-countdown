-- Advanced Wedding SMS Manager
-- Sends different types of wedding messages to multiple recipients

-- Configuration
property phoneNumbers : {"7010766135", "919876543210"} -- Add more numbers as needed
property weddingDate : date "October 22, 2025 8:00:00 PM"
property haldiDate : date "October 20, 2025 5:00:00 PM"
property mehendiDate : date "October 21, 2025 6:00:00 PM"

-- Calculate days until wedding
on getDaysUntilWedding()
    set currentDate to current date
    set timeDiff to weddingDate - currentDate
    set daysLeft to (timeDiff / days) as integer
    return daysLeft
end getDaysUntilWedding

-- Generate different message types
on generateMessage(messageType)
    set daysLeft to getDaysUntilWedding()
    
    if messageType = "daily" then
        return generateDailyMessage(daysLeft)
    else if messageType = "haldi" then
        return generateHaldiMessage()
    else if messageType = "mehendi" then
        return generateMehendiMessage()
    else if messageType = "wedding" then
        return generateWeddingMessage()
    else if messageType = "milestone" then
        return generateMilestoneMessage(daysLeft)
    end if
end generateMessage

on generateDailyMessage(daysLeft)
    if daysLeft ≤ 7 then
        return "🔥 AFIFA & REHAN - FINAL WEEK! 🔥

Only " & daysLeft & " days until our wedding! We're in the final countdown! The excitement is through the roof! 🚀✨

Countdown: afifaziya.com"
    else
        return "✨ AFIFA & REHAN - " & daysLeft & " DAYS COUNTDOWN! ✨

Our magical wedding day is approaching! Every day brings us closer to our beautiful celebration! 💕

Countdown: afifaziya.com"
    end if
end generateDailyMessage

on generateHaldiMessage()
    return "🌅 AFIFA & REHAN - HALDI DAY! 🌅

Good morning! Today is our beautiful Haldi ceremony! The celebrations begin at 5pm. Get ready for turmeric, laughter, and pure joy! 🌻💛

Countdown: afifaziya.com"
end generateHaldiMessage

on generateMehendiMessage()
    return "☀️ AFIFA & REHAN - MEHENDI DAY! ☀️

Good morning! It's our Mehendi day! The festivities start at 6pm today. Time for henna, music, and magical moments! 🎨✨

Countdown: afifaziya.com"
end generateMehendiMessage

on generateWeddingMessage()
    return "👑 AFIFA & REHAN - WEDDING DAY! 👑

Good morning! TODAY we become husband and wife! Our Nikah ceremony begins at 8pm. This is the most blessed day! 💍👰🤵

Countdown: afifaziya.com"
end generateWeddingMessage

on generateMilestoneMessage(daysLeft)
    if daysLeft = 100 then
        return "🎊 AFIFA & REHAN - 100 DAYS CELEBRATION! 🎊

Can you believe it? Just 100 days until we say \"I do\"! This is HUGE! Our countdown has officially begun! 🚀✨

Countdown: afifaziya.com"
    else if daysLeft = 50 then
        return "🔥 AFIFA & REHAN - 50 DAYS MILESTONE! 🔥

We're officially halfway there! 50 days until our most beautiful wedding! Our love story is reaching its perfect chapter! 💫

Countdown: afifaziya.com"
    else if daysLeft = 30 then
        return "💍 AFIFA & REHAN - 30 DAYS SPECTACULAR! 💍

Just ONE MONTH LEFT! 30 days until we become Mr. and Mrs.! Can you feel the magic building up?! ✨🎉

Countdown: afifaziya.com"
    else if daysLeft = 7 then
        return "🎯 AFIFA & REHAN - FINAL WEEK ALERT! 🎯

THIS IS IT! Just 7 days until our dream wedding! The final countdown begins NOW! Are you ready for the celebration of a lifetime?! 🎊💍

Countdown: afifaziya.com"
    else
        return ""
    end if
end generateMilestoneMessage

-- Send SMS to single number
on sendSMS(phoneNum, messageText)
    try
        tell application "Messages"
            set targetService to 1st account whose service type = SMS
            set targetBuddy to participant phoneNum of targetService
            set newMessage to make new text chat with properties {participants:{targetBuddy}}
            send messageText to newMessage
            
            delay 2 -- Wait 2 seconds between messages
            return true
        end tell
    on error errorMessage
        log "❌ Error sending SMS to " & phoneNum & ": " & errorMessage
        return false
    end try
end sendSMS

-- Send to multiple numbers
on sendToAll(messageText)
    set successCount to 0
    set totalCount to count of phoneNumbers
    
    repeat with phoneNum in phoneNumbers
        set success to sendSMS(phoneNum, messageText)
        if success then
            set successCount to successCount + 1
            log "✅ Sent to " & phoneNum
        end if
    end repeat
    
    return {successCount, totalCount}
end sendToAll

-- Main menu
on run
    try
        set daysLeft to getDaysUntilWedding()
        set messageTypes to {"Daily Countdown", "Haldi Day", "Mehendi Day", "Wedding Day", "Milestone Message", "Custom Message"}
        
        set chosenType to (choose from list messageTypes with title "Wedding SMS Sender" with prompt "Days until wedding: " & daysLeft & "

Choose message type to send:" default items {"Daily Countdown"}) as string
        
        if chosenType = "false" then return "Cancelled"
        
        -- Generate appropriate message
        set messageText to ""
        if chosenType = "Daily Countdown" then
            set messageText to generateMessage("daily")
        else if chosenType = "Haldi Day" then
            set messageText to generateMessage("haldi")
        else if chosenType = "Mehendi Day" then
            set messageText to generateMessage("mehendi")
        else if chosenType = "Wedding Day" then
            set messageText to generateMessage("wedding")
        else if chosenType = "Milestone Message" then
            set messageText to generateMessage("milestone")
            if messageText = "" then
                display alert "No Milestone" message "No milestone message available for " & daysLeft & " days."
                return "No milestone for current day"
            end if
        else if chosenType = "Custom Message" then
            set messageText to text returned of (display dialog "Enter custom wedding message:" default answer "🎉 AFIFA & REHAN - Custom Message! 🎉

" with title "Custom Message")
        end if
        
        -- Preview and confirm
        set recipientList to ""
        repeat with phoneNum in phoneNumbers
            set recipientList to recipientList & "• " & phoneNum & "
"
        end repeat
        
        display dialog "📱 MESSAGE PREVIEW

Recipients:
" & recipientList & "
Message:
" & messageText buttons {"Cancel", "Send to All"} default button "Send to All" with icon note
        
        if button returned of result is "Send to All" then
            -- Send to all numbers
            set results to sendToAll(messageText)
            set successCount to item 1 of results
            set totalCount to item 2 of results
            
            if successCount = totalCount then
                display notification "All wedding SMS sent successfully!" with title "SMS Sent (" & successCount & "/" & totalCount & ")" sound name "Glass"
                return "✅ Successfully sent to all " & totalCount & " recipients"
            else
                display alert "Partial Success" message "Sent to " & successCount & " out of " & totalCount & " recipients."
                return "⚠️ Sent to " & successCount & "/" & totalCount & " recipients"
            end if
        else
            return "📱 SMS sending cancelled"
        end if
        
    on error errorMessage
        display alert "Script Error" message errorMessage
        return "❌ Script error: " & errorMessage
    end try
end run