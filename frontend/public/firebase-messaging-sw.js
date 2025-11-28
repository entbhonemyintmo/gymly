importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

let messaging = null;

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FIREBASE_CONFIG') {
        const config = event.data.config;

        if (config && config.projectId) {
            try {
                if (!firebase.apps.length) {
                    firebase.initializeApp(config);
                }
                messaging = firebase.messaging();
                console.log('[firebase-messaging-sw.js] Firebase initialized successfully');
            } catch (error) {
                console.error('[firebase-messaging-sw.js] Error initializing Firebase:', error);
            }
        }
    }
});

self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const payload = event.data.json();
        console.log('[firebase-messaging-sw.js] Received push message:', payload);

        const notificationTitle = payload.notification?.title || 'Gymly';
        const notificationOptions = {
            body: payload.notification?.body || '',
            icon: '/icon.png',
            badge: '/badge.png',
            tag: payload.data?.type || 'default',
            data: payload.data,
        };

        event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
    } catch (error) {
        console.error('[firebase-messaging-sw.js] Error handling push message:', error);
    }
});

self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);

    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true,
            })
            .then((windowClients) => {
                for (const client of windowClients) {
                    if (client.url.includes(self.registration.scope) && 'focus' in client) {
                        client.postMessage({
                            type: 'NOTIFICATION_CLICKED',
                            data: event.notification.data,
                        });
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            }),
    );
});
