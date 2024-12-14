/**
 * Main JavaScript file for Developer Portfolio
 * Handles all interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Terminal typing effect
    initializeTypingEffect();
    
    // Scroll reveal animation
    initializeScrollReveal();
    
    // Cursor animation for section titles
    initializeCursorBlink();
    
    // About section terminal animations
    initializeAboutTerminal();

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');
    const responseMessage = formResponse.querySelector('.response-message');

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="terminal-prompt">$</span> sending...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Success
                showFormResponse('Message sent successfully! I will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                // Error from server
                throw new Error(result.error || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            // Network or other error
            showFormResponse(`Error: ${error.message}`, 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    }

    function showFormResponse(message, type) {
        responseMessage.textContent = type === 'success' 
            ? `✓ ${message}` 
            : `✗ ${message}`;
        formResponse.classList.remove('hidden');
        formResponse.classList.remove('success', 'error');
        formResponse.classList.add(type);
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formResponse.classList.add('hidden');
        }, 5000);
    }

    contactForm.addEventListener('submit', handleFormSubmit);

    // Initialize particle effect
    initializeParticleEffect();

    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking a link
    navLinksAnchors.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu-btn') && 
            navLinks.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Prevent scrolling when menu is open
    document.body.addEventListener('touchmove', (e) => {
        if (document.body.classList.contains('menu-open')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Initialize project filters
    initializeProjectFilters();
});

/**
 * Initializes the typing effect in the terminal window
 */
function initializeTypingEffect() {
    const terminalContent = document.querySelector('.terminal-content .typing-text');
    const code = `const developer = {
    name: "Lesley Stobbe",
    title: "Software Engineer & Ethical Hacker",
    location: "The Netherlands",
    expertise: [
        "Full Stack Development",
        "AI Integration",
        "Security Testing"
    ],
    stack: {
        frontend: "NextJS",
        backend: "Laravel",
        passion: "AI & Security"
    },
    certifications: [
        "Web Security Specialist",
        "Server Security Specialist",
        "Forensic Specialist"
    ],
    mission: "Building secure, AI-powered solutions for tomorrow"
};

console.log("Welcome to my digital workspace!");`;

    // Split text into lines and prepare variables
    const lines = code.split('\n');
    let currentLine = 0;
    let currentText = '';
    
    // Clear terminal
    terminalContent.textContent = '';

    // Function to highlight code
    function highlightCode(text) {
        return Prism.highlight(text, Prism.languages.javascript, 'javascript');
    }

    // Function to type characters one by one
    function typeCharacter(line, index = 0) {
        if (index <= line.length) {
            currentText += line[index - 1] || '';
            terminalContent.innerHTML = highlightCode(currentText);
            
            if (index < line.length) {
                setTimeout(() => typeCharacter(line, index + 1), 50); // Slower character typing (50ms)
            } else {
                currentText += '\n';
                currentLine++;
                setTimeout(typeLine, 750); // Longer pause between lines (750ms)
            }
        }
    }

    // Function to start typing a new line
    function typeLine() {
        if (currentLine < lines.length) {
            // Add the prompt at the start of specific lines
            if (currentLine === 0 || currentLine === lines.length - 1) {
                currentText += '> ';
            }
            
            typeCharacter(lines[currentLine]);
        }
    }

    // Start typing with an initial delay
    setTimeout(typeLine, 500);
}

/**
 * Initializes scroll reveal animations for sections
 */
function initializeScrollReveal() {
    const sections = document.querySelectorAll('section:not(#about)');  // Exclude about section
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
}

/**
 * Initializes blinking cursor animation for section titles
 */
function initializeCursorBlink() {
    const cursors = document.querySelectorAll('.cursor');
    cursors.forEach(cursor => {
        cursor.style.animation = 'blink 1s infinite';
    });
}

/**
 * Initializes the about section terminal animations
 */
function initializeAboutTerminal() {
    const commandLines = document.querySelectorAll('.command-line');
    let isAnimating = false;
    let hasRun = false;

    function typeCommand(command) {
        return new Promise(resolve => {
            if (!command || command.classList.contains('typed')) {
                resolve();
                return;
            }

            const text = command.textContent;
            command.textContent = '';
            command.style.width = '0';
            command.classList.add('typing');
            
            let charIndex = 0;
            const typingSpeed = 75;

            function typeChar() {
                if (charIndex < text.length) {
                    command.textContent += text[charIndex];
                    command.style.width = command.scrollWidth + 'px';
                    charIndex++;
                    setTimeout(typeChar, typingSpeed);
                } else {
                    setTimeout(() => {
                        command.classList.remove('typing');
                        command.classList.add('typed');
                        resolve();
                    }, 300);  
                }
            }

            typeChar();
        });
    }

    function showOutput(output) {
        return new Promise(resolve => {
            if (!output || output.classList.contains('visible')) {
                resolve();
                return;
            }

            setTimeout(() => {
                output.classList.add('visible');
                
                if (output.classList.contains('certification-list')) {
                    setTimeout(resolve, 1000);  
                } else {
                    setTimeout(resolve, 600);  
                }
            }, 200);  
        });
    }

    async function processCommandPair(index) {
        if (index >= commandLines.length) {
            isAnimating = false;
            hasRun = true;
            return;
        }

        const commandLine = commandLines[index];
        const command = commandLine.querySelector('.typing-command');
        const output = commandLine.nextElementSibling;

        if (!command || !output) {
            isAnimating = false;
            hasRun = true;
            return;
        }

        // If this is the second command, wait for it to be ready
        if (commandLine.classList.contains('second-command')) {
            await new Promise(resolve => setTimeout(resolve, 300));
            commandLine.classList.add('ready');
        }

        await typeCommand(command);
        await showOutput(output);

        // If this is the first command, prepare the second command
        if (index === 0) {
            const secondCommand = document.querySelector('.second-command');
            if (secondCommand) {
                await new Promise(resolve => setTimeout(resolve, 300));
                secondCommand.classList.add('ready');
            }
        }

        await new Promise(resolve => setTimeout(resolve, 300));
        await processCommandPair(index + 1);
    }

    const aboutSection = document.querySelector('#about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isAnimating && !hasRun) {
                isAnimating = true;
                processCommandPair(0).catch(() => {
                    isAnimating = false;
                    hasRun = true;
                });
                observer.unobserve(entry.target);
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(aboutSection);
}

/**
 * Initializes particle effect
 */
function initializeParticleEffect() {
    const canvas = document.getElementById('particleCanvas');
    const container = document.querySelector('.particle-container');
    const ctx = canvas.getContext('2d');
    
    // Mouse position tracking
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    // Update mouse position
    function updateMousePosition(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }

    // Handle touch events
    function handleTouch(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
    }

    // Event listeners for mouse and touch
    container.addEventListener('mousemove', updateMousePosition);
    container.addEventListener('touchstart', handleTouch, { passive: false });
    container.addEventListener('touchmove', handleTouch, { passive: false });
    container.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
            this.baseSize = Math.random() * 3 + 1;
            this.baseSpeed = (Math.random() - 0.5) * 0.5;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = this.baseSize || (Math.random() * 3 + 1);
            this.speedX = this.baseSpeed || (Math.random() - 0.5) * 0.5;
            this.speedY = this.baseSpeed || (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.7 + 0.3;
        }
        
        update() {
            // Base movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    
                    // Repel particles from cursor with stronger force
                    const repelStrength = 3;
                    this.x -= Math.cos(angle) * force * repelStrength;
                    this.y -= Math.sin(angle) * force * repelStrength;
                    
                    // Increase size and opacity when near cursor
                    this.size = this.baseSize * (1 + force);
                    this.opacity = Math.min(1, this.opacity + force * 0.3);
                } else {
                    // Gradually return to base size and opacity
                    this.size = this.baseSize + (this.size - this.baseSize) * 0.95;
                    this.opacity = Math.max(0.3, this.opacity - 0.01);
                }
            }
            
            // Reset if out of bounds
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particle array - increase number of particles
    const particles = Array.from({ length: 120 }, () => new Particle());
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0; // Reset shadow for better performance
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connecting lines between nearby particles
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = 0.15 * (1 - distance / 150);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        // Draw cursor glow effect
        if (mouse.x != null && mouse.y != null) {
            const gradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, mouse.radius
            );
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.15)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * Initializes project filtering functionality
 */
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-grid .terminal-window');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projects.forEach(project => {
                const techStack = project.querySelector('.tech-stack');
                if (!techStack) return;

                const technologies = Array.from(techStack.querySelectorAll('span'))
                    .map(span => span.textContent);

                if (filter === 'all' || technologies.includes(filter)) {
                    project.classList.remove('hidden');
                    // Add fade-in animation
                    project.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    project.classList.add('hidden');
                }
            });
        });
    });
}

/**
 * Updates active state of navigation links based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight/3)) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// Add scroll event listener for navigation highlighting
window.addEventListener('scroll', updateActiveNavLink);

/**
 * Smooth scroll to section when clicking navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});
