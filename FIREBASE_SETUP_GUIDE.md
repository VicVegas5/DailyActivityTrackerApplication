# Firebase Setup Guide for Daily Activity Tracker

This guide will walk you through setting up Firebase for your Daily Activity Tracker app so your data syncs across all your devices (Mac, MacBook, iPhone, iPad, and Android).

## What You'll Get
✅ **Cross-device sync**: All your devices will share the same data  
✅ **Real-time updates**: Changes appear instantly on all devices  
✅ **Offline support**: App works without internet, syncs when back online  
✅ **Free tier**: No cost for personal use  

---

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Open your browser and go to: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Add project" or "Create a project"
   - Enter a project name (e.g., "Daily Activity Tracker")
   - Click "Continue"

3. **Google Analytics (Optional)**
   - You can disable Google Analytics for this project (toggle it off)
   - Click "Create project"
   - Wait for the project to be created (takes about 30 seconds)
   - Click "Continue" when ready

---

## Step 2: Set Up Realtime Database

1. **Navigate to Realtime Database**
   - In the left sidebar, click "Build" → "Realtime Database"
   - Click "Create Database"

2. **Choose Database Location**
   - Select a location close to you (e.g., "United States (us-central1)")
   - Click "Next"

3. **Set Security Rules**
   - Select "Start in **test mode**" (we'll secure it later)
   - Click "Enable"

   ⚠️ **Important**: Test mode allows anyone to read/write for 30 days. We'll add authentication later for security.

---

## Step 3: Register Your Web App

1. **Add a Web App**
   - In the Firebase Console, click the **</> (Web)** icon to add a web app
   - Give your app a nickname (e.g., "Activity Tracker Web")
   - **Do NOT** check "Also set up Firebase Hosting" (we don't need it)
   - Click "Register app"

2. **Copy Your Firebase Configuration**
   - You'll see a code snippet that looks like this:

   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project-id.firebaseapp.com",
     databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890"
   };
   ```

   - **COPY THIS ENTIRE OBJECT** - you'll need it in the next step!
   - Click "Continue to console"

---

## Step 4: Update Your App Configuration

1. **Open the Firebase Config File**
   - Open this file: `src/config/firebase.ts`

2. **Replace the Placeholder Values**
   - Find the `firebaseConfig` object in the file
   - Replace ALL the placeholder values with your actual values from Step 3
   - Make sure to keep the quotes around each value

   **Before:**
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY_HERE",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     // ... etc
   };
   ```

   **After (with your actual values):**
   ```typescript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "daily-activity-tracker-abc123.firebaseapp.com",
     // ... etc
   };
   ```

3. **Save the File**
   - Save `src/config/firebase.ts` with your changes

---

## Step 5: Test Your App

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Open Your App**
   - Open the URL shown in the terminal (usually http://localhost:5173)

3. **Check the Sync Status**
   - Look at the top of the page next to the date
   - You should see a green "Online" indicator with a WiFi icon
   - If you see "Offline" or an error, check the browser console (F12) for error messages

4. **Test Adding an Activity**
   - Click "Add Activity" or "Start"
   - Add a test activity
   - The sync status should briefly show "Syncing..." then return to "Online"

5. **Verify in Firebase Console**
   - Go back to Firebase Console → Realtime Database
   - You should see your data appear in the database viewer!
   - It will be under: `daily-activities/`

---

## Step 6: Test Cross-Device Sync

1. **Open the App on Another Device**
   - On your phone/tablet, you'll need to deploy the app or use a tool like ngrok to access it
   - For now, you can test by opening the app in a different browser or incognito window

2. **Make Changes**
   - Add an activity on one device
   - Watch it appear instantly on the other device!

---

## Troubleshooting

### "Offline" Status Shows
- **Check your internet connection**
- **Verify Firebase config**: Make sure you copied all values correctly in `src/config/firebase.ts`
- **Check browser console**: Press F12 and look for error messages

### Data Not Syncing
- **Check Firebase Console**: Go to Realtime Database and see if data appears there
- **Check security rules**: Make sure you're in "test mode" (rules should allow read/write)
- **Clear browser cache**: Sometimes old data can cause issues

### "Permission Denied" Error
- **Security rules expired**: Test mode only lasts 30 days
- **Solution**: Go to Firebase Console → Realtime Database → Rules
- Update to:
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```
  (We'll add proper authentication later for security)

---

## Next Steps (Optional)

### Add User Authentication
To make your data private and secure:
1. Enable Firebase Authentication (Email/Password or Google Sign-In)
2. Update security rules to require authentication
3. Add login/signup screens to the app

### Deploy Your App
To access from any device:
1. Use Firebase Hosting (free)
2. Or deploy to Vercel, Netlify, etc.

---

## Need Help?

If you run into any issues:
1. Check the browser console (F12) for error messages
2. Verify all Firebase config values are correct
3. Make sure your Firebase project has Realtime Database enabled
4. Check that security rules allow read/write access

---

**You're all set!** Once you complete these steps, your app will sync across all your devices automatically. 🎉
