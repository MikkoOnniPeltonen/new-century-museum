/**
 * Lazy Loading Utility
 * Optimizes image loading with intersection observer
 */

class LazyLoader {
    constructor(options = {}) {
        this.defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01,
            loadingClass: 'image-loading',
            loadedClass: 'image-loaded',
            errorClass: 'image-error',
            placeholderColor: '#e5e7eb'
        };

        this.options = { ...this.defaultOptions, ...options };
        this.observer = null;
        this.images = new Set();
        this.init();
    }

    /**
     * Initialize Intersection Observer
     */
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    root: this.options.root,
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
        }
    }

    /**
     * Handle intersection changes
     * @private
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    /**
     * Load an image
     * @param {HTMLElement} img - Image element to load
     */
    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        const sizes = img.dataset.sizes;

        if (!src && !srcset) {
            console.warn('No data-src or data-srcset attribute found', img);
            return;
        }

        // Add loading class
        img.classList.add(this.options.loadingClass);

        // Create new image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            this.onImageLoad(img, src, srcset, sizes);
        };

        tempImg.onerror = () => {
            this.onImageError(img);
        };

        // Start loading
        if (srcset) {
            tempImg.srcset = srcset;
            if (sizes) tempImg.sizes = sizes;
        }
        if (src) {
            tempImg.src = src;
        }
    }

    /**
     * Handle successful image load
     * @private
     */
    onImageLoad(img, src, srcset, sizes) {
        // Set actual attributes
        if (src) img.src = src;
        if (srcset) img.srcset = srcset;
        if (sizes) img.sizes = sizes;

        // Update classes
        img.classList.remove(this.options.loadingClass);
        img.classList.add(this.options.loadedClass);

        // Remove data attributes
        delete img.dataset.src;
        delete img.dataset.srcset;
        delete img.dataset.sizes;

        // Dispatch custom event
        img.dispatchEvent(new CustomEvent('lazyloaded', {
            bubbles: true,
            detail: { src, srcset, sizes }
        }));

        this.images.delete(img);
    }

    /**
     * Handle image load error
     * @private
     */
    onImageError(img) {
        img.classList.remove(this.options.loadingClass);
        img.classList.add(this.options.errorClass);

        // Set alt text as fallback
        img.alt = img.alt || 'Image failed to load';

        // Dispatch error event
        img.dispatchEvent(new CustomEvent('lazyloaderror', {
            bubbles: true,
            detail: { src: img.dataset.src }
        }));

        this.images.delete(img);
    }

    /**
     * Observe an image element
     * @param {HTMLElement|NodeList|Array} elements - Image element(s) to observe
     */
    observe(elements) {
        // Convert to array if needed
        const elementsArray = elements instanceof NodeList
            ? Array.from(elements)
            : Array.isArray(elements)
            ? elements
            : [elements];

        elementsArray.forEach(img => {
            if (!(img instanceof HTMLImageElement)) {
                console.warn('Element is not an image', img);
                return;
            }

            this.images.add(img);

            if (this.observer) {
                this.observer.observe(img);
            } else {
                // Fallback: load immediately
                this.loadImage(img);
            }
        });
    }

    /**
     * Unobserve an image element
     * @param {HTMLElement} img - Image element to unobserve
     */
    unobserve(img) {
        if (this.observer) {
            this.observer.unobserve(img);
        }
        this.images.delete(img);
    }

    /**
     * Load all observed images immediately
     */
    loadAllImages() {
        this.images.forEach(img => {
            this.loadImage(img);
        });
    }

    /**
     * Disconnect observer and clean up
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.images.clear();
    }

    /**
     * Auto-discover and observe images with data-src
     * @param {HTMLElement} container - Container to search within
     */
    observeAll(container = document) {
        const images = container.querySelectorAll('img[data-src], img[data-srcset]');
        this.observe(images);
    }
}

/**
 * Background Image Lazy Loader
 * For elements with background images
 */
class BackgroundLazyLoader {
    constructor(options = {}) {
        this.defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01,
            loadingClass: 'bg-loading',
            loadedClass: 'bg-loaded'
        };

        this.options = { ...this.defaultOptions, ...options };
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    root: this.options.root,
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadBackground(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadBackground(element) {
        const bgUrl = element.dataset.bgSrc;
        if (!bgUrl) return;

        element.classList.add(this.options.loadingClass);

        // Preload image
        const img = new Image();
        img.onload = () => {
            element.style.backgroundImage = `url('${bgUrl}')`;
            element.classList.remove(this.options.loadingClass);
            element.classList.add(this.options.loadedClass);
            delete element.dataset.bgSrc;
        };
        img.src = bgUrl;
    }

    observe(elements) {
        const elementsArray = elements instanceof NodeList
            ? Array.from(elements)
            : Array.isArray(elements)
            ? elements
            : [elements];

        if (!this.observer) {
            // Fallback: load immediately
            elementsArray.forEach(el => this.loadBackground(el));
            return;
        }

        elementsArray.forEach(el => {
            this.observer.observe(el);
        });
    }

    observeAll(container = document) {
        const elements = container.querySelectorAll('[data-bg-src]');
        this.observe(elements);
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Create global instances
const lazyLoader = new LazyLoader();
const bgLazyLoader = new BackgroundLazyLoader();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        lazyLoader.observeAll();
        bgLazyLoader.observeAll();
    });
} else {
    lazyLoader.observeAll();
    bgLazyLoader.observeAll();
}

export { LazyLoader, BackgroundLazyLoader, lazyLoader, bgLazyLoader };
