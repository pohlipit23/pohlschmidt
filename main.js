// Enhanced Particle System for Hero Background
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mousePosition = { x: 0, y: 0 };
        this.isMouseActive = false;
        this.time = 0;
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    createParticles() {
        const particleCount = Math.min(120, Math.floor((this.canvas.width * this.canvas.height) / 12000));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width / window.devicePixelRatio,
                y: Math.random() * this.canvas.height / window.devicePixelRatio,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 3 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                originalOpacity: Math.random() * 0.6 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                color: `hsl(${220 + Math.random() * 40}, 70%, ${60 + Math.random() * 20}%)`
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
            this.isMouseActive = true;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseActive = false;
        });
    }
    
    updateParticles() {
        const canvasWidth = this.canvas.width / window.devicePixelRatio;
        const canvasHeight = this.canvas.height / window.devicePixelRatio;
        
        this.particles.forEach((particle, index) => {
            // Pulsing effect
            particle.opacity = particle.originalOpacity + Math.sin(this.time * particle.pulseSpeed) * 0.3;
            
            // Mouse interaction with stronger effect
            if (this.isMouseActive) {
                const dx = this.mousePosition.x - particle.x;
                const dy = this.mousePosition.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.vx += (dx / distance) * force * 0.02;
                    particle.vy += (dy / distance) * force * 0.02;
                    particle.opacity = Math.min(1, particle.opacity + force * 0.5);
                }
            }
            
            // Wave motion
            particle.x += particle.vx + Math.sin(this.time * 0.01 + index) * 0.1;
            particle.y += particle.vy + Math.cos(this.time * 0.01 + index) * 0.1;
            
            // Boundary checking with bounce
            if (particle.x < 0 || particle.x > canvasWidth) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(canvasWidth, particle.x));
            }
            if (particle.y < 0 || particle.y > canvasHeight) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(canvasHeight, particle.y));
            }
            
            // Damping
            particle.vx *= 0.995;
            particle.vy *= 0.995;
        });
        
        this.time++;
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 140) {
                    const opacity = (140 - distance) / 140 * 0.15;
                    const gradient = this.ctx.createLinearGradient(
                        this.particles[i].x, this.particles[i].y,
                        this.particles[j].x, this.particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(0, 102, 255, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(51, 133, 255, ${opacity * 0.8})`);
                    gradient.addColorStop(1, `rgba(0, 82, 204, ${opacity})`);
                    
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            // Glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 3
            );
            gradient.addColorStop(0, `rgba(0, 102, 255, ${particle.opacity})`);
            gradient.addColorStop(0.4, `rgba(51, 133, 255, ${particle.opacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(0, 102, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 102, 255, ${particle.opacity * 0.8})`;
            this.ctx.fill();
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Rotating Text Animation
class RotatingText {
    constructor(element) {
        this.element = element;
        this.items = this.element.querySelectorAll('.text-item');
        this.currentIndex = 0;
        this.interval = 3000;
        
        this.start();
    }
    
    start() {
        setInterval(() => {
            this.items[this.currentIndex].classList.remove('active');
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
            this.items[this.currentIndex].classList.add('active');
        }, this.interval);
    }
}

// Enhanced Scroll Animation Observer
class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
        
        this.init();
    }
    
    init() {
        // Observe venture items
        const ventureItems = document.querySelectorAll('.venture-item');
        ventureItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.15}s`;
            this.observer.observe(item);
        });
        
        // Observe stat items
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(item);
        });
        
        // Observe tags
        const tags = document.querySelectorAll('.tag');
        tags.forEach((tag, index) => {
            tag.style.transitionDelay = `${index * 0.05}s`;
            this.observer.observe(tag);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }
}

// Smooth Scrolling Navigation
class SmoothScroll {
    constructor() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for nav height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Navigation Scroll Effect
class NavigationController {
    constructor() {
        this.nav = document.getElementById('nav');
        this.lastScrollY = window.scrollY;
        
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            this.lastScrollY = currentScrollY;
        });
    }
}

// Enhanced Tag Interaction Effects
class TagController {
    constructor() {
        this.init();
    }
    
    init() {
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.addEventListener('mouseenter', this.handleTagHover.bind(this));
            tag.addEventListener('mouseleave', this.handleTagLeave.bind(this));
            tag.addEventListener('click', this.handleTagClick.bind(this));
        });
    }
    
    handleTagHover(e) {
        const tag = e.target;
        const rect = tag.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        tag.style.setProperty('--x', x + 'px');
        tag.style.setProperty('--y', y + 'px');
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 102, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
            pointer-events: none;
        `;
        
        tag.style.position = 'relative';
        tag.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    handleTagLeave(e) {
        const tag = e.target;
        tag.style.removeProperty('--x');
        tag.style.removeProperty('--y');
    }
    
    handleTagClick(e) {
        const tag = e.target;
        tag.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tag.style.transform = '';
        }, 150);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        
        if (window.location.search.includes('debug')) {
            this.showStats();
        }
    }
    
    showStats() {
        const stats = document.createElement('div');
        stats.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            border-radius: 4px;
        `;
        document.body.appendChild(stats);
        
        const updateStats = () => {
            const now = performance.now();
            this.frameCount++;
            
            if (now - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
                this.frameCount = 0;
                this.lastTime = now;
                
                stats.innerHTML = `
                    FPS: ${this.fps}<br>
                    Memory: ${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB
                `;
            }
            
            requestAnimationFrame(updateStats);
        };
        
        updateStats();
    }
}

// SEO and Analytics Helper
class SEOHelper {
    constructor() {
        this.init();
    }
    
    init() {
        // Add structured data for breadcrumbs
        this.addBreadcrumbStructuredData();
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Add loading performance metrics
        this.trackLoadingPerformance();
    }
    
    addBreadcrumbStructuredData() {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://pohlschmidt.de"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Digital Transformation Expert",
                    "item": "https://pohlschmidt.de#about"
                }
            ]
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    }
    
    trackScrollDepth() {
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    this.trackEvent('Scroll Depth', `${milestone}%`, window.location.pathname);
                }
            });
        });
    }
    
    trackLoadingPerformance() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    this.trackEvent('Performance', 'Page Load Time', Math.round(loadTime));
                }
            }, 0);
        });
    }
    
    trackEvent(category, action, label) {
        // Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                custom_parameter_1: window.location.pathname
            });
        }
        
        // Console log for debugging
        console.log(`Analytics Event: ${category} - ${action} - ${label}`);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
    
    // Initialize rotating text
    const rotatingText = document.getElementById('rotating-text');
    if (rotatingText) {
        new RotatingText(rotatingText);
    }
    
    // Initialize scroll animations
    new ScrollAnimator();
    
    // Initialize smooth scrolling
    new SmoothScroll();
    
    // Initialize navigation controller
    new NavigationController();
    
    // Initialize tag controller
    new TagController();
    
    // Initialize performance monitor (only in debug mode)
    new PerformanceMonitor();
    
    // Initialize SEO helper
    new SEOHelper();
    
    // Add loading animation end
    document.body.classList.add('loaded');
});

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Enhanced Analytics tracking
function trackEvent(category, action, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', action, {
            category: category,
            label: label
        });
    }
}

// Track CTA clicks and interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary')) {
        trackEvent('CTA', 'click', e.target.textContent.trim());
    }
    
    if (e.target.matches('.venture-link')) {
        trackEvent('Venture', 'click', e.target.textContent.trim());
    }
    
    if (e.target.matches('.nav-link')) {
        trackEvent('Navigation', 'click', e.target.textContent.trim());
    }
    
    if (e.target.matches('.tag')) {
        trackEvent('Tag', 'click', e.target.textContent.trim());
    }
});

// Track form interactions (if forms are added later)
document.addEventListener('submit', (e) => {
    if (e.target.matches('form')) {
        trackEvent('Form', 'submit', e.target.id || 'unknown');
    }
});

// Lazy loading for images (enhanced version)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
            
            // Track image loading
            trackEvent('Image', 'loaded', img.alt || img.src);
        }
    });
}, {
    rootMargin: '50px'
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);