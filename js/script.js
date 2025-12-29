/**
 * PORTFOLIO WEBSITE - JAVASCRIPT
 * Author: Harshil Thakkar
 * Description: Handles smooth scrolling, navbar effects, form submission with Resend API, animations
 */

(function () {
  "use strict";


  // ===== THEME TOGGLE FUNCTIONALITY =====
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const htmlElement = document.documentElement;

  // Check for saved theme preference or default to dark mode
  // Note: "light" mode is actually a soft-dark theme, not white
  const currentTheme = localStorage.getItem("theme") || "dark";

  // Apply theme on load
  htmlElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      // Add rotation animation
      themeToggle.classList.add("rotating");

      // Update theme
      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);

      // Remove rotation class after animation
      setTimeout(() => {
        themeToggle.classList.remove("rotating");
      }, 500);
    });
  }

  // Update theme icon
  function updateThemeIcon(theme) {
    if (themeIcon) {
      if (theme === "dark") {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
      } else {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
      }
    }
  }

  // Note: We don't listen to system preferences since both modes are dark themes
  // User can manually toggle between dark and soft-dark modes

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when scrolling down
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  });

  // ===== TYPEWRITER EFFECT =====
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = "";

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // Keep cursor blinking
        element.style.borderRight = "3px solid #6366F1";
      }
    }

    type();
  }

  // Initialize typewriter effect
  const typewriterElement = document.getElementById("typewriter");
  if (typewriterElement) {
    const name = "Harshil Thakkar";
    setTimeout(() => {
      typeWriter(typewriterElement, name, 100);
    }, 500);
  }

  // ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if it's just "#"
      if (href === "#") {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      }
    });
  });

  // ===== ACTIVE NAVIGATION LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  function highlightActiveSection() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightActiveSection);
  highlightActiveSection();

  // ===== ANIMATE ELEMENTS ON SCROLL =====
  // Note: Progress bar animation removed as we switched to card layout

  // ===== CONTACT FORM HANDLING WITH WEB3FORMS =====
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // Remove previous error states
      clearFormErrors();

      // Validation
      let isValid = true;

      if (!name) {
        showFieldError("name", "Name is required");
        isValid = false;
      }

      if (!email) {
        showFieldError("email", "Email is required");
        isValid = false;
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showFieldError("email", "Please enter a valid email address");
          isValid = false;
        }
      }

      if (!message) {
        showFieldError("message", "Message is required");
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Disable submit button
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        // REPLACE THIS WITH YOUR WEB3FORMS ACCESS KEY
        const ACCESS_KEY = "47254847-45ea-4c14-b382-5736ab694b89"; 

        
        // Send email using Web3Forms API
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: ACCESS_KEY,
            name: name,
            email: email,
            message: message,
            subject: `Portfolio Contact: ${name}`,
          }),
        });

        const result = await response.json();

        if (result.success) {
           showNotification(
            "Thank you! Your message has been sent successfully.",
            "success"
          );
          contactForm.reset();
        } else {
          throw new Error(result.message || "Failed to send email");
        }

      } catch (error) {
        console.error("Error sending email:", error);
        showNotification(
          error.message ||
            "Failed to send message. Please try again or contact me directly.",
          "error"
        );
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  // ===== FORM VALIDATION HELPERS =====
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add("error");

      // Remove existing error message
      let errorDiv = field.parentElement.querySelector(".error-message");
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        field.parentElement.appendChild(errorDiv);
      }
      errorDiv.textContent = message;
      errorDiv.classList.add("show");
    }
  }

  function clearFormErrors() {
    const errorFields = document.querySelectorAll(".form-control.error");
    errorFields.forEach((field) => {
      field.classList.remove("error");
    });

    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => {
      msg.classList.remove("show");
    });
  }

  // Real-time validation
  const formFields = ["name", "email", "message"];
  formFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("blur", function () {
        const value = this.value.trim();
        if (value) {
          this.classList.remove("error");
          const errorDiv = this.parentElement.querySelector(".error-message");
          if (errorDiv) {
            errorDiv.classList.remove("show");
          }
        }
      });
    }
  });

  // ===== NOTIFICATION FUNCTION =====
  function showNotification(message, type = "success") {
    // Remove existing notification if any
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === "success" ? "#6366F1" : "#ef4444"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  // ===== SCROLL ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const animateElements = document.querySelectorAll(
    ".skill-category, .project-card, .timeline-item, .education-card, .strength-badge"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // ===== ADD CSS ANIMATIONS DYNAMICALLY =====
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // ===== PROJECT CARD HOVER EFFECTS =====
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // ===== SMOOTH SCROLL FOR STRENGTH BADGES =====
  const strengthBadges = document.querySelectorAll(".strength-badge");
  strengthBadges.forEach((badge, index) => {
    badge.style.animationDelay = `${index * 0.1}s`;
  });

  // ===== LOADING ANIMATION =====
  window.addEventListener("load", function () {
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = "1";
    }, 100);
  });

  // ===== CONSOLE MESSAGE =====
  console.log(
    "%c👋 Hello! Welcome to my portfolio.",
    "font-size: 16px; color: #6366F1; font-weight: bold;"
  );
  console.log(
    "%cBuilt with HTML, CSS, JavaScript, and Bootstrap",
    "font-size: 12px; color: #E5E7EB;"
  );
  console.log(
    "%cFeel free to explore the code!",
    "font-size: 12px; color: #8B5CF6;"
  );
})();
