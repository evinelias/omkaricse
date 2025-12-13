import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

self.skipWaiting();
clientsClaim();

// Precache resources
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// Notification Click Listener
self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const action = event.action;
    const url = notification.data?.url || '/admin/dashboard';

    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // If the URL matches or it's the dashboard root, focus it
                if (client.url.includes('/admin/dashboard') && 'focus' in client) {
                    // If specific tab is needed, navigate there
                    if (url && client.url !== url) {
                        client.navigate(url);
                    }
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

// Handle push events if you eventually use Push API (optional but good practice)
self.addEventListener('push', (event) => {
    // This is for background push (if backend sends actual Push API messages, distinct from SSE)
    // Currently SSE handles the "trigger", so this might not be hit unless we add Web Push.
    // Leaving empty or basic log for now.
});
