import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
    getMessaging,
    getToken,
    deleteToken,
    onMessage,
    type Messaging,
    type MessagePayload,
} from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

function isFirebaseConfigured(): boolean {
    return !!(
        firebaseConfig.apiKey &&
        firebaseConfig.projectId &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId
    );
}

function getFirebaseApp(): FirebaseApp | null {
    if (!isFirebaseConfigured()) {
        console.warn('Firebase is not configured. Push notifications will be disabled.');
        return null;
    }

    if (!app) {
        app = initializeApp(firebaseConfig);
    }
    return app;
}

function getFirebaseMessaging(): Messaging | null {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;

    if (!messaging) {
        messaging = getMessaging(firebaseApp);
    }
    return messaging;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return 'denied';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
}

export async function getFcmToken(): Promise<string | null> {
    const fcmMessaging = getFirebaseMessaging();
    if (!fcmMessaging) return null;

    try {
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission not granted');
            return null;
        }

        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        await navigator.serviceWorker.ready;

        if (registration.active) {
            registration.active.postMessage({
                type: 'FIREBASE_CONFIG',
                config: firebaseConfig,
            });
        }

        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY?.trim();
        if (!vapidKey) {
            console.warn('VAPID key not configured');
            return null;
        }

        console.log('VAPID key length:', vapidKey.length, 'starts with:', vapidKey.substring(0, 10) + '...');

        const token = await getToken(fcmMessaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        if (token) {
            console.log('FCM token obtained successfully');
            return token;
        } else {
            console.warn('No FCM token available');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
}

export async function deleteFcmToken(): Promise<boolean> {
    const fcmMessaging = getFirebaseMessaging();
    if (!fcmMessaging) return false;

    try {
        await deleteToken(fcmMessaging);
        console.log('FCM token deleted successfully');
        return true;
    } catch (error) {
        console.error('Error deleting FCM token:', error);
        return false;
    }
}

export function isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && isFirebaseConfigured();
}

export type MessageCallback = (payload: MessagePayload) => void;

export function onForegroundMessage(callback: MessageCallback): (() => void) | null {
    const fcmMessaging = getFirebaseMessaging();
    if (!fcmMessaging) return null;

    const unsubscribe = onMessage(fcmMessaging, (payload) => {
        console.log('Foreground message received:', payload);
        callback(payload);
    });

    return unsubscribe;
}
