// DOM Elements
const navbar = document.querySelector(".navbar");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const contactForm = document.getElementById("contactForm");

// Navigation Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Animate hamburger menu
  const bars = navToggle.querySelectorAll(".bar");
  bars.forEach((bar, index) => {
    if (navMenu.classList.contains("active")) {
      if (index === 0)
        bar.style.transform = "rotate(45deg) translate(5px, 5px)";
      if (index === 1) bar.style.opacity = "0";
      if (index === 2)
        bar.style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      bar.style.transform = "none";
      bar.style.opacity = "1";
    }
  });
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    const bars = navToggle.querySelectorAll(".bar");
    bars.forEach((bar) => {
      bar.style.transform = "none";
      bar.style.opacity = "1";
    });
  });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }

  // Dark mode navbar
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(17, 24, 39, 0.98)";
    } else {
      navbar.style.background = "rgba(17, 24, 39, 0.95)";
    }
  }
});

function playThemeTransitionFromButton(button, newTheme, onThemeSwitched) {
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom;
    const xPercent = (x / window.innerWidth) * 100;
    const yPercent = (y / window.innerHeight) * 100;

    const overlay = document.createElement('div');
    overlay.className = 'theme-transition';
    overlay.setAttribute('transition-style', 'in:custom:circle-swoop');
    overlay.style.setProperty('--swoop-x', `${xPercent}%`);
    overlay.style.setProperty('--swoop-y', `${yPercent}%`);
    overlay.style.background = newTheme === 'dark' ? '#18181b' : '#eafaf8';
    document.body.appendChild(overlay);

    // When in animation ends, switch theme and animate out
    overlay.addEventListener('animationend', function handleIn(e) {
        if (e.animationName === 'in-circle-swoop') {
            overlay.setAttribute('transition-style', 'out:custom:circle-swoop');
            if (typeof onThemeSwitched === 'function') onThemeSwitched();
        } else if (e.animationName === 'out-circle-swoop') {
            overlay.remove();
        }
    });
}

function updateNavbarTheme() {
    if (window.scrollY > 100) {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'rgba(17, 24, 39, 0.98)'
            : 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'rgba(17, 24, 39, 0.95)'
            : 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', updateNavbarTheme);

// Dark Mode Toggle
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  playThemeTransitionFromButton(themeToggle, newTheme, () => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    const icon = themeToggle.querySelector("i");
    icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    updateNavbarTheme();
  });
});

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
const icon = themeToggle.querySelector("i");
if (savedTheme === "dark") {
  icon.className = "fas fa-sun";
}

// Smooth scrolling for navigation links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("loaded");
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".skill-category, .project-card, .certification-card, .stat"
  );
  animateElements.forEach((el) => {
    el.classList.add("loading");
    observer.observe(el);
  });
});

// Contact Form Handling
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    try {
      // Simulate form submission (replace with actual form handling)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      showNotification("Message sent successfully!", "success");
      contactForm.reset();
    } catch (error) {
      showNotification("Failed to send message. Please try again.", "error");
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

  // Set background color based on type
  if (type === "success") {
    notification.style.background = "#10b981";
  } else if (type === "error") {
    notification.style.background = "#ef4444";
  } else {
    notification.style.background = "#3b82f6";
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Typewriter Animation for Hero Section (single span, robust)
function triggerTypewriter() {
    const typewriterAll = document.getElementById('typewriter-all');
    const cursor = document.querySelector('.cursor');
    if (typewriterAll && cursor) {
        // Reset
        typewriterAll.innerHTML = '';
        cursor.classList.remove('animate');
        cursor.style.opacity = 0;

        // Full text and name range
        const introText = "Hi, I'm ";
        const nameText = "Christian Arnold O. Uanan";
        const fullText = introText + nameText;
        const nameStart = introText.length;
        const nameEnd = fullText.length;
        let i = 0;

        function typeChar() {
            if (i < fullText.length) {
                if (i < nameStart) {
                    typewriterAll.innerHTML += fullText.charAt(i);
                } else {
                    // Color the name part green
                    const before = fullText.slice(0, nameStart);
                    const namePart = fullText.slice(nameStart, i + 1);
                    typewriterAll.innerHTML = before + `<span style='color:#22c55e;font-weight:bold;'>${namePart}</span>`;
                }
                i++;
                setTimeout(typeChar, i < nameStart ? 100 : 150);
            } else {
                setTimeout(() => {
                    cursor.classList.add('animate');
                    cursor.style.opacity = 1;
                }, 200);
            }
        }
        setTimeout(typeChar, 100);
    }
}

// Trigger typewriter on page load (after loader)
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(triggerTypewriter, 4000); // After 4-second loader
});

// Trigger typewriter when hero section comes into view
const heroSection = document.querySelector('.hero');
if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerTypewriter();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(heroSection);
}

// Parallax Effect for Hero Section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Skills Progress Animation
function animateSkills() {
  const skillItems = document.querySelectorAll(".skill-item");
  skillItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      item.style.transition = "all 0.6s ease";

      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 100);
    }, index * 100);
  });
}

// Trigger skills animation when skills section is in view
const skillsSection = document.querySelector(".skills");
if (skillsSection) {
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkills();
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillsObserver.observe(skillsSection);
}

// Project Card Hover Effects
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});

// Certification Card Hover Effects
document.querySelectorAll(".certification-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-5px) scale(1.02)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});

// Social Links Hover Effects
document.querySelectorAll(".social-link").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    link.style.transform = "translateY(-3px) scale(1.1)";
  });

  link.addEventListener("mouseleave", () => {
    link.style.transform = "translateY(0) scale(1)";
  });
});

// Form Input Focus Effects
document
  .querySelectorAll(".form-group input, .form-group textarea")
  .forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.style.transform = "translateY(-2px)";
    });

    input.addEventListener("blur", () => {
      input.parentElement.style.transform = "translateY(0)";
    });
  });

// Scroll to Top Button
function createScrollToTopButton() {
  const button = document.createElement("button");
  button.innerHTML = '<i class="fas fa-arrow-up"></i>';
  button.className = "scroll-to-top";
  button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
    `;

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  document.body.appendChild(button);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      button.style.opacity = "1";
      button.style.visibility = "visible";
    } else {
      button.style.opacity = "0";
      button.style.visibility = "hidden";
    }
  });
}

// Initialize scroll to top button
document.addEventListener("DOMContentLoaded", createScrollToTopButton);

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized scroll handler for navbar effects
const optimizedScrollHandler = debounce(() => {
  // Navbar scroll effect
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }

  // Dark mode navbar
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(17, 24, 39, 0.98)";
    } else {
      navbar.style.background = "rgba(17, 24, 39, 0.95)";
    }
  }
}, 10);

window.addEventListener("scroll", optimizedScrollHandler);

// Modal logic for Smart & PLDT certifications
const smartPldtCard = document.getElementById('smart-pldt-card');
const smartPldtModal = document.getElementById('smartPldtModal');
const modalOverlay = smartPldtModal ? smartPldtModal.querySelector('.modal-overlay') : null;
const modalClose = smartPldtModal ? smartPldtModal.querySelector('.modal-close') : null;

function openModal() {
  smartPldtModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  smartPldtModal.focus();
}
function closeModal() {
  smartPldtModal.classList.remove('active');
  document.body.style.overflow = '';
  smartPldtCard.focus();
}
if (smartPldtCard && smartPldtModal) {
  smartPldtCard.addEventListener('click', openModal);
  smartPldtCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  smartPldtModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    // Trap focus inside modal
    if (e.key === 'Tab') {
      const focusable = smartPldtModal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
}
