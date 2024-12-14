/**
 * Project Carousel
 * Handles the project carousel functionality with cyberpunk styling
 */

class ProjectCarousel {
    constructor() {
        this.currentIndex = 0;
        this.projects = [];
        this.container = null;
        this.autoplayInterval = null;
        this.init();
    }

    init() {
        // Convert project grid to carousel
        const projectGrid = document.querySelector('.project-grid');
        this.projects = Array.from(projectGrid.querySelectorAll('.terminal-window'));
        
        if (this.projects.length === 0) return;

        // Create carousel container
        this.container = document.createElement('div');
        this.container.className = 'project-carousel';
        this.container.innerHTML = `
            <div class="carousel-track"></div>
            <div class="carousel-nav">
                <button class="carousel-btn prev" aria-label="Previous project">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="carousel-indicators"></div>
                <button class="carousel-btn next" aria-label="Next project">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>`;

        // Move projects to carousel
        const track = this.container.querySelector('.carousel-track');
        this.projects.forEach(project => {
            project.classList.add('carousel-item');
            track.appendChild(project);
        });

        // Add indicators
        const indicators = this.container.querySelector('.carousel-indicators');
        this.projects.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('aria-label', `Go to project ${index + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(indicator);
        });

        // Replace grid with carousel
        projectGrid.parentNode.replaceChild(this.container, projectGrid);

        // Add event listeners
        this.container.querySelector('.prev').addEventListener('click', () => this.prev());
        this.container.querySelector('.next').addEventListener('click', () => this.next());

        // Add touch support
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                this.next();
            } else if (touchEndX - touchStartX > 50) {
                this.prev();
            }
        }, { passive: true });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.isInViewport()) {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });

        // Initialize autoplay
        this.startAutoplay();
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());

        // Show first slide
        this.updateSlide();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.projects.length;
        this.updateSlide();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
        this.updateSlide();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
    }

    updateSlide() {
        const track = this.container.querySelector('.carousel-track');
        const slideWidth = this.projects[0].offsetWidth;
        
        // Update track position
        track.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;

        // Update indicators
        const indicators = this.container.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // Update aria-current
        this.projects.forEach((project, index) => {
            project.setAttribute('aria-current', index === this.currentIndex ? 'true' : 'false');
        });
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.next(), 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    isInViewport() {
        const rect = this.container.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectCarousel();
});
