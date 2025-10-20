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
});