/**
 * Experience Timeline
 * Interactive command-line style timeline with animations
 */

class ExperienceTimeline {
    constructor() {
        this.experiences = [
            {
                command: 'view current_role',
                role: 'Full Stack Developer',
                company: 'Current Company',
                period: '2023 - Present',
                description: `• Lead developer for multiple web applications using modern frameworks
• Implemented secure authentication systems and API endpoints
• Optimized database queries and improved application performance
• Mentored junior developers and conducted code reviews`,
                technologies: ['NextJS', 'Laravel', 'PostgreSQL', 'Docker']
            },
            {
                command: 'cat previous_experience.log',
                role: 'Security Engineer',
                company: 'Previous Company',
                period: '2021 - 2023',
                description: `• Conducted security audits and penetration testing
• Implemented security best practices and protocols
• Developed automated security testing tools
• Led security awareness training sessions`,
                technologies: ['Python', 'Burp Suite', 'Metasploit', 'Nmap']
            },
            {
                command: 'ls -la /path/to/past_roles',
                role: 'Web Developer',
                company: 'Past Company',
                period: '2019 - 2021',
                description: `• Developed and maintained multiple client websites
• Implemented responsive designs and modern UI/UX
• Optimized website performance and SEO
• Collaborated with design team on new features`,
                technologies: ['React', 'Node.js', 'MongoDB', 'AWS']
            }
        ];
        this.init();
    }

    init() {
        const section = document.createElement('section');
        section.id = 'experience';
        section.className = 'experience';
        section.innerHTML = `
            <h2 class="section-title">Experience</h2>
            <div class="terminal-window">
                <div class="terminal-header">
                    <div class="terminal-buttons">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="terminal-title">career_history.sh</div>
                </div>
                <div class="terminal-content">
                    <div class="timeline-container">
                        <div class="timeline-entries"></div>
                    </div>
                </div>
            </div>`;

        // Insert after skills section
        const skillsSection = document.getElementById('skills');
        skillsSection.parentNode.insertBefore(section, skillsSection.nextSibling);

        this.renderExperiences();
        this.initializeObserver();
    }

    renderExperiences() {
        const container = document.querySelector('.timeline-entries');
        
        this.experiences.forEach((exp, index) => {
            const entry = document.createElement('div');
            entry.className = 'timeline-entry';
            entry.innerHTML = `
                <div class="command-prompt">
                    <span class="prompt">$</span>
                    <span class="command">${exp.command}</span>
                </div>
                <div class="experience-content">
                    <div class="experience-header">
                        <h3>${exp.role}</h3>
                        <span class="company">${exp.company}</span>
                        <span class="period">${exp.period}</span>
                    </div>
                    <div class="experience-description">
                        <pre>${exp.description}</pre>
                    </div>
                    <div class="technology-badges">
                        ${exp.technologies.map(tech => `
                            <span class="tech-badge">${tech}</span>
                        `).join('')}
                    </div>
                </div>`;

            // Add connection line except for last entry
            if (index < this.experiences.length - 1) {
                entry.innerHTML += '<div class="timeline-connector"></div>';
            }

            container.appendChild(entry);
        });
    }

    initializeObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timeline = entry.target;
                    const items = timeline.querySelectorAll('.timeline-entry');
                    
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            // Animate command prompt
                            const prompt = item.querySelector('.command-prompt');
                            prompt.classList.add('typing');
                            
                            // Animate content after command is typed
                            setTimeout(() => {
                                const content = item.querySelector('.experience-content');
                                content.classList.add('visible');
                                
                                // Animate technology badges
                                const badges = item.querySelectorAll('.tech-badge');
                                badges.forEach((badge, badgeIndex) => {
                                    setTimeout(() => {
                                        badge.classList.add('visible');
                                    }, badgeIndex * 100);
                                });
                            }, 1000);
                        }, index * 1500);
                    });
                    
                    observer.unobserve(timeline);
                }
            });
        }, {
            threshold: 0.2
        });

        const timeline = document.querySelector('.timeline-container');
        observer.observe(timeline);
    }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExperienceTimeline();
});
