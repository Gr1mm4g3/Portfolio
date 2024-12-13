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
    const sections = document.querySelectorAll('section');
    
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

    function typeCommand(command) {
        return new Promise(resolve => {
            const text = command.textContent;
            command.textContent = '';
            
            // Start typing animation
            command.classList.add('typing');
            
            let charIndex = 0;
            const typingSpeed = 75; // milliseconds per character

            function typeChar() {
                if (charIndex < text.length) {
                    command.textContent += text[charIndex];
                    // Set width based on content
                    command.style.width = command.scrollWidth + 'px';
                    charIndex++;
                    setTimeout(typeChar, typingSpeed);
                } else {
                    // Remove typing animation after completion
                    setTimeout(() => {
                        command.classList.remove('typing');
                        resolve();
                    }, 500);
                }
            }

            typeChar();
        });
    }

    function showOutput(output) {
        return new Promise(resolve => {
            output.classList.add('visible');
            
            if (output.classList.contains('certification-list')) {
                setTimeout(resolve, 1200);
            } else {
                setTimeout(resolve, 800);
            }
        });
    }

    async function processCommandPair(index) {
        if (index >= commandLines.length) return;

        const commandLine = commandLines[index];
        const command = commandLine.querySelector('.typing-command');
        const output = commandLine.nextElementSibling;

        if (!command || !output) return;

        // Type the command
        await typeCommand(command);

        // Show and wait for the output
        await showOutput(output);

        // Add delay before next command
        await new Promise(resolve => setTimeout(resolve, 500));

        // Process next command pair
        await processCommandPair(index + 1);
    }

    // Start animations when about section is in view
    const aboutSection = document.querySelector('#about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                processCommandPair(0);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(aboutSection);
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
