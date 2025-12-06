# Quick Firebase Setup Checklist

## ✅ What I've Done For You

1. ✅ Installed Firebase SDK (`npm install firebase`)
2. ✅ Created Firebase configuration file (`src/config/firebase.ts`)
3. ✅ Created Firebase sync hook (`src/hooks/useFirebaseSync.ts`)
4. ✅ Updated App.tsx to use Firebase instead of localStorage
5. ✅ Added sync status indicator (Online/Offline/Syncing)
6. ✅ Added error notifications for connection issues
7. ✅ Implemented offline support (works without internet)

## 📋 What You Need To Do

### 1. Create Firebase Project (5 minutes)
- Go to: https://console.firebase.google.com/
- Click "Add project"
- Name it "Daily Activity Tracker"
- Disable Google Analytics (optional)
- Click "Create project"

### 2. Enable Realtime Database (2 minutes)
- Click "Build" → "Realtime Database"
- Click "Create Database"
- Choose location near you
- Select "Start in test mode"
- Click "Enable"

### 3. Register Web App (2 minutes)
- Click the **</>** icon (Add web app)
- Name it "Activity Tracker Web"
- Click "Register app"
- **COPY the firebaseConfig object**

### 4. Update Config File (1 minute)
- Open: `src/config/firebase.ts`
- Replace the placeholder values with your copied config
- Save the file

### 5. Test It! (1 minute)
- Run: `npm run dev`
- Open the app
- Look for green "Online" status indicator
- Add a test activity
- Check Firebase Console to see your data!

---

## 🎯 Total Time: ~10 minutes

## 🔗 Quick Links
- Firebase Console: https://console.firebase.google.com/
- Full Setup Guide: See `FIREBASE_SETUP_GUIDE.md`

## 🆘 Need Help?
- Check browser console (F12) for errors
- Make sure all config values are copied correctly
- Verify Realtime Database is enabled in Firebase Console
