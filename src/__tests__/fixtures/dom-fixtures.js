/**
 * Test Fixtures - DOM Templates
 *
 * Centralized test data for DOM-based tests to improve maintainability
 * and consistency across test suites.
 *
 * @module test-fixtures/dom
 */

/**
 * Basic navigation structure for testing smooth scrolling
 */
export const basicNavigation = `
  <nav>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
  </nav>
  <section id="about">About Section</section>
  <section id="projects">Projects Section</section>
  <section id="contact">Contact Section</section>
`;

/**
 * Contact form with all required fields
 */
export const contactForm = `
  <section id="contact">
    <form id="contact-form">
      <input type="text" name="name" required>
      <input type="email" name="email" required>
      <textarea name="message" required></textarea>
      <button type="submit">Send</button>
    </form>
  </section>
`;

/**
 * Complete page structure with navigation and contact form
 */
export const fullPageStructure = `
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

/**
 * Empty navigation for edge case testing
 */
export const emptyNavigation = `<div>No navigation</div>`;

/**
 * Navigation with external links
 */
export const navigationWithExternalLinks = `
  <nav>
    <a href="#about">About</a>
    <a href="http://example.com">External</a>
  </nav>
  <section id="about">About Section</section>
`;

/**
 * Multiple navigation links for performance testing
 * @param {number} count - Number of navigation links to generate
 * @returns {string} HTML string with specified number of links
 */
export const generateMultipleNavLinks = (count = 100) => {
  return Array.from({ length: count }, (_, i) => {
    return `<a href="#section${i}">Section ${i}</a>
            <div id="section${i}">Content ${i}</div>`;
  }).join('');
};

/**
 * Minimal form without contact wrapper
 */
export const minimalForm = `
  <form id="contact-form">
    <input type="text" name="name" required>
    <button type="submit">Send</button>
  </form>
`;

/**
 * Navigation with malformed links for error handling tests
 */
export const malformedNavigation = `
  <nav>
    <a href="#valid-id">Valid</a>
    <a href="#">Empty Hash</a>
    <a href="">No Href</a>
  </nav>
  <div id="valid-id">Valid Content</div>
`;

/**
 * Test data for form submissions
 */
export const formTestData = {
  validData: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, this is a test message!',
  },
  emptyData: {
    name: '',
    email: '',
    message: '',
  },
  partialData: {
    name: 'Jane Doe',
    email: '',
    message: 'Partial message',
  },
};

/**
 * Mock scroll targets for testing
 */
export const scrollTargets = ['#about', '#projects', '#contact'];

/**
 * Expected form field selectors
 */
export const formFieldSelectors = {
  name: 'input[name="name"]',
  email: 'input[name="email"]',
  message: 'textarea[name="message"]',
  submit: 'button[type="submit"]',
};
