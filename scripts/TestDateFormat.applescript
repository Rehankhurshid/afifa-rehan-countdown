-- Test AppleScript Date Format
-- This script tests if the date format is correct

property weddingDate : date "October 22, 2025 8:00:00 PM"

on run
    try
        set currentDate to current date
        set timeDiff to weddingDate - currentDate
        set daysLeft to (timeDiff / days) as integer
        
        display dialog "✅ Date Format Test Successful!

Current Date: " & (currentDate as string) & "
Wedding Date: " & (weddingDate as string) & "
Days Until Wedding: " & daysLeft & "

The date format is working correctly!" buttons {"OK"} default button "OK" with icon note
        
        return "✅ Date format test passed - " & daysLeft & " days until wedding"
        
    on error errorMessage
        display alert "❌ Date Format Error" message "Error: " & errorMessage & "

The date format needs to be fixed. Please use format like:
date \"October 22, 2025 8:00:00 PM\""
        
        return "❌ Date format error: " & errorMessage
    end try
end run