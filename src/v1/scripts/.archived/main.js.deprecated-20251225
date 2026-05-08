// This file contains the JavaScript code for the landing page.
// It may include functionality for interactivity, such as form submissions or dynamic content loading.

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      targetElement.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Example of form submission handling (if a contact form is included)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Handle form submission logic here
      alert('Form submitted! Thank you for reaching out.');
      contactForm.reset();
    });
  }
});
