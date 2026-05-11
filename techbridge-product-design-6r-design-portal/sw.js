
// Service Worker for 6R Design Workshop Portal
const CACHE_NAME = 'v1-6r-workshop';

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
});

// Handle push events from the browser's push service
self.addEventListener('push', (event) => {
  let data = { title: 'New Update', body: 'Something happened in your 6R Workshop!' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'New Update', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png', // Assuming icon exists
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      { action: 'explore', title: 'View Workshop', icon: '/check-icon.png' },
      { action: 'close', title: 'Close', icon: '/close-icon.png' },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
