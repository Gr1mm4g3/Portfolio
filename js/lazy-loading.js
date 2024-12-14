/**
 * Lazy Loading Implementation
 * Handles lazy loading of images and other content
 */

class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.sectionObserver = null;
        this.init();
    }

    init() {
        // Initialize observers if they're supported
        if ('IntersectionObserver' in window) {
            this.initializeImageObserver();
            this.initializeSectionObserver();
        } else {
            this.loadAllImages();
            this.loadAllSections();
        }
    }

    initializeImageObserver() {
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
            
            // Add loading animation
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
    }

    initializeSectionObserver() {
        this.sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadSection(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        // Observe all sections with data-lazy class
        document.querySelectorAll('.data-lazy').forEach(section => {
            this.sectionObserver.observe(section);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Start loading the image
        img.src = src;
        
        // Show loading animation
        img.classList.add('loading');

        // Handle image load
        img.onload = () => {
            img.removeAttribute('data-src');
            img.classList.remove('loading');
            img.style.opacity = '1';
        };

        // Handle image error
        img.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            console.error(`Failed to load image: ${src}`);
        };
    }

    loadSection(section) {
        // Add animation class
        section.classList.add('loaded');

        // Load any deferred scripts in the section
        section.querySelectorAll('script[data-src]').forEach(script => {
            const newScript = document.createElement('script');
            Array.from(script.attributes).forEach(attr => {
                if (attr.name !== 'data-src') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });
            newScript.src = script.getAttribute('data-src');
            script.parentNode.replaceChild(newScript, script);
        });
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }

    loadAllSections() {
        document.querySelectorAll('.data-lazy').forEach(section => {
            this.loadSection(section);
        });
    }

    // Public method to manually trigger lazy loading
    refresh() {
        if (this.imageObserver) {
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.imageObserver.observe(img);
            });
        }
        if (this.sectionObserver) {
            document.querySelectorAll('.data-lazy').forEach(section => {
                this.sectionObserver.observe(section);
            });
        }
    }
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader();
});
