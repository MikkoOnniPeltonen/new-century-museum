/**
 * Professional Toast Notification System
 * Provides elegant, accessible notifications with various types and positions
 */

class ToastNotification {
    constructor(options = {}) {
        this.defaultOptions = {
            duration: 3000,
            position: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
            maxToasts: 3,
            pauseOnHover: true,
            closeButton: true,
            progressBar: true,
            animation: 'slide' // slide, fade, bounce
        };

        this.options = { ...this.defaultOptions, ...options };
        this.toasts = [];
        this.container = null;
        this.init();
    }

    /**
     * Initialize toast container
     */
    init() {
        // Check if container already exists
        if (document.getElementById('toast-container')) {
            this.container = document.getElementById('toast-container');
            return;
        }

        // Create container
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = `toast-container toast-${this.options.position}`;
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Notifications');
        this.container.setAttribute('aria-live', 'polite');

        document.body.appendChild(this.container);
    }

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - Type of toast (success, error, warning, info)
     * @param {Object} customOptions - Override default options
     * @returns {HTMLElement} The toast element
     */
    show(message, type = 'info', customOptions = {}) {
        const toastOptions = { ...this.options, ...customOptions };

        // Limit number of toasts
        if (this.toasts.length >= toastOptions.maxToasts) {
            this.dismiss(this.toasts[0].element);
        }

        // Create toast element
        const toast = this.createToast(message, type, toastOptions);

        // Add to DOM
        this.container.appendChild(toast.element);
        this.toasts.push(toast);

        // Trigger entrance animation
        setTimeout(() => {
            toast.element.classList.add('toast-show');
        }, 10);

        // Auto dismiss
        if (toastOptions.duration > 0) {
            toast.timer = setTimeout(() => {
                this.dismiss(toast.element);
            }, toastOptions.duration);
        }

        // Progress bar animation
        if (toastOptions.progressBar && toastOptions.duration > 0) {
            const progressBar = toast.element.querySelector('.toast-progress');
            if (progressBar) {
                progressBar.style.transitionDuration = `${toastOptions.duration}ms`;
                setTimeout(() => {
                    progressBar.style.width = '0%';
                }, 10);
            }
        }

        // Pause on hover
        if (toastOptions.pauseOnHover) {
            toast.element.addEventListener('mouseenter', () => {
                if (toast.timer) {
                    clearTimeout(toast.timer);
                    const progressBar = toast.element.querySelector('.toast-progress');
                    if (progressBar) {
                        progressBar.style.animationPlayState = 'paused';
                    }
                }
            });

            toast.element.addEventListener('mouseleave', () => {
                const progressBar = toast.element.querySelector('.toast-progress');
                if (progressBar) {
                    progressBar.style.animationPlayState = 'running';
                }
                if (toastOptions.duration > 0) {
                    toast.timer = setTimeout(() => {
                        this.dismiss(toast.element);
                    }, 1000); // Give 1 second before dismissing after hover
                }
            });
        }

        return toast.element;
    }

    /**
     * Create toast element
     * @private
     */
    createToast(message, type, options) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} toast-${options.animation}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

        // Icon based on type
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        // Build toast content
        let content = `
            <div class="toast-content">
                <div class="toast-icon">
                    <span aria-hidden="true">${icons[type] || icons.info}</span>
                </div>
                <div class="toast-message">${this.escapeHtml(message)}</div>
        `;

        if (options.closeButton) {
            content += `
                <button class="toast-close" aria-label="Close notification" type="button">
                    <span aria-hidden="true">×</span>
                </button>
            `;
        }

        content += '</div>';

        if (options.progressBar) {
            content += '<div class="toast-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>';
        }

        toast.innerHTML = content;

        // Close button handler
        if (options.closeButton) {
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => {
                this.dismiss(toast);
            });
        }

        return { element: toast, timer: null };
    }

    /**
     * Dismiss a toast
     * @param {HTMLElement} toastElement - The toast element to dismiss
     */
    dismiss(toastElement) {
        if (!toastElement || !toastElement.parentNode) return;

        // Find toast in array
        const index = this.toasts.findIndex(t => t.element === toastElement);
        if (index !== -1) {
            const toast = this.toasts[index];
            if (toast.timer) {
                clearTimeout(toast.timer);
            }
            this.toasts.splice(index, 1);
        }

        // Exit animation
        toastElement.classList.remove('toast-show');
        toastElement.classList.add('toast-hide');

        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 300);
    }

    /**
     * Dismiss all toasts
     */
    dismissAll() {
        this.toasts.forEach(toast => {
            this.dismiss(toast.element);
        });
    }

    /**
     * Convenience methods for different toast types
     */
    success(message, options) {
        return this.show(message, 'success', options);
    }

    error(message, options) {
        return this.show(message, 'error', options);
    }

    warning(message, options) {
        return this.show(message, 'warning', options);
    }

    info(message, options) {
        return this.show(message, 'info', options);
    }

    /**
     * Escape HTML to prevent XSS
     * @private
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Update toast position
     */
    setPosition(position) {
        this.options.position = position;
        if (this.container) {
            this.container.className = `toast-container toast-${position}`;
        }
    }
}

// Create global instance
const toast = new ToastNotification();

// Export both class and instance
export { ToastNotification, toast };
