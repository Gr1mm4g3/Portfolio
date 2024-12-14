/**
 * Project Modal System
 * Handles the creation and management of project detail modals
 */

class ProjectModal {
    constructor() {
        this.modalContainer = null;
        this.currentProject = null;
        this.init();
    }

    init() {
        // Create modal container
        this.modalContainer = document.createElement('div');
        this.modalContainer.className = 'modal-container';
        this.modalContainer.innerHTML = `
            <div class="modal terminal-window">
                <div class="terminal-header">
                    <div class="terminal-buttons">
                        <span class="modal-close"></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="terminal-title">project_details.md</div>
                </div>
                <div class="modal-content terminal-content">
                    <div class="project-details">
                        <div class="project-header">
                            <h2></h2>
                            <div class="project-meta"></div>
                        </div>
                        <div class="project-gallery"></div>
                        <div class="project-description"></div>
                        <div class="project-features"></div>
                        <div class="tech-stack"></div>
                        <div class="project-links"></div>
                    </div>
                </div>
            </div>`;

        // Add modal to body
        document.body.appendChild(this.modalContainer);

        // Add event listeners
        this.modalContainer.addEventListener('click', (e) => {
            if (e.target === this.modalContainer || e.target.classList.contains('modal-close')) {
                this.hide();
            }
        });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.hide();
            }
        });

        // Initialize project click handlers
        this.initializeProjectCards();
    }

    initializeProjectCards() {
        const projectCards = document.querySelectorAll('.project-grid .terminal-window');
        projectCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on links
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                this.show(card);
            });
        });
    }

    show(projectCard) {
        const title = projectCard.querySelector('h3').textContent;
        const description = projectCard.querySelector('p').textContent;
        const screenshot = projectCard.querySelector('.project-screenshot img').src;
        const techStack = Array.from(projectCard.querySelectorAll('.tech-stack span'))
            .map(span => span.textContent);
        const links = Array.from(projectCard.querySelectorAll('.project-links a'))
            .map(a => ({ text: a.textContent, url: a.href }));

        // Update modal content
        this.modalContainer.querySelector('.project-header h2').textContent = title;
        this.modalContainer.querySelector('.project-description').innerHTML = `
            <p>${description}</p>
        `;

        // Update gallery
        const gallery = this.modalContainer.querySelector('.project-gallery');
        gallery.innerHTML = `
            <div class="project-screenshot">
                <img src="${screenshot}" alt="${title} Screenshot" loading="lazy">
            </div>
        `;

        // Update tech stack
        const techStackContainer = this.modalContainer.querySelector('.tech-stack');
        techStackContainer.innerHTML = techStack
            .map(tech => `<span>${tech}</span>`)
            .join('');

        // Update links
        const linksContainer = this.modalContainer.querySelector('.project-links');
        linksContainer.innerHTML = links
            .map(link => `
                <a href="${link.url}" class="btn" target="_blank" rel="noopener noreferrer">
                    ${link.text}
                </a>
            `)
            .join('');

        // Show modal with animation
        this.modalContainer.classList.add('visible');
        document.body.style.overflow = 'hidden';

        // Add typing animation to description
        this.typeDescription(description);
    }

    typeDescription(text) {
        const descElement = this.modalContainer.querySelector('.project-description p');
        descElement.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                descElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, 20);
            }
        }
        
        type();
    }

    hide() {
        this.modalContainer.classList.remove('visible');
        document.body.style.overflow = '';
    }

    isVisible() {
        return this.modalContainer.classList.contains('visible');
    }
}

// Initialize modal system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectModal();
});
