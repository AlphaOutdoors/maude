// ============================================
// MAUDE - Interactive Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initScrollAnimations();
  initNavScrollEffect();
  initSmoothScroll();
  initDemoAnimations();
});

// ---------- Theme Switcher ----------
function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const root = document.documentElement;
  
  // Get saved theme or default to 'system'
  const savedTheme = localStorage.getItem('maude-theme') || 'system';
  applyTheme(savedTheme);
  
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      localStorage.setItem('maude-theme', theme);
    });
  });
  
  function applyTheme(theme) {
    // Update active button state
    themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    // Apply theme to root
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }
  
  // Listen for system theme changes when in system mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = localStorage.getItem('maude-theme') || 'system';
    if (currentTheme === 'system') {
      // Theme will automatically update via CSS media queries
      // Just ensure no data-theme attribute is set
      root.removeAttribute('data-theme');
    }
  });
}

// ---------- Scroll Reveal Animations ----------
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stagger children if present
        const children = entry.target.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 100}ms`;
          child.classList.add('revealed');
        });
      }
    });
  }, observerOptions);

  // Observe elements (excluding testimonial cards - they scroll infinitely)
  const revealElements = document.querySelectorAll(
    '.feature-card, .demo-panel, .highlight-card, .changelog-item'
  );
  
  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });

  // Add stagger class to grid children (excluding testimonials)
  document.querySelectorAll('.feature-grid, .highlights-grid').forEach(grid => {
    grid.querySelectorAll('.card').forEach(card => {
      card.classList.add('stagger-child');
    });
  });
}

// ---------- Navigation Scroll Effect ----------
function initNavScrollEffect() {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ---------- Smooth Scroll for Anchor Links ----------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ---------- Demo Panel Animations ----------
function initDemoAnimations() {
  const demoPanels = document.querySelectorAll('.demo-panel');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateDemoPanel(entry.target);
      }
    });
  }, { threshold: 0.3 });

  demoPanels.forEach(panel => observer.observe(panel));
}

function animateDemoPanel(panel) {
  // Animate metric bars
  const metricFills = panel.querySelectorAll('.demo-metric-fill');
  metricFills.forEach((fill, index) => {
    const targetWidth = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.transition = 'width 1s ease-out';
      fill.style.width = targetWidth;
    }, index * 150);
  });

  // Animate code lines
  const codeLines = panel.querySelectorAll('.demo-code-line');
  codeLines.forEach((line, index) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-10px)';
    setTimeout(() => {
      line.style.transition = 'all 0.3s ease-out';
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, index * 80);
  });

  // Animate analysis sections
  const analysisSections = panel.querySelectorAll('.demo-analysis-section');
  analysisSections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(10px)';
    setTimeout(() => {
      section.style.transition = 'all 0.4s ease-out';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

// ---------- Add CSS for animations ----------
const style = document.createElement('style');
style.textContent = `
  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .reveal-on-scroll.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  
  .stagger-child {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }
  
  .stagger-child.revealed {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
