/**
 * Service Worker Registration
 * Handles the registration and updates of the service worker
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('Service Worker update found!');

                    newWorker.addEventListener('statechange', () => {
                        console.log('Service Worker state changed:', newWorker.state);
                    });
                });
            })
            .catch(error => {
                console.error('ServiceWorker registration failed:', error);
            });

        // Handle updates and offline status
        let isOnline = navigator.onLine;
        updateOnlineStatus();

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        function updateOnlineStatus() {
            const statusDisplay = document.createElement('div');
            statusDisplay.className = 'connection-status';
            
            if (navigator.onLine) {
                if (!isOnline) {
                    statusDisplay.textContent = 'Back online';
                    statusDisplay.classList.add('online');
                    document.body.appendChild(statusDisplay);
                    setTimeout(() => statusDisplay.remove(), 3000);
                }
                isOnline = true;
            } else {
                statusDisplay.textContent = 'Offline - Some features may be limited';
                statusDisplay.classList.add('offline');
                document.body.appendChild(statusDisplay);
                isOnline = false;
            }
        }
    });
}
