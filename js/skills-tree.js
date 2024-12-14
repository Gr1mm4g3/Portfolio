// Skills Tree Visualization
class SkillsTree {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.skills = {
            'Development': {
                level: 90,
                children: {
                    'Frontend': {
                        level: 85,
                        children: {
                            'HTML5': { level: 90 },
                            'CSS3': { level: 85 },
                            'JavaScript': { level: 90 },
                            'React': { level: 80 },
                            'NextJS': { level: 75 }
                        }
                    },
                    'Backend': {
                        level: 85,
                        children: {
                            'PHP': { level: 85 },
                            'Laravel': { level: 80 },
                            'Node.js': { level: 75 },
                            'Python': { level: 70 }
                        }
                    }
                }
            },
            'Security': {
                level: 80,
                children: {
                    'Penetration Testing': { level: 75 },
                    'Web Security': { level: 85 },
                    'Network Security': { level: 70 },
                    'Security Auditing': { level: 75 }
                }
            },
            'DevOps': {
                level: 75,
                children: {
                    'Git': { level: 85 },
                    'Docker': { level: 70 },
                    'CI/CD': { level: 75 },
                    'Linux': { level: 80 }
                }
            }
        };
        
        this.init();
    }

    createNode(name, data, parent = null) {
        const node = document.createElement('div');
        node.className = 'skill-node';
        
        const content = document.createElement('div');
        content.className = 'skill-content';
        
        const nameEl = document.createElement('span');
        nameEl.className = 'skill-name';
        nameEl.textContent = name;
        
        const progress = document.createElement('div');
        progress.className = 'skill-progress';
        progress.style.setProperty('--progress', `${data.level}%`);
        
        content.appendChild(nameEl);
        content.appendChild(progress);
        node.appendChild(content);
        
        if (data.children) {
            node.classList.add('has-children');
            const childContainer = document.createElement('div');
            childContainer.className = 'skill-children';
            Object.entries(data.children).forEach(([childName, childData]) => {
                childContainer.appendChild(this.createNode(childName, childData, node));
            });
            node.appendChild(childContainer);
            
            // Add expand/collapse functionality
            content.addEventListener('click', () => {
                node.classList.toggle('expanded');
                this.animateConnections();
            });
        }
        
        return node;
    }

    animateConnections() {
        // Add connection lines using SVG
        const connections = this.container.querySelectorAll('.skill-connection');
        connections.forEach(conn => conn.remove());
        
        const nodes = this.container.querySelectorAll('.skill-node.expanded');
        nodes.forEach(node => {
            const children = node.querySelector('.skill-children');
            if (children) {
                const parentContent = node.querySelector('.skill-content');
                const childNodes = children.querySelectorAll(':scope > .skill-node');
                
                childNodes.forEach(childNode => {
                    const childContent = childNode.querySelector('.skill-content');
                    this.createConnection(parentContent, childContent);
                });
            }
        });
    }

    createConnection(start, end) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('skill-connection');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        const startRect = start.getBoundingClientRect();
        const endRect = end.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        const startX = startRect.left + startRect.width / 2 - containerRect.left;
        const startY = startRect.top + startRect.height / 2 - containerRect.top;
        const endX = endRect.left + endRect.width / 2 - containerRect.left;
        const endY = endRect.top + endRect.height / 2 - containerRect.top;
        
        const path = `M ${startX},${startY} C ${startX},${(startY + endY) / 2} ${endX},${(startY + endY) / 2} ${endX},${endY}`;
        line.setAttribute('d', path);
        
        svg.appendChild(line);
        this.container.appendChild(svg);
    }

    init() {
        this.container.innerHTML = '';
        Object.entries(this.skills).forEach(([name, data]) => {
            this.container.appendChild(this.createNode(name, data));
        });
    }
}

// Initialize the skills tree when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillsTree('skills-tree');
});
