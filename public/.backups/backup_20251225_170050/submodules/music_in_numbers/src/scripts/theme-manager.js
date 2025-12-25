// ===== ENHANCED USER EXPERIENCE FEATURES =====

// Import extracted theme management classes (with fallback support)
let ThemeManagerValidators, ThemeManagerProcessors, ThemeManagerUIBuilders, ThemeManagerCore, ThemeManagerUtilities;

try {
    if (typeof require !== 'undefined') {
        ThemeManagerValidators = require('./theme-manager/ThemeManagerValidators.js');
        ThemeManagerProcessors = require('./theme-manager/ThemeManagerProcessors.js');
        ThemeManagerUIBuilders = require('./theme-manager/ThemeManagerUIBuilders.js');
        ThemeManagerCore = require('./theme-manager/ThemeManagerCore.js');
        ThemeManagerUtilities = require('./theme-manager/ThemeManagerUtilities.js');
    }
} catch (error) {
    console.warn('Theme management modules not available, using fallback implementation:', error.message);
}

// Ensure dependencies are available for delegation
function ensureThemeManagerDependencies() {
    if (typeof ThemeManagerUtilities !== 'undefined' && ThemeManagerUtilities.createEnvironmentAwareDependencyContainer) {
        return ThemeManagerUtilities.createEnvironmentAwareDependencyContainer();
    }
    
    // Fallback dependency container if utilities not available
    return {
        getStoredTheme: () => localStorage.getItem('spotify-theme'),
        storeTheme: (theme) => {
            try {
                localStorage.setItem('spotify-theme', theme);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        setDocumentTheme: (theme) => {
            try {
                document.documentElement.setAttribute('data-theme', theme);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        announceToScreenReader: (message) => {
            try {
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.className = 'sr-only';
                announcement.textContent = message;
                document.body.appendChild(announcement);
                setTimeout(() => {
                    if (announcement.parentNode) {
                        document.body.removeChild(announcement);
                    }
                }, 1000);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        logInfo: (message, ...args) => console.log('[ThemeManager]', message, ...args),
        logError: (message, ...args) => console.error('[ThemeManager]', message, ...args)
    };
}

// Theme Management System (Delegation Wrapper)
class ThemeManager {
    constructor() {
        // Use extracted classes when available, fallback to legacy implementation
        if (typeof ThemeManagerCore !== 'undefined') {
            this.initializeWithExtractedClasses();
        } else {
            this.initializeWithFallback();
        }
    }
    
    initializeWithExtractedClasses() {
        const dependencies = ensureThemeManagerDependencies();
        
        // Initialize using extracted core
        const initResult = ThemeManagerCore.initializeThemeManagerCore(dependencies, {
            defaultTheme: 'dark'
        });
        
        if (initResult.success) {
            this.currentTheme = initResult.theme;
            this.applyTheme(this.currentTheme);
            this.updateThemeButtons();
            this.setupKeyboardShortcuts();
            this.setupAccessibilityFeatures();
        } else {
            dependencies.logError('Failed to initialize with extracted classes:', initResult.error);
            this.initializeWithFallback();
        }
    }
    
    initializeWithFallback() {
        this.currentTheme = this.getStoredTheme() || 'dark';
        this.initializeTheme();
        this.setupKeyboardShortcuts();
        this.setupAccessibilityFeatures();
    }
    
    getStoredTheme() {
        // Delegate to extracted class when available
        if (typeof ThemeManagerUtilities !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            return dependencies.getStoredTheme();
        }
        
        // Fallback implementation
        return localStorage.getItem('spotify-theme');
    }
    
    setStoredTheme(theme) {
        // Delegate to extracted class when available
        if (typeof ThemeManagerUtilities !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            return dependencies.storeTheme(theme);
        }
        
        // Fallback implementation
        localStorage.setItem('spotify-theme', theme);
    }
    
    initializeTheme() {
        this.applyTheme(this.currentTheme);
        this.updateThemeButtons();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
        
        // Listen for reduced motion preference
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) {
            document.documentElement.style.setProperty('--transition', 'none');
        }
    }
    
    applyTheme(theme) {
        // Delegate to extracted class when available
        if (typeof ThemeManagerCore !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            const result = ThemeManagerCore.applyThemeCore(dependencies, theme, {
                announceChanges: true
            });
            
            if (result.success) {
                this.currentTheme = theme;
                return;
            } else {
                dependencies.logError('Failed to apply theme via extracted class:', result.error);
                // Fall through to legacy implementation
            }
        }
        
        // Fallback implementation
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.setStoredTheme(theme);
        this.announceToScreenReader(`Theme changed to ${theme} mode`);
    }
    
    updateThemeButtons() {
        // Delegate to extracted class when available
        if (typeof ThemeManagerCore !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            const result = ThemeManagerCore.updateThemeButtonsCore(dependencies, this.currentTheme);
            
            if (result.success) {
                return;
            } else {
                dependencies.logError('Failed to update buttons via extracted class:', result.error);
                // Fall through to legacy implementation
            }
        }
        
        // Fallback implementation
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(`${this.currentTheme.replace('-', '')}Theme`) || 
                         document.getElementById(`${this.currentTheme}Theme`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    setupKeyboardShortcuts() {
        // Delegate to extracted class when available
        if (typeof ThemeManagerCore !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            const result = ThemeManagerCore.setupKeyboardShortcutsCore(dependencies, {
                announceChanges: true
            });
            
            if (result.success) {
                return;
            } else {
                dependencies.logError('Failed to setup keyboard shortcuts via extracted class:', result.error);
                // Fall through to legacy implementation
            }
        }
        
        // Fallback implementation
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch (e.key.toLowerCase()) {
                    case 'l':
                        e.preventDefault();
                        this.setTheme('light');
                        break;
                    case 'd':
                        e.preventDefault();
                        this.setTheme('dark');
                        break;
                    case 'h':
                        e.preventDefault();
                        this.setTheme('high-contrast');
                        break;
                    case 'c':
                        e.preventDefault();
                        const connectBtn = document.getElementById('connectBtn');
                        if (connectBtn && !connectBtn.disabled) {
                            connectBtn.click();
                        }
                        break;
                }
            }
            
            // Escape key to close modals or return focus
            if (e.key === 'Escape') {
                this.handleEscape();
            }
        });
    }
    
    setupAccessibilityFeatures() {
        // Delegate to extracted class when available
        if (typeof ThemeManagerCore !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            const result = ThemeManagerCore.setupAccessibilityFeaturesCore(dependencies, {
                scrollBehavior: 'smooth',
                scrollBlock: 'nearest'
            });
            
            if (result.success) {
                return;
            } else {
                dependencies.logError('Failed to setup accessibility features via extracted class:', result.error);
                // Fall through to legacy implementation
            }
        }
        
        // Fallback implementation
        document.addEventListener('focusin', (e) => {
            this.handleFocusIn(e.target);
        });
        
        // Touch device detection for better UX
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }
    
    handleFocusIn(element) {
        // Delegate to extracted class when available
        if (typeof ThemeManagerCore !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            const result = ThemeManagerCore.handleFocusInCore(dependencies, element, {
                scrollBehavior: 'smooth',
                scrollBlock: 'nearest'
            });
            
            if (result.success) {
                return;
            } else {
                dependencies.logError('Failed to handle focus via extracted class:', result.error);
                // Fall through to legacy implementation
            }
        }
        
        // Fallback implementation
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
    
    handleEscape() {
        // Delegate to extracted class when available
        if (typeof ThemeManagerCore !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            const result = ThemeManagerCore.handleEscapeKeyCore(dependencies, {
                escapeContext: 'default'
            });
            
            if (result.success) {
                return;
            } else {
                dependencies.logError('Failed to handle escape key via extracted class:', result.error);
                // Fall through to legacy implementation
            }
        }
        
        // Fallback implementation
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
        }
    }
    
    announceToScreenReader(message) {
        // Delegate to extracted class when available
        if (typeof ThemeManagerUtilities !== 'undefined') {
            const dependencies = ensureThemeManagerDependencies();
            const result = dependencies.announceToScreenReader(message);
            
            if (result.success) {
                return;
            } else {
                dependencies.logError('Failed to announce to screen reader via extracted class:', result.error);
                // Fall through to legacy implementation
            }
        }
        
        // Fallback implementation
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    setTheme(theme) {
        // Delegate to extracted class when available
        if (typeof ThemeManagerValidators !== 'undefined') {
            const validation = ThemeManagerValidators.validateTheme(theme);
            if (!validation.isValid) {
                const dependencies = ensureThemeManagerDependencies();
                dependencies.logError('Invalid theme:', validation.error);
                return;
            }
        } else if (!['light', 'dark', 'high-contrast'].includes(theme)) {
            // Fallback validation
            return;
        }
        
        this.applyTheme(theme);
        this.updateThemeButtons();
    }
}

// Global theme management functions
function setTheme(theme) {
    if (window.themeManager) {
        window.themeManager.setTheme(theme);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});