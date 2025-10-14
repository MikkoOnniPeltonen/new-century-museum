/**
 * Accessibility Enhancement Utility
 * Improves keyboard navigation, ARIA labels, and screen reader support
 */

class AccessibilityHelper {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
        this.skipLinksAdded = false;
    }

    /**
     * Initialize accessibility enhancements
     */
    init() {
        this.addSkipLinks();
        this.enhanceFocusManagement();
        this.addKeyboardShortcuts();
        this.announcePageLoad();
        this.enhanceButtons();
        this.enhanceLinks();
        this.enhanceImages();
        this.addLandmarkRoles();
    }

    /**
     * Add skip navigation links
     */
    addSkipLinks() {
        if (this.skipLinksAdded) return;

        const skipNav = document.createElement('div');
        skipNav.className = 'skip-navigation';
        skipNav.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;

        document.body.insertBefore(skipNav, document.body.firstChild);
        this.skipLinksAdded = true;
    }

    /**
     * Enhance focus management
     */
    enhanceFocusManagement() {
        // Add visible focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('user-is-tabbing');
        });

        // Track focusable elements
        this.updateFocusableElements();

        // Re-scan on DOM changes
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Update list of focusable elements
     * @private
     */
    updateFocusableElements() {
        const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
        this.focusableElements = Array.from(document.querySelectorAll(selector));
    }

    /**
     * Add keyboard shortcuts
     */
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt+H: Go to home
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                window.location.href = '../index.html';
                this.announce('Navigating to home page');
            }

            // Alt+M: Toggle audio mute (if audio controls exist)
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                const muteBtn = document.querySelector('.audio-mute-btn');
                if (muteBtn) {
                    muteBtn.click();
                    this.announce('Audio toggled');
                }
            }

            // Escape: Close modals/overlays
            if (e.key === 'Escape') {
                this.closeTopMostOverlay();
            }

            // Question mark: Show keyboard shortcuts help
            if (e.key === '?' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.showKeyboardHelp();
            }
        });
    }

    /**
     * Close top-most overlay/modal
     * @private
     */
    closeTopMostOverlay() {
        // Close modal if open
        const modal = document.querySelector('.modal-overlay.modal-show');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close-icon, [data-action="cancel"]');
            if (closeBtn) closeBtn.click();
            return;
        }

        // Close audio controls if minimized
        const audioControls = document.querySelector('.audio-controls');
        if (audioControls && !audioControls.classList.contains('audio-controls-minimized')) {
            const minimizeBtn = audioControls.querySelector('.audio-minimize-btn');
            if (minimizeBtn) minimizeBtn.click();
        }
    }

    /**
     * Show keyboard shortcuts help dialog
     */
    showKeyboardHelp() {
        const helpContent = `
            <div class="keyboard-help">
                <h3>Keyboard Shortcuts</h3>
                <dl>
                    <dt>Tab</dt>
                    <dd>Navigate forward through interactive elements</dd>

                    <dt>Shift + Tab</dt>
                    <dd>Navigate backward through interactive elements</dd>

                    <dt>Enter or Space</dt>
                    <dd>Activate buttons and links</dd>

                    <dt>Escape</dt>
                    <dd>Close modals and overlays</dd>

                    <dt>Alt + H</dt>
                    <dd>Go to home page</dd>

                    <dt>Alt + M</dt>
                    <dd>Toggle audio mute</dd>

                    <dt>?</dt>
                    <dd>Show this help dialog</dd>
                </dl>
            </div>
        `;

        // Use Modal if available, otherwise alert
        if (typeof Modal !== 'undefined') {
            new Modal({
                title: 'Keyboard Shortcuts',
                customContent: helpContent,
                showCancel: false,
                confirmText: 'Close'
            }).show();
        } else {
            this.announce('Keyboard shortcuts available. Press Tab to navigate, Enter to select, Escape to close.');
        }
    }

    /**
     * Announce page load to screen readers
     */
    announcePageLoad() {
        const pageTitle = document.title;
        const mainHeading = document.querySelector('h1');

        if (mainHeading) {
            this.announce(`${pageTitle}. ${mainHeading.textContent}`);
        } else {
            this.announce(pageTitle);
        }
    }

    /**
     * Enhance buttons with proper ARIA labels
     */
    enhanceButtons() {
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');

        buttons.forEach(button => {
            // Skip if button has text content
            if (button.textContent.trim()) return;

            // Try to infer label from context
            const title = button.getAttribute('title');
            const className = button.className;

            if (title) {
                button.setAttribute('aria-label', title);
            } else if (className.includes('close')) {
                button.setAttribute('aria-label', 'Close');
            } else if (className.includes('play')) {
                button.setAttribute('aria-label', 'Play');
            } else if (className.includes('pause')) {
                button.setAttribute('aria-label', 'Pause');
            } else if (className.includes('mute')) {
                button.setAttribute('aria-label', 'Mute');
            } else {
                console.warn('Button without accessible label:', button);
            }
        });
    }

    /**
     * Enhance links with proper descriptions
     */
    enhanceLinks() {
        const links = document.querySelectorAll('a:not([aria-label])');

        links.forEach(link => {
            // Skip if link has text content
            if (link.textContent.trim()) return;

            // Check for images inside link
            const img = link.querySelector('img');
            if (img && img.alt) {
                link.setAttribute('aria-label', img.alt);
            }

            // Add external link indicators
            if (link.hostname !== window.location.hostname) {
                const currentLabel = link.getAttribute('aria-label') || link.textContent;
                link.setAttribute('aria-label', `${currentLabel} (opens in new window)`);

                if (link.target === '_blank') {
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            }
        });
    }

    /**
     * Enhance images with alt text validation
     */
    enhanceImages() {
        const images = document.querySelectorAll('img:not([alt])');

        images.forEach(img => {
            console.warn('Image missing alt text:', img.src);
            // Add empty alt for decorative images
            img.setAttribute('alt', '');
        });

        // Check for meaningful alt text
        const imagesWithAlt = document.querySelectorAll('img[alt]');
        imagesWithAlt.forEach(img => {
            const alt = img.alt.toLowerCase();
            if (alt.includes('image') || alt.includes('picture') || alt.includes('photo')) {
                console.warn('Alt text contains redundant words:', img.alt);
            }
        });
    }

    /**
     * Add ARIA landmark roles
     */
    addLandmarkRoles() {
        // Main content
        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        } else {
            // Add ID for skip link
            const mainSection = document.querySelector('#main-section, section');
            if (mainSection && !mainSection.id) {
                mainSection.id = 'main-content';
            }
        }

        // Navigation
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
            if (!nav.getAttribute('aria-label')) {
                nav.setAttribute('aria-label', 'Main navigation');
            }
        }

        // Header
        const header = document.querySelector('header');
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }

        // Footer
        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
        let announcer = document.getElementById('a11y-announcer');

        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'a11y-announcer';
            announcer.className = 'visually-hidden';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', priority);
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }

        // Clear previous announcement
        announcer.textContent = '';

        // Set new announcement after a brief delay (for screen reader recognition)
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * Focus trap for modals/overlays
     * @param {HTMLElement} container - Container to trap focus within
     * @returns {Function} Cleanup function
     */
    trapFocus(container) {
        const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusableElements = container.querySelectorAll(focusableSelector);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        const handleTab = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTab);

        // Focus first element
        firstFocusable?.focus();

        // Return cleanup function
        return () => {
            container.removeEventListener('keydown', handleTab);
        };
    }

    /**
     * Ensure proper heading hierarchy
     */
    validateHeadingHierarchy() {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let previousLevel = 0;

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName[1]);

            if (index === 0 && level !== 1) {
                console.warn('First heading should be h1:', heading);
            }

            if (level > previousLevel + 1) {
                console.warn(`Heading hierarchy skipped from h${previousLevel} to h${level}:`, heading);
            }

            previousLevel = level;
        });
    }
}

// Create global instance
const a11y = new AccessibilityHelper();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        a11y.init();
    });
} else {
    a11y.init();
}

export { AccessibilityHelper, a11y };
