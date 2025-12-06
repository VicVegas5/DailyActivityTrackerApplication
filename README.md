# Daily Activity Tracker Application

A beautiful, cross-device activity tracking application with real-time cloud synchronization.

## ✨ Features

- ⏱️ **Stopwatch Timer**: Track activities in real-time with a built-in timer
- 📊 **Analytics & Reports**: View detailed statistics and graphs of your activities
- 📱 **Cross-Device Sync**: Access your data on Mac, iPhone, iPad, and Android
- 🔄 **Real-time Updates**: Changes sync instantly across all devices
- 💾 **Offline Support**: Works without internet, syncs when back online
- 📥 **CSV Export**: Download your activity data as CSV files
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase (Required for Cross-Device Sync)
Follow the step-by-step guide in **[FIREBASE_QUICK_START.md](./FIREBASE_QUICK_START.md)**

This takes about 10 minutes and enables your data to sync across all devices.

### 3. Run the App
```bash
npm run dev
```

Open your browser to the URL shown (usually http://localhost:5173)

## 📚 Documentation

- **[FIREBASE_QUICK_START.md](./FIREBASE_QUICK_START.md)** - Quick setup checklist (10 minutes)
- **[FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)** - Detailed setup instructions with troubleshooting
- **[HOW_IT_WORKS.md](./HOW_IT_WORKS.md)** - Architecture and technical details
- **[TIMER_AND_ALARM_UPDATE.md](./TIMER_AND_ALARM_UPDATE.md)** - Timer and alarm feature documentation
- **[DATE_FIX_SUMMARY.md](./DATE_FIX_SUMMARY.md)** - Date handling implementation

## 🔧 Tech Stack

- **React** + **TypeScript** - Modern UI framework
- **Vite** - Fast build tool
- **Firebase Realtime Database** - Cloud sync
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons

## 📱 Cross-Device Usage

Once Firebase is set up:

1. **Mac/MacBook**: Open in any browser
2. **iPhone/iPad**: Open in Safari or Chrome
3. **Android**: Open in Chrome or any browser

All devices will share the same data automatically!

## 🎯 Status Indicators

Look for the sync status next to the date:

- 🟢 **Online** - Connected and syncing
- 🔵 **Syncing...** - Currently uploading/downloading
- 🟠 **Offline** - No internet (app still works!)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 License

Private project - All rights reserved

---

**Need help?** Check the documentation files or open an issue on GitHub.
