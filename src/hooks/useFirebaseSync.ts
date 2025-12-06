import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, off } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Custom hook to sync data with Firebase Realtime Database
 * Falls back to localStorage if Firebase is not configured or offline
 */
export function useFirebaseSync<T>(key: string, initialValue: T) {
    const [data, setData] = useState<T>(() => {
        // Try to load from localStorage first (for offline support)
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Firebase reference
    const dbRef = ref(database, key);

    // Sync data to both Firebase and localStorage
    const updateData = useCallback((newData: T | ((prev: T) => T)) => {
        setData(prevData => {
            const dataToStore = typeof newData === 'function'
                ? (newData as (prev: T) => T)(prevData)
                : newData;

            // Always save to localStorage for offline support
            try {
                window.localStorage.setItem(key, JSON.stringify(dataToStore));
            } catch (error) {
                console.error(`Error saving to localStorage:`, error);
            }

            // Try to save to Firebase
            setIsSyncing(true);
            set(dbRef, dataToStore)
                .then(() => {
                    setIsOnline(true);
                    setError(null);
                    setIsSyncing(false);
                })
                .catch((err) => {
                    console.error('Error syncing to Firebase:', err);
                    setError(err.message);
                    setIsOnline(false);
                    setIsSyncing(false);
                });

            return dataToStore;
        });
    }, [key, dbRef]);

    // Listen for Firebase updates
    useEffect(() => {
        let isSubscribed = true;

        const handleValueChange = (snapshot: any) => {
            if (!isSubscribed) return;

            if (snapshot.exists()) {
                const firebaseData = snapshot.val();
                setData(firebaseData);

                // Also update localStorage
                try {
                    window.localStorage.setItem(key, JSON.stringify(firebaseData));
                } catch (error) {
                    console.error(`Error updating localStorage:`, error);
                }

                setIsOnline(true);
                setError(null);
            }
        };

        const handleError = (err: any) => {
            console.error('Firebase connection error:', err);
            setError(err.message);
            setIsOnline(false);
        };

        // Set up Firebase listener
        try {
            onValue(dbRef, handleValueChange, handleError);
        } catch (err: any) {
            console.error('Error setting up Firebase listener:', err);
            setError(err.message);
            setIsOnline(false);
        }

        // Cleanup
        return () => {
            isSubscribed = false;
            off(dbRef);
        };
    }, [key, dbRef]);

    // Listen for localStorage changes (for same-window updates)
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setData(JSON.parse(item));
                }
            } catch (error) {
                console.error(`Error reading localStorage:`, error);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [key]);

    return {
        data,
        updateData,
        isOnline,
        isSyncing,
        error
    };
}
