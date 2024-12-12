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
    
    // Set content and ensure proper wrapping
    terminalContent.textContent = text;
    terminalContent.style.whiteSpace = 'pre-wrap';
    terminalContent.style.wordWrap = 'break-word';
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
