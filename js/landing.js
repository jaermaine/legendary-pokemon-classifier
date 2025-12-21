// ============================================================================
// LANDING PAGE FUNCTIONALITY
// ============================================================================

import { logger } from './utils/logger.js';

/**
 * Initialize smooth scrolling for CTA buttons and navigation
 */
function initializeSmoothScrolling() {
  const scrollLinks = document.querySelectorAll('[data-scroll]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-scroll');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Initialize sticky navigation with Intersection Observer
 */
function initializeStickyNavigation() {
  const stickyNav = document.getElementById('stickyNav');
  const landingSection = document.getElementById('landing');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!stickyNav || !landingSection) return;
  
  // Create observer to detect when hero leaves viewport
  const heroSection = document.querySelector('.hero-section');
  
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // Hero section is out of view, show nav
          stickyNav.classList.add('visible');
        } else {
          // Hero section is in view, hide nav
          stickyNav.classList.remove('visible');
        }
      });
    },
    { threshold: 0 }
  );
  
  if (heroSection) {
    navObserver.observe(heroSection);
  }
  
  // Update active nav link based on scroll position
  updateActiveNavLink();
  window.addEventListener('scroll', updateActiveNavLink);
}

/**
 * Update active navigation link based on current section
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop - 100) {
      currentSection = section.getAttribute('data-section');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-scroll') === currentSection) {
      link.classList.add('active');
    }
  });
}

/**
 * Animated counter for statistics
 */
function initializeCounters() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  let countersStarted = false;
  
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      });
    },
    { threshold: 0.5 }
  );
  
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    counterObserver.observe(statsSection);
  }
  
  function animateCounters() {
    statValues.forEach(element => {
      const target = parseFloat(element.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16);
      let current = 0;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
          clearInterval(counter);
        } else {
          element.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
        }
      }, 16);
    });
  }
}

/**
 * Back to top button functionality
 */
function initializeBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top on click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Intersection Observer for fade-in animations
 */
function initializeFadeInAnimations() {
  const animateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          animateObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  // Observe feature cards and stat cards
  const elementsToAnimate = document.querySelectorAll(
    '.feature-card, .stat-card, .timeline-step, .tech-badge'
  );
  
  elementsToAnimate.forEach(element => {
    animateObserver.observe(element);
  });
}

/**
 * Scroll progress bar
 */
function initializeScrollProgress() {
  const scrollProgress = document.createElement('div');
  scrollProgress.id = 'scrollProgress';
  document.body.appendChild(scrollProgress);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';
  });
}

/**
 * Enhanced CTA button interaction with ripple effect
 */
function initializeButtonEffects() {
  const buttons = document.querySelectorAll('.cta-button');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Only create ripple if clicked with mouse (not programmatically)
      if (e.clientX !== 0 || e.clientY !== 0) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      }
    });
  });
}

/**
 * Lazy load content sections
 */
function initializeLazyLoading() {
  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          lazyObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  const sections = document.querySelectorAll(
    '.features-section, .how-it-works-section, .tech-stack-section, .cta-section'
  );
  
  sections.forEach(section => {
    lazyObserver.observe(section);
  });
}

/**
 * Track predictions dynamically (if localStorage is available)
 */
function initializePredictionCounter() {
  const counter = document.getElementById('predictionsCounter');
  if (!counter) return;
  
  // Retrieve or initialize counter
  const savedCount = localStorage.getItem('pokemonPredictions') || 0;
  counter.textContent = savedCount;
  
  // Listen for prediction events from main app
  window.addEventListener('predictionMade', () => {
    const newCount = parseInt(localStorage.getItem('pokemonPredictions')) || 0;
    counter.textContent = newCount;
  });
}

/**
 * Keyboard accessibility - Enter key support for scrolling
 */
function initializeKeyboardAccessibility() {
  const scrollLinks = document.querySelectorAll('[data-scroll]');
  
  scrollLinks.forEach(link => {
    if (link.tagName !== 'BUTTON' && link.tagName !== 'A') {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });
}

/**
 * Prevent layout shift by updating scroll margin for anchors
 */
function initializeScrollMargins() {
  const stickyNav = document.getElementById('stickyNav');
  if (stickyNav) {
    const updateScrollMargin = () => {
      const navHeight = stickyNav.offsetHeight;
      document.documentElement.style.scrollPaddingTop = (navHeight + 20) + 'px';
    };
    
    updateScrollMargin();
    window.addEventListener('resize', updateScrollMargin);
  }
}

/**
 * Parallax effect for hero background blobs (subtle)
 */
function initializeParallax() {
  const heroBackground = document.querySelector('.hero-background');
  if (!heroBackground) return;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection && scrollPosition < heroSection.offsetHeight) {
      heroBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
  });
}

/**
 * Initialize all landing page features
 */
export function initializeLandingPage() {
  logger.log('🚀 Initializing landing page features...');
  
  initializeSmoothScrolling();
  initializeStickyNavigation();
  initializeCounters();
  initializeBackToTopButton();
  initializeFadeInAnimations();
  initializeScrollProgress();
  initializeButtonEffects();
  initializeLazyLoading();
  initializePredictionCounter();
  initializeKeyboardAccessibility();
  initializeScrollMargins();
  initializeParallax();
  
  logger.log('✅ Landing page features initialized!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLandingPage);
} else {
  initializeLandingPage();
}
