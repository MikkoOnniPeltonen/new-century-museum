/**
 * Professional Modal System
 * Replaces browser alerts with accessible, customizable modals
 */

class Modal {
    constructor(options = {}) {
        this.defaultOptions = {
            title: 'Confirmation',
            message: '',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            type: 'confirm', // confirm, alert, custom
            showCancel: true,
            closeOnBackdrop: true,
            closeOnEscape: true,
            animation: 'fade', // fade, slide, scale
            icon: null, // success, error, warning, info, question
            customContent: null,
            onConfirm: null,
            onCancel: null,
            onClose: null
        };

        this.options = { ...this.defaultOptions, ...options };
        this.modalElement = null;
        this.isOpen = false;
        this.focusedElementBeforeModal = null;
    }

    /**
     * Create and show the modal
     * @returns {Promise} Resolves with true on confirm, false on cancel
     */
    show() {
        return new Promise((resolve, reject) => {
            this.focusedElementBeforeModal = document.activeElement;

            this.modalElement = this.createModal();
            document.body.appendChild(this.modalElement);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Trigger entrance animation
            setTimeout(() => {
                this.modalElement.classList.add('modal-show');
                this.isOpen = true;
                this.trapFocus();
            }, 10);

            // Set up event listeners
            this.setupEventListeners(resolve);
        });
    }

    /**
     * Create modal DOM structure
     * @private
     */
    createModal() {
        const modal = document.createElement('div');
        modal.className = `modal-overlay modal-${this.options.animation}`;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-describedby', 'modal-description');

        const iconHtml = this.options.icon ? this.getIconHtml(this.options.icon) : '';

        const content = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                ${iconHtml}
                <div class="modal-header">
                    <h2 id="modal-title" class="modal-title">${this.escapeHtml(this.options.title)}</h2>
                    ${this.options.closeOnBackdrop ? '<button class="modal-close-icon" aria-label="Close" type="button">×</button>' : ''}
                </div>
                <div class="modal-body">
                    ${this.options.customContent || `<p id="modal-description" class="modal-message">${this.escapeHtml(this.options.message)}</p>`}
                </div>
                <div class="modal-footer">
                    ${this.options.showCancel ? `<button class="modal-button modal-button-cancel" data-action="cancel" type="button">${this.escapeHtml(this.options.cancelText)}</button>` : ''}
                    <button class="modal-button modal-button-confirm" data-action="confirm" type="button">${this.escapeHtml(this.options.confirmText)}</button>
                </div>
            </div>
        `;

        modal.innerHTML = content;
        return modal;
    }

    /**
     * Get icon HTML based on type
     * @private
     */
    getIconHtml(type) {
        const icons = {
            success: `
                <div class="modal-icon modal-icon-success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            `,
            error: `
                <div class="modal-icon modal-icon-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 6l12 12M6 18L18 6"></path>
                    </svg>
                </div>
            `,
            warning: `
                <div class="modal-icon modal-icon-warning">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 9v4m0 4h.01M4.93 19h14.14a2 2 0 001.73-3L13.73 4.99a2 2 0 00-3.46 0L3.2 16a2 2 0 001.73 3z"></path>
                    </svg>
                </div>
            `,
            info: `
                <div class="modal-icon modal-icon-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4m0-4h.01"></path>
                    </svg>
                </div>
            `,
            question: `
                <div class="modal-icon modal-icon-question">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9 9a3 3 0 016 0c0 2-3 3-3 3m0 4h.01"></path>
                    </svg>
                </div>
            `
        };

        return icons[type] || '';
    }

    /**
     * Set up event listeners
     * @private
     */
    setupEventListeners(resolve) {
        // Confirm button - MUST be added before the content click handler
        const confirmBtn = this.modalElement.querySelector('[data-action="confirm"]');
        console.log('Confirm button found:', confirmBtn);
        if (confirmBtn) {
            confirmBtn.addEventListener('click', (e) => {
                console.log('Confirm button clicked!');
                e.stopPropagation();
                if (this.options.onConfirm) {
                    this.options.onConfirm();
                }
                this.close();
                resolve(true);
            });
        }

        // Cancel button - MUST be added before the content click handler
        const cancelBtn = this.modalElement.querySelector('[data-action="cancel"]');
        console.log('Cancel button found:', cancelBtn);
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                console.log('Cancel button clicked!');
                e.stopPropagation();
                if (this.options.onCancel) {
                    this.options.onCancel();
                }
                this.close();
                resolve(false);
            });
        }

        // Close icon
        const closeIcon = this.modalElement.querySelector('.modal-close-icon');
        if (closeIcon) {
            closeIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.options.onClose) {
                    this.options.onClose();
                }
                this.close();
                resolve(false);
            });
        }

        // Backdrop click - only close when clicking outside modal content
        if (this.options.closeOnBackdrop) {
            this.modalElement.addEventListener('click', (e) => {
                // Only close if clicking directly on the overlay (not on modal content)
                if (e.target === this.modalElement) {
                    if (this.options.onClose) {
                        this.options.onClose();
                    }
                    this.close();
                    resolve(false);
                }
            });
        }

        // Escape key
        if (this.options.closeOnEscape) {
            this.handleEscapeKey = (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    if (this.options.onClose) {
                        this.options.onClose();
                    }
                    this.close();
                    resolve(false);
                }
            };
            document.addEventListener('keydown', this.handleEscapeKey);
        }
    }

    /**
     * Close modal
     */
    close() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.modalElement.classList.remove('modal-show');
        this.modalElement.classList.add('modal-hide');

        // Remove event listeners
        if (this.handleEscapeKey) {
            document.removeEventListener('keydown', this.handleEscapeKey);
        }

        // Restore body scroll
        document.body.style.overflow = '';

        // Remove modal after animation
        setTimeout(() => {
            if (this.modalElement && this.modalElement.parentNode) {
                this.modalElement.parentNode.removeChild(this.modalElement);
            }

            // Restore focus
            if (this.focusedElementBeforeModal) {
                this.focusedElementBeforeModal.focus();
            }
        }, 300);
    }

    /**
     * Trap focus within modal (accessibility)
     * @private
     */
    trapFocus() {
        const focusableElements = this.modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Focus first element
        firstFocusable?.focus();

        this.handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable?.focus();
                }
            }
        };

        this.modalElement.addEventListener('keydown', this.handleTabKey);
    }

    /**
     * Escape HTML
     * @private
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Static convenience methods
     */
    static confirm(message, title = 'Confirm', options = {}) {
        const modal = new Modal({
            title,
            message,
            icon: 'question',
            ...options
        });
        return modal.show();
    }

    static alert(message, title = 'Alert', options = {}) {
        const modal = new Modal({
            title,
            message,
            showCancel: false,
            confirmText: 'OK',
            icon: 'info',
            ...options
        });
        return modal.show();
    }

    static success(message, title = 'Success', options = {}) {
        const modal = new Modal({
            title,
            message,
            showCancel: false,
            confirmText: 'OK',
            icon: 'success',
            ...options
        });
        return modal.show();
    }

    static error(message, title = 'Error', options = {}) {
        const modal = new Modal({
            title,
            message,
            showCancel: false,
            confirmText: 'OK',
            icon: 'error',
            ...options
        });
        return modal.show();
    }

    static warning(message, title = 'Warning', options = {}) {
        const modal = new Modal({
            title,
            message,
            icon: 'warning',
            ...options
        });
        return modal.show();
    }
}

export { Modal };
