-- Test Different AppleScript Date Formats

on run
    try
        -- Test format 1: Standard AppleScript format
        set testDate1 to date "10/22/2025 8:00:00 PM"
        display dialog "✅ Format 1 Works: 10/22/2025 8:00:00 PM
Result: " & (testDate1 as string)
        return "Format 1 successful"
    on error
        try
            -- Test format 2: Alternative format
            set testDate2 to date "Tuesday, October 22, 2025 at 8:00:00 PM"
            display dialog "✅ Format 2 Works: Tuesday, October 22, 2025 at 8:00:00 PM
Result: " & (testDate2 as string)
            return "Format 2 successful"
        on error
            try
                -- Test format 3: Simple format
                set testDate3 to current date
                set testDate3 to testDate3 + (5 * days) -- Add 5 days for wedding
                display dialog "✅ Format 3 Works: Using current date + 5 days
Wedding Date: " & (testDate3 as string)
                return "Format 3 successful"
            on error errorMsg
                display alert "All date formats failed" message errorMsg
                return "All formats failed"
            end try
        end try
    end try
end run