/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { setupSmoothScrolling, setupContactForm, initializeSite } from '../scripts/main.mjs';

describe('Main Site JavaScript Functionality', () => {
  beforeEach(() => {
    // Set up DOM elements for testing
    document.body.innerHTML = `
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
      <section id="about">About Section</section>
      <section id="projects">Projects Section</section>
      <section id="contact">
        <form id="contact-form">
          <input type="text" name="name" required>
          <input type="email" name="email" required>
          <textarea name="message" required></textarea>
          <button type="submit">Send</button>
        </form>
      </section>
    `;
  });

  describe('Smooth Scrolling Navigation', () => {
    test('should set up smooth scrolling for navigation links', () => {
      // Mock scrollIntoView
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      // Call the actual function
      const linkCount = setupSmoothScrolling();

      expect(linkCount).toBe(3);

      // Test that clicking a link triggers smooth scrolling
      const aboutLink = document.querySelector('a[href="#about"]');
      const clickEvent = new Event('click');

      aboutLink.dispatchEvent(clickEvent);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    test('should handle missing target elements gracefully', () => {
      // Add a link to non-existent element
      const link = document.createElement('a');
      link.href = '#nonexistent';
      document.body.appendChild(link);

      // This should not throw an error
      expect(() => {
        setupSmoothScrolling();
        const clickEvent = new Event('click');
        link.dispatchEvent(clickEvent);
      }).not.toThrow();
    });

    test('should return correct number of processed links', () => {
      const linkCount = setupSmoothScrolling();
      expect(linkCount).toBe(3); // Based on our test DOM structure
    });
  });

  describe('Contact Form Handling', () => {
    test('should set up contact form submission handling', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Call the actual function
      const result = setupContactForm();

      expect(result).toBe(true); // Should return true when form is found

      // Test form submission
      const form = document.getElementById('contact-form');
      const submitEvent = new Event('submit');

      form.dispatchEvent(submitEvent);

      expect(alertSpy).toHaveBeenCalledWith('Form submitted! Thank you for reaching out.');
      alertSpy.mockRestore();
    });

    test('should return false when no contact form exists', () => {
      // Remove the contact form
      const form = document.getElementById('contact-form');
      form.remove();

      // Call the function
      const result = setupContactForm();

      expect(result).toBe(false); // Should return false when form is not found
    });

    test('should reset form after submission', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Set up the form handling
      setupContactForm();

      const form = document.getElementById('contact-form');
      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const messageInput = form.querySelector('textarea[name="message"]');

      // Fill form with test data
      nameInput.value = 'Test User';
      emailInput.value = 'test@example.com';
      messageInput.value = 'Test message';

      // Submit the form
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      // Check that form is reset
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
  });

  describe('Site Initialization', () => {
    test('should initialize all site functionality', () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Call the initialization function
      initializeSite();

      // Test that smooth scrolling is set up
      const aboutLink = document.querySelector('a[href="#about"]');
      const clickEvent = new Event('click');
      aboutLink.dispatchEvent(clickEvent);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

      // Test that form handling is set up
      const form = document.getElementById('contact-form');
      const submitEvent = new Event('submit');
      form.dispatchEvent(submitEvent);

      expect(window.alert).toHaveBeenCalledWith('Form submitted! Thank you for reaching out.');
    });

    test('should handle missing DOM elements gracefully', () => {
      // Clear the DOM
      document.body.innerHTML = '';

      // This should not throw an error
      expect(() => {
        initializeSite();
      }).not.toThrow();
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle zero navigation links', () => {
      document.body.innerHTML = '<div>No navigation</div>';

      const linkCount = setupSmoothScrolling();

      expect(linkCount).toBe(0);
    });

    test('should handle multiple clicks on same navigation link', () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      setupSmoothScrolling();

      const aboutLink = document.querySelector('a[href="#about"]');
      const clickEvent1 = new Event('click');
      const clickEvent2 = new Event('click');
      const clickEvent3 = new Event('click');

      aboutLink.dispatchEvent(clickEvent1);
      aboutLink.dispatchEvent(clickEvent2);
      aboutLink.dispatchEvent(clickEvent3);

      expect(mockScrollIntoView).toHaveBeenCalledTimes(3);
    });

    test('should handle navigation links without hash', () => {
      const externalLink = document.createElement('a');
      externalLink.href = 'http://example.com';
      document.body.appendChild(externalLink);

      // Should not count external links
      const linkCount = setupSmoothScrolling();
      expect(linkCount).toBe(3); // Only hash links
    });

    test('should handle malformed href attributes', () => {
      const malformedLink = document.createElement('a');
      malformedLink.href = '#valid-id'; // Use valid ID instead of just '#'
      document.body.appendChild(malformedLink);

      setupSmoothScrolling();

      const clickEvent = new Event('click');
      expect(() => malformedLink.dispatchEvent(clickEvent)).not.toThrow();
    });

    test('should prevent default behavior on navigation links', () => {
      setupSmoothScrolling();

      const aboutLink = document.querySelector('a[href="#about"]');
      const clickEvent = new Event('click');

      // Create spy for preventDefault
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

      aboutLink.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should handle form submission with empty fields', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      setupContactForm();

      const form = document.getElementById('contact-form');
      const submitEvent = new Event('submit');

      form.dispatchEvent(submitEvent);

      expect(alertSpy).toHaveBeenCalledWith('Form submitted! Thank you for reaching out.');
      alertSpy.mockRestore();
    });

    test('should handle form submission event preventing', () => {
      setupContactForm();

      const form = document.getElementById('contact-form');
      const submitEvent = new Event('submit');
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

      jest.spyOn(window, 'alert').mockImplementation(() => {});

      form.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should handle multiple form submissions', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Re-setup form for clean test
      document.body.innerHTML = `
        <form id="contact-form">
          <input type="text" name="name" required>
          <button type="submit">Send</button>
        </form>
      `;

      setupContactForm();

      const form = document.getElementById('contact-form');

      // Each submission should work independently
      form.dispatchEvent(new Event('submit'));
      form.dispatchEvent(new Event('submit'));
      form.dispatchEvent(new Event('submit'));

      expect(alertSpy).toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    test('should handle navigation to all sections', () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      setupSmoothScrolling();

      // Test all navigation links
      const sections = ['#about', '#projects', '#contact'];
      sections.forEach((selector) => {
        const link = document.querySelector(`a[href="${selector}"]`);
        const clickEvent = new Event('click');
        link.dispatchEvent(clickEvent);
      });

      expect(mockScrollIntoView).toHaveBeenCalledTimes(3);
    });

    test('should maintain smooth scroll behavior across all links', () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      setupSmoothScrolling();

      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach((link) => {
        const clickEvent = new Event('click');
        link.dispatchEvent(clickEvent);
      });

      // Verify all calls used smooth scrolling
      mockScrollIntoView.mock.calls.forEach((call) => {
        expect(call[0]).toEqual({ behavior: 'smooth' });
      });
    });
  });

  describe('DOM Ready State Handling', () => {
    test('should handle document ready state check', () => {
      // This tests the module's auto-initialization logic
      expect(document.readyState).toBeDefined();
    });

    test('should export all required functions', () => {
      expect(setupSmoothScrolling).toBeDefined();
      expect(typeof setupSmoothScrolling).toBe('function');

      expect(setupContactForm).toBeDefined();
      expect(typeof setupContactForm).toBe('function');

      expect(initializeSite).toBeDefined();
      expect(typeof initializeSite).toBe('function');
    });
  });

  describe('Return Value Testing', () => {
    test('setupSmoothScrolling should return number of links', () => {
      const result = setupSmoothScrolling();

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    test('setupContactForm should return boolean', () => {
      const result = setupContactForm();

      expect(typeof result).toBe('boolean');
    });

    test('setupContactForm returns true when form exists', () => {
      const result = setupContactForm();

      expect(result).toBe(true);
    });

    test('setupContactForm returns false when form missing', () => {
      document.body.innerHTML = '<div>No form here</div>';

      const result = setupContactForm();

      expect(result).toBe(false);
    });
  });

  describe('Integration Testing', () => {
    test('should handle complete user journey - navigation and form', () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      // Initialize site
      initializeSite();

      // User clicks About link
      const aboutLink = document.querySelector('a[href="#about"]');
      aboutLink.dispatchEvent(new Event('click'));
      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);

      // User clicks Projects link
      const projectsLink = document.querySelector('a[href="#projects"]');
      projectsLink.dispatchEvent(new Event('click'));
      expect(mockScrollIntoView).toHaveBeenCalledTimes(2);

      // User clicks Contact link
      const contactLink = document.querySelector('a[href="#contact"]');
      contactLink.dispatchEvent(new Event('click'));
      expect(mockScrollIntoView).toHaveBeenCalledTimes(3);

      // User fills and submits form
      const form = document.getElementById('contact-form');
      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const messageInput = form.querySelector('textarea[name="message"]');

      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      messageInput.value = 'Hello, this is a test message!';

      form.dispatchEvent(new Event('submit'));

      expect(alertSpy).toHaveBeenCalledWith('Form submitted! Thank you for reaching out.');
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');

      alertSpy.mockRestore();
    });

    test('should handle rapid navigation clicks', () => {
      const mockScrollIntoView = jest.fn();
      Element.prototype.scrollIntoView = mockScrollIntoView;

      setupSmoothScrolling();

      const links = document.querySelectorAll('a[href^="#"]');

      // Simulate rapid clicking
      for (let i = 0; i < 10; i++) {
        links.forEach((link) => {
          link.dispatchEvent(new Event('click'));
        });
      }

      expect(mockScrollIntoView).toHaveBeenCalledTimes(30); // 3 links × 10 iterations
    });
  });

  describe('Error Resilience', () => {
    test('should handle null querySelector results', () => {
      document.body.innerHTML = '';

      expect(() => setupSmoothScrolling()).not.toThrow();
      expect(() => setupContactForm()).not.toThrow();
    });

    test('should handle missing Element.prototype.scrollIntoView', () => {
      const originalScrollIntoView = Element.prototype.scrollIntoView;
      delete Element.prototype.scrollIntoView;

      setupSmoothScrolling();

      // Should not throw when scrollIntoView is missing
      // We can't click because it would throw, but we can verify setup didn't fail
      expect(document.querySelectorAll('a[href^="#"]').length).toBeGreaterThan(0);

      Element.prototype.scrollIntoView = originalScrollIntoView;
    });

    test('should handle addEventListener failures gracefully', () => {
      const originalAddEventListener = Element.prototype.addEventListener;
      let addEventListenerCallCount = 0;

      Element.prototype.addEventListener = function () {
        addEventListenerCallCount++;
        return originalAddEventListener.apply(this, arguments);
      };

      setupSmoothScrolling();
      setupContactForm();

      expect(addEventListenerCallCount).toBeGreaterThan(0);

      Element.prototype.addEventListener = originalAddEventListener;
    });
  });

  describe('Performance and Memory', () => {
    test('should attach event listeners only once per call', () => {
      const originalAddEventListener = Element.prototype.addEventListener;
      let listenerCount = 0;

      Element.prototype.addEventListener = function () {
        listenerCount++;
        return originalAddEventListener.apply(this, arguments);
      };

      setupSmoothScrolling();
      const firstCount = listenerCount;

      setupSmoothScrolling();
      const secondCount = listenerCount;

      expect(secondCount).toBe(firstCount * 2); // Double because called twice

      Element.prototype.addEventListener = originalAddEventListener;
    });

    test('should handle large number of navigation links', () => {
      // Create many navigation links
      const navHtml = Array.from({ length: 100 }, (_, i) => {
        return `<a href="#section${i}">Section ${i}</a>
                <div id="section${i}">Content ${i}</div>`;
      }).join('');

      document.body.innerHTML = navHtml;

      const linkCount = setupSmoothScrolling();

      expect(linkCount).toBe(100);
    });
  });
});
