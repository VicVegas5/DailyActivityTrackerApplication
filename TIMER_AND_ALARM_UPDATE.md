# Timer Default and R2D2 Alarm Implementation

## Summary of Changes

This document outlines the changes made to fix the timer default and add an R2D2-style alarm sound.

## Changes Made

### 1. **Fixed Default Target Duration (2 minutes → 0 minutes)**

**File: `src/components/ActivityForm.tsx`**

- Changed all instances of default `targetDuration` from `2` to `0`
- Updated the minimum allowed value for target duration input from `min="1"` to `min="0"`
- Modified validation in `handleStartStopwatch()` to allow 0 as a valid target duration
- Users can now fully customize the target duration, including setting it to 0 if they don't want a target

**Specific changes:**
- Initial form state: `targetDuration: 0` (line 29)
- Editing activity state: `targetDuration: 0` (line 42)
- New activity initialization: `targetDuration: 0` (lines 64-73)
- After stopwatch save: `targetDuration: 0` (lines 89-98)
- After form submit: `targetDuration: 0` (lines 135-144)
- Input validation: Changed from `parseInt(e.target.value) || 2` to `parseInt(e.target.value) || 0` (line 218)
- Input field: Changed `min="1"` to `min="0"` (line 215)

### 2. **Added R2D2-Style Alarm Sound**

**New File: `src/utils/soundUtils.ts`**

Created a new utility function `playR2D2Alarm()` that:
- Uses the Web Audio API to generate synthetic beep sounds
- Creates a sequence of 7 beeps with varying frequencies (600Hz - 1200Hz)
- Uses square wave oscillators for a robotic, R2D2-like sound
- Implements smooth envelopes for better audio quality
- Automatically cleans up audio resources after playing

**File: `src/components/StopwatchScreen.tsx`**

- Imported the `playR2D2Alarm` function
- Added call to `playR2D2Alarm()` in the `useEffect` that triggers when `hasReachedTarget` becomes true
- The alarm now plays automatically when the user's set target duration is reached

## How It Works

1. **Default Duration**: When users open the "Add New Activity" dialog, the target duration now defaults to 0 minutes instead of 2 minutes
2. **Customization**: Users can set any target duration they want (including 0) using the number input field
3. **Alarm Trigger**: When the stopwatch reaches the target duration, the `hasReachedTarget` state becomes true
4. **Sound Playback**: The R2D2 alarm sound plays automatically, consisting of 7 beeps in quick succession with varying pitches
5. **Visual Feedback**: The existing visual indicators (pulsing lightning bolt icon and "Target duration reached!" message) continue to work alongside the sound

## Testing

To test the changes:
1. Run the application: `npm run dev`
2. Click "Add New Activity"
3. Verify the target duration shows 0 by default
4. Set a category, activity name, and a short target duration (e.g., 1 minute for testing)
5. Click "Start" to begin the stopwatch
6. Wait for the target duration to be reached
7. You should hear the R2D2-style beep sequence and see the visual indicators

## Technical Notes

- The Web Audio API is used for sound generation, which is supported in all modern browsers
- The sound is generated synthetically, so no audio files are needed
- The alarm plays only once when the target is reached (controlled by the `hasReachedTarget` state)
- The audio context is properly cleaned up after playback to prevent memory leaks
