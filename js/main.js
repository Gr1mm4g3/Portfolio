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

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="terminal-prompt">$</span> Processing...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual form handling)
            try {
                // Add actual form submission logic here
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success message
                formResponse.classList.remove('hidden', 'error');
                formResponse.classList.add('success');
                responseMessage.textContent = '✓ Message sent successfully! I will get back to you soon.';
                contactForm.reset();
            } catch (error) {
                // Show error message
                formResponse.classList.remove('hidden', 'success');
                formResponse.classList.add('error');
                responseMessage.textContent = '✗ Error sending message. Please try again.';
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Scroll response into view
                formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

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
    const ctx = canvas.getContext('2d');
    
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
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1; // Increased size
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.7 + 0.3; // Increased opacity range
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particle array
    const particles = Array.from({ length: 100 }, () => new Particle());
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
                
                if (distance < 150) { // Increased connection distance
                    ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 * (1 - distance / 150)})`; // Increased line opacity
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
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
