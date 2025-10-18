// DOM Elements - Cache for performance
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const dnaBases = document.getElementById('dna-bases');

// Performance optimization - Check if elements exist
if (!navbar || !navMenu || !hamburger || !dnaBases) {
    console.error('Critical DOM elements not found');
}

// Mobile Navigation Toggle - Add null check
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll - Throttled for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = requestAnimationFrame(() => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// DNA Helix Animation - More accurate structure with performance optimization
function createDNABases() {
    if (!dnaBases) return;
    
    const baseCount = 30;
    const helixHeight = 90; // vh
    const helixWidth = 200; // px
    const turns = 3; // Number of complete turns
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < baseCount; i++) {
        const base = document.createElement('div');
        base.className = 'dna-base';
        
        // Calculate position along the helix
        const t = i / (baseCount - 1);
        const angle = t * turns * 2 * Math.PI;
        const radius = helixWidth / 2;
        
        // Position the base pair
        const x = Math.cos(angle) * radius;
        const y = t * helixHeight;
        const z = Math.sin(angle) * radius;
        
        // Apply 3D positioning
        base.style.left = `calc(50% + ${x}px)`;
        base.style.top = `${y}vh`;
        base.style.transform = `translateZ(${z}px) rotateY(${angle * 180 / Math.PI}deg)`;
        base.style.animationDelay = `${i * 0.15}s`;
        
        // Add slight variation to base pairs
        base.style.height = `${12 + Math.sin(i * 0.5) * 6}px`;
        base.style.opacity = `${0.6 + Math.sin(i * 0.3) * 0.2}`;
        
        fragment.appendChild(base);
    }
    
    // Append all at once for better performance
    dnaBases.appendChild(fragment);
}

// Initialize DNA bases
createDNABases();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when skills section is visible
            if (entry.target.id === 'skills') {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Skill bars animation
function animateSkillBars() {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Contact form removed - using static mailto links for GitHub Pages compatibility

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// CSV Loading Functions
async function loadProjectsFromCSV() {
    try {
        const response = await fetch('data/projects.csv');
        if (!response.ok) throw new Error('CSV file not found');
        
        const csvText = await response.text();
        const projects = parseCSV(csvText);
        
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = '';
        
        projects.forEach((project, index) => {
            const projectCard = createProjectCard(project);
            projectCard.style.animationDelay = `${index * 0.1}s`;
            projectsGrid.appendChild(projectCard);
        });
        
        console.log(`Loaded ${projects.length} projects from CSV`);
        
    } catch (error) {
        console.log('Using embedded projects content');
    }
}

async function loadCertificatesFromCSV() {
    try {
        const response = await fetch('data/certificates.csv');
        if (!response.ok) throw new Error('CSV file not found');
        
        const csvText = await response.text();
        const certificates = parseCSV(csvText);
        
        const certificatesGrid = document.getElementById('certificates-grid');
        if (!certificatesGrid) return;
        
        certificatesGrid.innerHTML = '';
        
        certificates.forEach((certificate, index) => {
            const certificateCard = createCertificateCard(certificate);
            certificateCard.style.animationDelay = `${index * 0.1}s`;
            certificatesGrid.appendChild(certificateCard);
        });
        
        console.log(`Loaded ${certificates.length} certificates from CSV`);
        
    } catch (error) {
        console.log('Using embedded certificates content');
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = parseCSVLine(lines[0]);
    const items = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        
        const values = parseCSVLine(line);
        const item = {};
        
        headers.forEach((header, index) => {
            const value = values[index] || '';
            if (header === 'tech') {
                item[header] = value.split(',').map(tech => tech.trim());
            } else {
                item[header] = value.trim();
            }
        });
        
        items.push(item);
    }
    
    return items;
}

// Parse CSV line handling quoted values
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
        i++;
    }
    
    result.push(current.trim());
    return result;
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    
    const techTags = Array.isArray(project.tech) 
        ? project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
        : project.tech.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('');
    
    card.innerHTML = `
        <div class="project-image">
            <div class="project-placeholder">
                <i class="${project.icon || 'fas fa-shield-alt'}"></i>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links">
                <a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i> GitHub
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// Create certificate card element
function createCertificateCard(certificate) {
    const card = document.createElement('div');
    card.className = 'certificate-card fade-in';
    
    card.innerHTML = `
        <div class="certificate-image">
            <div class="certificate-placeholder">
                <i class="${certificate.icon || 'fas fa-certificate'}"></i>
            </div>
        </div>
        <div class="certificate-content">
            <h3 class="certificate-title">${certificate.name}</h3>
            <p class="certificate-issuer">${certificate.issuer}</p>
            <p class="certificate-date">${certificate.date}</p>
            <p class="certificate-description">${certificate.description}</p>
        </div>
    `;
    
    return card;
}

// Initialize animations and load data on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load data from CSV files
    loadProjectsFromCSV();
    loadCertificatesFromCSV();
    
    // Animate skill bars when skills section is visible
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(skillsSection);
    }
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation for name
window.addEventListener('load', () => {
    const nameElement = document.querySelector('.name');
    const originalText = nameElement.textContent;
    typeWriter(nameElement, originalText, 150);
});

// Parallax effect for DNA helix
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const dnaHelix = document.getElementById('dna-helix');
    const speed = scrolled * 0.5;
    
    if (dnaHelix) {
        dnaHelix.style.transform = `translateY(-50%) rotateY(${speed}deg)`;
    }
});

// Add active class to navigation links
const addActiveClass = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

// Throttled scroll event for performance
let ticking = false;
function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            addActiveClass();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Add CSS for active navigation link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--code-green) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log(`
%cWelcome to Anirudh Nagekar's Portfolio!
%cBuilt with modern web technologies and cybersecurity expertise.
%cContact: aninag24@outlook.com | LinkedIn: linkedin.com/in/ani-nagekar
`, 
'color: #00ff41; font-size: 16px; font-weight: bold;',
'color: #0066ff; font-size: 12px;',
'color: #cccccc; font-size: 10px;'
);
