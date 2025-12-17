/**
 * Custom Jest Environment - jsdom without localStorage warnings
 * 
 * Purpose: Suppress jsdom --localstorage-file warnings that occur when
 * jsdom checks for localStorage file persistence option
 * 
 * This is a wrapper around jest-environment-jsdom that filters out the
 * warning about invalid --localstorage-file paths since we don't need
 * localStorage file persistence for our tests (in-memory is sufficient)
 */

const JSDOMEnvironment = require('jest-environment-jsdom').default;

class CustomJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
        // Suppress console warnings during setup
        const originalConsoleWarn = console.warn;
        console.warn = (...args) => {
            const message = args[0]?.toString() || '';
            
            // Filter out localStorage file warning
            if (message.includes('--localstorage-file')) {
                return; // Suppress this specific warning
            }
            
            // Pass through other warnings
            originalConsoleWarn(...args);
        };

        super(config, context);

        // Restore original console.warn after initialization
        console.warn = originalConsoleWarn;
    }
}

module.exports = CustomJSDOMEnvironment;
