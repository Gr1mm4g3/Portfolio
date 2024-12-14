/**
 * Cache Manager
 * Handles all caching operations including Cache API, LocalStorage, and SessionStorage
 */

class CacheManager {
    constructor() {
        this.CACHE_VERSION = 'v1';
        this.CACHE_NAME = `portfolio-dynamic-${this.CACHE_VERSION}`;
        this.MAX_CACHE_ITEMS = 50;
        this.CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        // Initialize storage listeners
        this.initStorageListeners();
    }

    /**
     * Cache API Methods
     */
    async cacheDynamicData(key, data) {
        try {
            const cache = await caches.open(this.CACHE_NAME);
            const response = new Response(JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Time': Date.now().toString()
                }
            });
            await cache.put(key, response);
            await this.cleanOldCache();
        } catch (error) {
            console.error('Error caching dynamic data:', error);
        }
    }

    async getDynamicData(key) {
        try {
            const cache = await caches.open(this.CACHE_NAME);
            const response = await cache.match(key);
            
            if (!response) return null;

            const cacheTime = parseInt(response.headers.get('Cache-Time'));
            if (Date.now() - cacheTime > this.CACHE_DURATION) {
                await cache.delete(key);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Error retrieving dynamic data:', error);
            return null;
        }
    }

    async cleanOldCache() {
        try {
            const cache = await caches.open(this.CACHE_NAME);
            const keys = await cache.keys();
            
            if (keys.length > this.MAX_CACHE_ITEMS) {
                const itemsToDelete = keys.length - this.MAX_CACHE_ITEMS;
                for (let i = 0; i < itemsToDelete; i++) {
                    await cache.delete(keys[i]);
                }
            }
        } catch (error) {
            console.error('Error cleaning cache:', error);
        }
    }

    /**
     * LocalStorage Methods - for persistent user preferences
     */
    savePreference(key, value) {
        try {
            const preferences = this.getPreferences();
            preferences[key] = {
                value: value,
                timestamp: Date.now()
            };
            localStorage.setItem('portfolio_preferences', JSON.stringify(preferences));
            this.notifyPreferenceChange(key, value);
        } catch (error) {
            console.error('Error saving preference:', error);
        }
    }

    getPreference(key, defaultValue = null) {
        try {
            const preferences = this.getPreferences();
            return preferences[key]?.value ?? defaultValue;
        } catch (error) {
            console.error('Error getting preference:', error);
            return defaultValue;
        }
    }

    getPreferences() {
        try {
            return JSON.parse(localStorage.getItem('portfolio_preferences')) || {};
        } catch (error) {
            console.error('Error parsing preferences:', error);
            return {};
        }
    }

    clearPreferences() {
        localStorage.removeItem('portfolio_preferences');
    }

    /**
     * SessionStorage Methods - for temporary session data
     */
    saveSessionData(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify({
                value: value,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error saving session data:', error);
        }
    }

    getSessionData(key, defaultValue = null) {
        try {
            const data = sessionStorage.getItem(key);
            if (!data) return defaultValue;
            
            const parsed = JSON.parse(data);
            return parsed.value;
        } catch (error) {
            console.error('Error getting session data:', error);
            return defaultValue;
        }
    }

    clearSessionData() {
        sessionStorage.clear();
    }

    /**
     * Storage Event Listeners
     */
    initStorageListeners() {
        // Listen for storage changes across tabs
        window.addEventListener('storage', (event) => {
            if (event.key === 'portfolio_preferences') {
                this.handlePreferenceChange(event);
            }
        });
    }

    handlePreferenceChange(event) {
        if (!event.newValue) return;
        
        try {
            const oldPrefs = event.oldValue ? JSON.parse(event.oldValue) : {};
            const newPrefs = JSON.parse(event.newValue);
            
            // Find changed preferences
            Object.keys(newPrefs).forEach(key => {
                if (!oldPrefs[key] || oldPrefs[key].value !== newPrefs[key].value) {
                    this.notifyPreferenceChange(key, newPrefs[key].value);
                }
            });
        } catch (error) {
            console.error('Error handling preference change:', error);
        }
    }

    notifyPreferenceChange(key, value) {
        // Dispatch custom event for preference changes
        window.dispatchEvent(new CustomEvent('preferenceChange', {
            detail: { key, value }
        }));
    }
}

// Initialize cache manager
window.cacheManager = new CacheManager();

// Example usage:
document.addEventListener('DOMContentLoaded', () => {
    // Save user theme preference
    const savedTheme = window.cacheManager.getPreference('theme', 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Listen for theme changes
    window.addEventListener('preferenceChange', (event) => {
        if (event.detail.key === 'theme') {
            document.documentElement.setAttribute('data-theme', event.detail.value);
        }
    });
});
