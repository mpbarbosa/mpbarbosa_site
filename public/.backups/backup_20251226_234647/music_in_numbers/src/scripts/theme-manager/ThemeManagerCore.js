/**
 * ThemeManagerCore - Business logic orchestration with dependency injection
 * 
 * This class contains the impure orchestration functions that coordinate theme management
 * workflows using dependency injection. All side effects are handled through injected
 * dependencies, following the "Functional Core, Imperative Shell" pattern.
 * 
 * Architecture: Imperative Shell (Side Effects with DI)
 * Pattern: Static methods with explicit dependency parameters
 * Dependencies: All injected (DOM, localStorage, events, etc.)
 */

class ThemeManagerCore {
    /**
     * Initialize theme management system with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} options - Initialization options
     * @returns {Object} Initialization result
     */
    static initializeThemeManagerCore(dependencies, options = {}) {
        const { 
            getStoredTheme, 
            detectSystemTheme, 
            logInfo, 
            logError 
        } = dependencies;

        try {
            logInfo('Initializing theme management system...');

            // Get stored or system theme
            const storedTheme = getStoredTheme();
            const systemTheme = detectSystemTheme();
            const defaultTheme = options.defaultTheme || 'dark';

            // Determine initial theme
            let initialTheme = defaultTheme;
            
            if (storedTheme) {
                const validation = ThemeManagerValidators.validateStoredTheme(storedTheme);
                if (validation.isValid) {
                    initialTheme = storedTheme;
                } else {
                    logError('Invalid stored theme:', validation.error);
                }
            } else if (systemTheme) {
                const validation = ThemeManagerValidators.validateTheme(systemTheme);
                if (validation.isValid) {
                    initialTheme = systemTheme;
                }
            }

            logInfo(`Initial theme determined: ${initialTheme}`);

            return {
                success: true,
                theme: initialTheme,
                source: storedTheme ? 'stored' : systemTheme ? 'system' : 'default'
            };

        } catch (error) {
            logError('Theme initialization failed:', error);
            return {
                success: false,
                error: error.message,
                theme: options.defaultTheme || 'dark'
            };
        }
    }

    /**
     * Apply theme with all side effects
     * @param {Object} dependencies - Injected dependencies
     * @param {string} theme - Theme to apply
     * @param {Object} options - Application options
     * @returns {Object} Application result
     */
    static applyThemeCore(dependencies, theme, options = {}) {
        const { 
            setDocumentTheme, 
            storeTheme, 
            announceToScreenReader, 
            logInfo, 
            logError 
        } = dependencies;

        try {
            // Validate theme
            const validation = ThemeManagerValidators.validateTheme(theme);
            if (!validation.isValid) {
                throw new Error(`Invalid theme: ${validation.error}`);
            }

            logInfo(`Applying theme: ${theme}`);

            // Set document theme attribute
            const documentResult = setDocumentTheme(theme);
            if (!documentResult.success) {
                throw new Error(`Failed to set document theme: ${documentResult.error}`);
            }

            // Store theme preference
            const storageResult = storeTheme(theme);
            if (!storageResult.success) {
                logError('Failed to store theme preference:', storageResult.error);
                // Continue anyway - storage failure shouldn't block theme application
            }

            // Announce to screen readers if enabled
            if (options.announceChanges !== false) {
                const message = ThemeManagerProcessors.processScreenReaderMessage(
                    `Theme changed to ${theme} mode`,
                    theme
                );
                announceToScreenReader(message);
            }

            logInfo(`Theme ${theme} applied successfully`);

            return {
                success: true,
                theme: theme,
                announced: options.announceChanges !== false
            };

        } catch (error) {
            logError('Theme application failed:', error);
            return {
                success: false,
                error: error.message,
                theme: theme
            };
        }
    }

    /**
     * Update theme buttons with current state
     * @param {Object} dependencies - Injected dependencies
     * @param {string} currentTheme - Currently active theme
     * @returns {Object} Update result
     */
    static updateThemeButtonsCore(dependencies, currentTheme) {
        const { 
            queryAllElements, 
            getElementById, 
            updateElementClasses, 
            logInfo, 
            logError 
        } = dependencies;

        try {
            // Validate current theme
            const validation = ThemeManagerValidators.validateTheme(currentTheme);
            if (!validation.isValid) {
                throw new Error(`Invalid current theme: ${validation.error}`);
            }

            logInfo(`Updating theme buttons for: ${currentTheme}`);

            // Remove active class from all theme buttons
            const themeButtons = queryAllElements('.theme-btn');
            let updatedButtons = 0;

            themeButtons.forEach(button => {
                const elementValidation = ThemeManagerValidators.validateDOMElement(button);
                if (elementValidation.isValid) {
                    updateElementClasses(button, ['active'], 'remove');
                    updatedButtons++;
                }
            });

            // Add active class to current theme button
            const buttonIds = ThemeManagerProcessors.processThemeToButtonIds(currentTheme);
            let activeButtonSet = false;

            for (const buttonId of buttonIds) {
                const buttonValidation = ThemeManagerValidators.validateThemeButtonId(buttonId);
                if (buttonValidation.isValid) {
                    const activeButton = getElementById(buttonId);
                    if (activeButton) {
                        const elementValidation = ThemeManagerValidators.validateDOMElement(activeButton);
                        if (elementValidation.isValid) {
                            updateElementClasses(activeButton, ['active'], 'add');
                            activeButtonSet = true;
                            break;
                        }
                    }
                }
            }

            logInfo(`Updated ${updatedButtons} theme buttons, active button set: ${activeButtonSet}`);

            return {
                success: true,
                buttonsUpdated: updatedButtons,
                activeButtonSet: activeButtonSet
            };

        } catch (error) {
            logError('Theme buttons update failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Setup keyboard shortcuts with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} options - Keyboard setup options
     * @returns {Object} Setup result
     */
    static setupKeyboardShortcutsCore(dependencies, options = {}) {
        const { 
            addDocumentEventListener, 
            getElementById, 
            clickElement, 
            logInfo, 
            logError 
        } = dependencies;

        try {
            logInfo('Setting up keyboard shortcuts...');

            const keyboardHandler = (event) => {
                try {
                    const eventData = ThemeManagerProcessors.processKeyboardEvent(event);
                    
                    if (eventData.altKey && eventData.isThemeShortcut) {
                        if (eventData.shouldPreventDefault) {
                            event.preventDefault();
                        }
                        
                        // Apply theme via core method
                        const applyResult = this.applyThemeCore(dependencies, eventData.theme, options);
                        if (!applyResult.success) {
                            logError(`Failed to apply theme via keyboard: ${applyResult.error}`);
                        }
                        
                        // Update buttons
                        const buttonResult = this.updateThemeButtonsCore(dependencies, eventData.theme);
                        if (!buttonResult.success) {
                            logError(`Failed to update buttons via keyboard: ${buttonResult.error}`);
                        }
                    }
                    
                    // Handle connect button shortcut
                    if (eventData.altKey && eventData.key.toLowerCase() === 'c') {
                        event.preventDefault();
                        const connectBtn = getElementById('connectBtn');
                        if (connectBtn && !connectBtn.disabled) {
                            clickElement(connectBtn);
                        }
                    }
                    
                    // Handle escape key
                    if (eventData.isEscape) {
                        const focusResult = this.handleEscapeKeyCore(dependencies, options);
                        if (!focusResult.success) {
                            logError(`Failed to handle escape key: ${focusResult.error}`);
                        }
                    }

                } catch (error) {
                    logError('Keyboard shortcut handler error:', error);
                }
            };

            // Add keyboard event listener
            const listenerResult = addDocumentEventListener('keydown', keyboardHandler);
            if (!listenerResult.success) {
                throw new Error(`Failed to add keyboard listener: ${listenerResult.error}`);
            }

            logInfo('Keyboard shortcuts setup complete');

            return {
                success: true,
                handler: keyboardHandler,
                shortcuts: ['Alt+L', 'Alt+D', 'Alt+H', 'Alt+C', 'Escape']
            };

        } catch (error) {
            logError('Keyboard shortcuts setup failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Setup accessibility features with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} options - Accessibility options
     * @returns {Object} Setup result
     */
    static setupAccessibilityFeaturesCore(dependencies, options = {}) {
        const { 
            addDocumentEventListener, 
            addBodyClass, 
            detectTouchDevice, 
            setupMediaQueryListener, 
            logInfo, 
            logError 
        } = dependencies;

        try {
            logInfo('Setting up accessibility features...');

            let featuresEnabled = 0;

            // Enhanced focus management
            const focusHandler = (event) => {
                try {
                    const element = event.target;
                    const elementValidation = ThemeManagerValidators.validateDOMElement(element);
                    
                    if (elementValidation.isValid) {
                        const focusResult = this.handleFocusInCore(dependencies, element, options);
                        if (!focusResult.success) {
                            logError(`Focus handling failed: ${focusResult.error}`);
                        }
                    }
                } catch (error) {
                    logError('Focus handler error:', error);
                }
            };

            const focusListenerResult = addDocumentEventListener('focusin', focusHandler);
            if (focusListenerResult.success) {
                featuresEnabled++;
            }

            // Touch device detection
            if (detectTouchDevice()) {
                const touchResult = addBodyClass('touch-device');
                if (touchResult.success) {
                    featuresEnabled++;
                    logInfo('Touch device support enabled');
                }
            }

            // System theme preference listener
            const themeMediaResult = setupMediaQueryListener(
                '(prefers-color-scheme: dark)',
                (matches) => this.handleSystemThemeChangeCore(dependencies, matches, options)
            );
            if (themeMediaResult.success) {
                featuresEnabled++;
            }

            // Reduced motion preference listener
            const motionMediaResult = setupMediaQueryListener(
                '(prefers-reduced-motion: reduce)',
                (matches) => this.handleReducedMotionChangeCore(dependencies, matches, options)
            );
            if (motionMediaResult.success) {
                featuresEnabled++;
            }

            logInfo(`Accessibility features setup complete. ${featuresEnabled} features enabled.`);

            return {
                success: true,
                featuresEnabled: featuresEnabled,
                handlers: {
                    focus: focusHandler
                }
            };

        } catch (error) {
            logError('Accessibility features setup failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Handle focus management with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Element} element - Element that received focus
     * @param {Object} options - Focus options
     * @returns {Object} Focus handling result
     */
    static handleFocusInCore(dependencies, element, options = {}) {
        const { scrollElementIntoView, logInfo } = dependencies;

        try {
            const elementValidation = ThemeManagerValidators.validateDOMElement(element);
            if (!elementValidation.isValid) {
                throw new Error(`Invalid element: ${elementValidation.error}`);
            }

            const scrollOptions = {
                behavior: options.scrollBehavior || 'smooth',
                block: options.scrollBlock || 'nearest'
            };

            const scrollResult = scrollElementIntoView(element, scrollOptions);
            
            if (scrollResult.success) {
                logInfo('Element scrolled into view on focus');
                return { success: true };
            } else {
                throw new Error(`Scroll failed: ${scrollResult.error}`);
            }

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Handle escape key with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {Object} options - Escape handling options
     * @returns {Object} Escape handling result
     */
    static handleEscapeKeyCore(dependencies, options = {}) {
        const { getElementById, focusElement, logInfo } = dependencies;

        try {
            const context = options.escapeContext || 'default';
            const targetId = ThemeManagerProcessors.processFocusTarget(context);

            const targetElement = getElementById(targetId);
            if (targetElement) {
                const elementValidation = ThemeManagerValidators.validateDOMElement(targetElement);
                if (elementValidation.isValid) {
                    const focusResult = focusElement(targetElement);
                    if (focusResult.success) {
                        logInfo(`Focus returned to ${targetId} via escape key`);
                        return { success: true, focusedElement: targetId };
                    } else {
                        throw new Error(`Focus failed: ${focusResult.error}`);
                    }
                }
            }

            // Fallback to document body
            const bodyResult = focusElement(document.body);
            if (bodyResult.success) {
                logInfo('Focus returned to document body via escape key');
                return { success: true, focusedElement: 'body' };
            }

            throw new Error('No suitable focus target found');

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Handle system theme change with dependency injection
     * @param {Object} dependencies - Injected dependencies
     * @param {boolean} prefersDark - Whether system prefers dark theme
     * @param {Object} options - Theme change options
     * @returns {Object} Theme change result
     */
    static handleSystemThemeChangeCore(dependencies, prefersDark, options = {}) {
        const { getStoredTheme, logInfo } = dependencies;

        try {
            // Only apply system theme if no stored preference
            const storedTheme = getStoredTheme();
            if (storedTheme) {
                logInfo('System theme change ignored - user preference exists');
                return { success: true, applied: false, reason: 'user_preference' };
            }

            const systemTheme = prefersDark ? 'dark' : 'light';
            logInfo(`System theme changed to: ${systemTheme}`);

            // Apply the system theme
            const applyResult = this.applyThemeCore(dependencies, systemTheme, {
                ...options,
                announceChanges: false // Don't announce automatic system changes
            });

            if (applyResult.success) {
                // Update buttons
                const buttonResult = this.updateThemeButtonsCore(dependencies, systemTheme);
                return {
                    success: true,
                    applied: true,
                    theme: systemTheme,
                    buttonsUpdated: buttonResult.success
                };
            } else {
                throw new Error(applyResult.error);
            }

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Handle reduced motion preference change
     * @param {Object} dependencies - Injected dependencies
     * @param {boolean} reducedMotion - Whether user prefers reduced motion
     * @param {Object} options - Motion options
     * @returns {Object} Motion handling result
     */
    static handleReducedMotionChangeCore(dependencies, reducedMotion, options = {}) {
        const { setCSSCustomProperty, logInfo } = dependencies;

        try {
            logInfo(`Reduced motion preference: ${reducedMotion}`);

            const motionValue = reducedMotion ? 'none' : 'all 0.3s ease';
            const animationValue = reducedMotion ? '0s' : '0.3s';

            const transitionResult = setCSSCustomProperty('--transition', motionValue);
            const animationResult = setCSSCustomProperty('--animation-duration', animationValue);

            return {
                success: transitionResult.success && animationResult.success,
                reducedMotion: reducedMotion,
                applied: {
                    transition: transitionResult.success,
                    animation: animationResult.success
                }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManagerCore;
}

if (typeof window !== 'undefined') {
    window.ThemeManagerCore = ThemeManagerCore;
}