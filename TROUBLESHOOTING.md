# Firebase Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Issue: App Shows "Offline" Status

**Possible Causes:**
1. Firebase configuration not set up
2. Incorrect Firebase credentials
3. No internet connection
4. Firebase Realtime Database not enabled

**Solutions:**

#### Check 1: Verify Firebase Config
Open `src/config/firebase.ts` and make sure:
- All values are filled in (no "YOUR_API_KEY_HERE" placeholders)
- Values are copied exactly from Firebase Console
- Quotes are properly closed

#### Check 2: Verify Internet Connection
- Make sure you're connected to the internet
- Try opening another website to confirm

#### Check 3: Check Browser Console
1. Press `F12` (or `Cmd+Option+I` on Mac)
2. Click the "Console" tab
3. Look for error messages in red
4. Common errors:
   - `Firebase: Error (auth/invalid-api-key)` → Wrong API key
   - `PERMISSION_DENIED` → Database rules issue
   - `Failed to fetch` → Internet connection issue

#### Check 4: Verify Firebase Setup
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click "Realtime Database" in the left sidebar
4. Make sure the database exists and shows a URL like:
   `https://your-project-default-rtdb.firebaseio.com`

---

### 🔴 Issue: "Permission Denied" Error

**Cause:** Firebase security rules are blocking access

**Solution:**

1. Go to Firebase Console → Realtime Database
2. Click the "Rules" tab
3. Make sure rules look like this:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
4. Click "Publish"

⚠️ **Note**: These rules allow anyone to read/write. For production, you should add authentication.

---

### 🔴 Issue: Data Not Syncing Between Devices

**Possible Causes:**
1. Different Firebase projects on different devices
2. Browser cache issues
3. One device is offline

**Solutions:**

#### Check 1: Verify Same Firebase Project
- Make sure all devices use the same `firebase.ts` config file
- The `projectId` should be identical on all devices

#### Check 2: Clear Browser Cache
1. Press `F12` (or `Cmd+Option+I` on Mac)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Check 3: Check Sync Status
- Look for the status indicator next to the date
- All devices should show "Online" (green)
- If one shows "Offline", check that device's internet connection

#### Check 4: Verify in Firebase Console
1. Go to Firebase Console → Realtime Database
2. Watch the data in real-time
3. Add an activity on one device
4. You should see it appear in the console immediately
5. If it appears in console but not on other devices, try refreshing those devices

---

### 🔴 Issue: App Works Locally But Not on Phone

**For iPhone/iPad:**

1. **Make sure you're on the same network** as your computer
2. **Find your computer's IP address:**
   - Mac: System Preferences → Network → Look for "IP Address"
   - Example: `192.168.1.100`
3. **Access the app using IP:**
   - Instead of `localhost:5173`
   - Use `http://192.168.1.100:5173`
4. **Update Vite config** to allow network access:
   - Open `vite.config.ts`
   - Add:
     ```typescript
     server: {
       host: '0.0.0.0'
     }
     ```

**For Android:**
- Same steps as iPhone/iPad
- Make sure Chrome is up to date

---

### 🔴 Issue: Old Data Still Showing

**Cause:** Browser is using cached data

**Solution:**

1. **Clear localStorage:**
   - Press `F12`
   - Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
   - Click "Local Storage" → your domain
   - Right-click → "Clear"
   - Refresh the page

2. **Or use this quick method:**
   - Open browser console (`F12`)
   - Type: `localStorage.clear()`
   - Press Enter
   - Refresh the page

---

### 🔴 Issue: "Test Mode" Expired (After 30 Days)

**Cause:** Firebase test mode security rules expire after 30 days

**Solution:**

1. Go to Firebase Console → Realtime Database → Rules
2. Update the rules:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
3. Click "Publish"

**Better Solution (Add Authentication):**
1. Enable Firebase Authentication
2. Update rules to require auth:
   ```json
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }
   ```

---

### 🔴 Issue: Slow Syncing

**Possible Causes:**
1. Slow internet connection
2. Large amount of data
3. Firebase server location far from you

**Solutions:**

1. **Check internet speed**
   - Run a speed test
   - Firebase works best with stable connection

2. **Optimize data:**
   - Export old activities to CSV
   - Delete activities you don't need
   - Keep only recent data in the app

3. **Check Firebase location:**
   - Firebase Console → Project Settings
   - See which region your database is in
   - Closer = faster

---

### 🔴 Issue: Build Errors

**Error: `Cannot find module 'firebase'`**

**Solution:**
```bash
npm install firebase
```

**Error: TypeScript errors in firebase.ts**

**Solution:**
Make sure all config values are strings (in quotes):
```typescript
const firebaseConfig = {
  apiKey: "AIza...",  // ✓ Correct (in quotes)
  projectId: abc123,  // ✗ Wrong (no quotes)
};
```

---

## How to Get Help

### 1. Check Browser Console
- Press `F12`
- Look for error messages
- Copy the exact error text

### 2. Check Firebase Console
- Go to https://console.firebase.google.com/
- Check if data appears in Realtime Database
- Check the "Usage" tab for any issues

### 3. Verify Your Setup
- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Web app registered
- [ ] Config copied to `src/config/firebase.ts`
- [ ] All placeholder values replaced
- [ ] `npm install` completed successfully
- [ ] App running with `npm run dev`

### 4. Test Step by Step
1. Open app → Should show "Offline" initially
2. Wait 2-3 seconds → Should change to "Online"
3. Add an activity → Should show "Syncing..." briefly
4. Check Firebase Console → Data should appear
5. Open app on another device → Data should appear

---

## Still Having Issues?

If none of these solutions work:

1. **Share the error message** from browser console
2. **Check Firebase Console** for any error messages
3. **Verify all steps** in FIREBASE_SETUP_GUIDE.md were completed
4. **Try with a fresh Firebase project** to rule out configuration issues

---

## Emergency Fallback: Use Without Firebase

If you can't get Firebase working and need to use the app now:

1. Open `src/App.tsx`
2. Change line 8 from:
   ```typescript
   import { useFirebaseSync } from './hooks/useFirebaseSync';
   ```
   to:
   ```typescript
   import { useLocalStorage } from './hooks/useLocalStorage';
   ```
3. Change line 14 from:
   ```typescript
   const { data: activities, updateData: setActivities, isOnline, isSyncing, error } = useFirebaseSync<Activity[]>('daily-activities', []);
   ```
   to:
   ```typescript
   const [activities, setActivities] = useLocalStorage<Activity[]>('daily-activities', []);
   const isOnline = false;
   const isSyncing = false;
   const error = null;
   ```

This will make the app work with localStorage only (no cross-device sync).
