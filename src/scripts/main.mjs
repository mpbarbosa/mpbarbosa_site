// Main site functionality - modularized for testing and modern JavaScript practices

/**
 * Sets up smooth scrolling for navigation links
 */
export function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  return links.length; // Return count for testing
}

/**
 * Sets up contact form submission handling
 */
export function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Handle form submission logic here
      alert('Form submitted! Thank you for reaching out.');
      contactForm.reset();
    });
    return true; // Return success for testing
  }
  return false; // Return false if form not found
}

/**
 * Initialize all site functionality when DOM is ready
 */
export function initializeSite() {
  setupSmoothScrolling();
  setupContactForm();
}

// Auto-initialize when loaded as a script (backward compatibility)
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
  initializeSite();
} else if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeSite);
}
