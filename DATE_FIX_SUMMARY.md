# Date Recording Bug Fix

## Problem
Activities were being recorded with the previous day's date. For example, activities performed on Monday were showing as Sunday.

## Root Cause
The application was using `new Date().toISOString().split('T')[0]` to get the current date. This method returns the date in **UTC timezone**, not the local timezone.

### Example of the Issue:
- **Local time**: Monday 9:00 PM PST (Pacific Standard Time, UTC-8)
- **UTC time**: Tuesday 5:00 AM UTC (next day)
- **Result**: `toISOString()` returns "2025-12-03T05:00:00.000Z"
- **Date extracted**: "2025-12-03" (Tuesday) instead of "2025-12-02" (Monday)

This caused activities to be recorded with the wrong date, appearing to be from the previous day.

## Solution
Created a new utility function `getLocalDateString()` that uses the local timezone to get the current date in YYYY-MM-DD format:

```typescript
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

## Files Modified

1. **Created**: `/src/utils/dateUtils.ts`
   - New utility function for getting local date strings

2. **Updated**: `/src/components/StopwatchScreen.tsx`
   - Replaced `new Date().toISOString().split('T')[0]` with `getLocalDateString()`
   - Line 137: Activity date assignment

3. **Updated**: `/src/components/ActivityForm.tsx`
   - Replaced UTC date conversion with local date (2 occurrences)
   - Line 112: Activity date in form submission
   - Line 218: Activity date in duration change handler

4. **Updated**: `/src/components/GraphicalView.tsx`
   - Line 16: Default selected date initialization

5. **Updated**: `/src/App.tsx`
   - Line 72: Today's activities filter

## Testing
The application has been successfully built and the changes are ready to use. All date-related operations now use the local timezone, ensuring activities are recorded with the correct date regardless of the time of day.
