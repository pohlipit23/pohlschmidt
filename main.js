// Tech-themed canvas animation
function initNetworkAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    // --- Configuration ---
    const options = {
        particleColors: [
            'rgba(6, 182, 212, 0.7)',   // cyan-500
            'rgba(59, 130, 246, 0.7)',  // blue-500
            'rgba(139, 92, 246, 0.7)',  // violet-500
            'rgba(236, 72, 153, 0.7)'   // pink-500
        ],
        lineColor: `rgba(148, 163, 184, 0.4)`, // slate-400
        particleAmount: 60,
        defaultRadius: 2,
        variantRadius: 2,
        defaultSpeed: 0.3,
        variantSpeed: 0.3,
        linkRadius: 180
    };
    
    // --- Particle Class ---
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.color = options.particleColors[Math.floor(Math.random() * options.particleColors.length)];
            this.radius = options.defaultRadius + Math.random() * options.variantRadius;
            this.speed = options.defaultSpeed + Math.random() * options.variantSpeed;
            this.directionAngle = Math.floor(Math.random() * 360);
            this.vector = {
                x: Math.cos(this.directionAngle) * this.speed,
                y: Math.sin(this.directionAngle) * this.speed
            };
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Handle edge collision
            if (this.x < 0 || this.x > canvas.width) this.vector.x *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vector.y *= -1;
            
            // Move particle
            this.x += this.vector.x;
            this.y += this.vector.y;
        }
    }
    
    // --- Link particles ---
    function linkParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const distance = Math.sqrt(Math.pow(particles[i].x - particles[j].x, 2) + Math.pow(particles[i].y - particles[j].y, 2));
                
                if (distance < options.linkRadius) {
                    const opacity = 1 - (distance / options.linkRadius);
                    ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`; // slate-400 with opacity
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
    }

    // --- Main animation loop ---
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        linkParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    // --- Setup and Initialization ---
    function setup() {
        // Set canvas size to match its container
        const heroSection = document.getElementById('hero');
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;

        // Create particles
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
        for (let i = 0; i < Math.min(particleCount, options.particleAmount); i++) {
            particles.push(new Particle());
        }
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        animate();
    }

    // --- Event Listeners ---
    window.addEventListener('resize', setup);
    setup();
}

// Intersection Observer for fade-in animations
function setupIntersectionObserver() {
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeSections.forEach(section => {
        observer.observe(section);
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const menuButton = document.querySelector('nav button');
    const nav = document.querySelector('nav');
    if(!menuButton || !nav) return;

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'hidden fixed inset-0 bg-white bg-opacity-95 z-40 flex flex-col items-center justify-center p-6 space-y-6';
    mobileMenu.id = 'mobile-menu';
    
    menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    });
    
    nav.after(mobileMenu);
    
    const navItems = [
        { text: 'About', href: '#about' },
        { text: 'Ventures', href: '#ventures' },
        { text: 'Collaborate', href: '#collaborate' },
        { text: 'LinkedIn', href: 'https://www.linkedin.com/in/pohlschmidt/', target: '_blank', isButton: true }
    ];
    
    navItems.forEach(item => {
        const a = document.createElement('a');
        a.href = item.href;
        
        if (item.isButton) {
            a.className = 'bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium flex items-center hover:bg-blue-700 transition-colors space-x-2';
            a.innerHTML = '<i class="fab fa-linkedin-in"></i><span>LinkedIn</span>';
        } else {
            a.className = 'text-3xl font-medium py-3 text-gray-700 hover:text-cyan-600 transition-colors';
            a.textContent = item.text;
        }
        
        if (item.target) a.target = item.target;
        
        a.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
        });
        
        mobileMenu.appendChild(a);
    });
}

function toggleProjectDetails(button) {
    const container = button.closest('.project-details-container');
    const details = container.querySelector('.project-details');
    const icon = button.querySelector('i');
    
    const isHidden = details.classList.contains('hidden');

    // Close all other open details first
    document.querySelectorAll('.project-details').forEach(el => {
        if (el !== details && !el.classList.contains('hidden')) {
            el.classList.add('hidden');
            const otherButton = el.closest('.project-details-container').querySelector('button');
            const otherIcon = otherButton.querySelector('i');
            if (otherIcon) {
                otherIcon.classList.remove('fa-arrow-down');
                otherIcon.classList.add('fa-arrow-right');
            }
        }
    });

    // Toggle current details
    details.classList.toggle('hidden');
    
    if (isHidden) {
        icon.classList.remove('fa-arrow-right');
        icon.classList.add('fa-arrow-down');
        setTimeout(() => {
            details.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    } else {
         icon.classList.remove('fa-arrow-down');
         icon.classList.add('fa-arrow-right');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initNetworkAnimation();
    setupIntersectionObserver();
    setupMobileMenu();
    const yearElement = document.querySelector('#year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    document.addEventListener('click', (e) => {
        // Close details when clicking outside
        if (!e.target.closest('.project-details-container')) {
            document.querySelectorAll('.project-details').forEach(el => {
                if (!el.classList.contains('hidden')) {
                   el.classList.add('hidden');
                   const button = el.closest('.project-details-container').querySelector('button');
                   const icon = button.querySelector('i');
                   if(icon) {
                       icon.classList.remove('fa-arrow-down');
                       icon.classList.add('fa-arrow-right');
                   }
                }
            });
        }
        
        // Close mobile menu when clicking outside
        const mobileMenu = document.getElementById('mobile-menu');
        const menuButton = document.querySelector('nav button');
        if(mobileMenu && !mobileMenu.classList.contains('hidden') && !e.target.closest('#mobile-menu') && e.target !== menuButton && !menuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
});
