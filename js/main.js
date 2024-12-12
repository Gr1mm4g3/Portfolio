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
});

/**
 * Initializes the typing effect in the terminal window
 */
function initializeTypingEffect() {
    const terminalContent = document.querySelector('.terminal-content .typing-text');
    const text = `> const developer = {
    name: "Lesley",
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

> console.log("Welcome to my digital workspace!");`;

    // Split text into lines and prepare variables
    const lines = text.split('\n');
    let currentLine = 0;
    let linePosition = 0;
    let fullText = '';
    
    // Clear terminal
    terminalContent.textContent = '';
    terminalContent.style.whiteSpace = 'pre-wrap';
    terminalContent.style.wordWrap = 'break-word';

    // Function to type a single character
    function typeCharacter() {
        if (currentLine < lines.length) {
            const currentLineText = lines[currentLine];
            
            if (linePosition < currentLineText.length) {
                // Add next character
                fullText += currentLineText[linePosition];
                terminalContent.textContent = fullText;
                linePosition++;
                setTimeout(typeCharacter, 25);
            } else {
                // Move to next line
                fullText += '\n';
                terminalContent.textContent = fullText;
                currentLine++;
                linePosition = 0;
                setTimeout(typeCharacter, 100); // Slight pause between lines
            }
        }
    }

    // Start typing
    typeCharacter();
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
 * Smooth scroll to section when clicking navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});
