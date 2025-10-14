/**
 * Audio Controls Component
 * UI controls for the audio manager
 */

class AudioControls {
    constructor(audioManager, options = {}) {
        this.audioManager = audioManager;
        this.defaultOptions = {
            position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
            showCenturyLabel: true,
            compact: false,
            theme: 'dark' // dark, light
        };

        this.options = { ...this.defaultOptions, ...options };
        this.container = null;
        this.isMinimized = false;

        this.init();
        this.attachEventListeners();
    }

    /**
     * Initialize the controls UI
     */
    init() {
        // Check if already exists
        if (document.getElementById('audio-controls')) {
            this.container = document.getElementById('audio-controls');
            return;
        }

        this.container = this.createControls();
        document.body.appendChild(this.container);

        // Update UI based on current state
        this.updateUI();
    }

    /**
     * Create controls DOM structure
     * @private
     */
    createControls() {
        const controls = document.createElement('div');
        controls.id = 'audio-controls';
        controls.className = `audio-controls audio-controls-${this.options.position} audio-controls-${this.options.theme}`;
        controls.setAttribute('role', 'region');
        controls.setAttribute('aria-label', 'Audio controls');

        const content = `
            <div class="audio-controls-content">
                ${this.options.showCenturyLabel ? '<div class="audio-century-label">No audio playing</div>' : ''}

                <div class="audio-controls-buttons">
                    <button class="audio-control-btn audio-play-btn"
                            aria-label="Play audio"
                            type="button"
                            title="Play/Pause">
                        <svg class="audio-icon audio-play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="audio-icon audio-pause-icon" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    </button>

                    <button class="audio-control-btn audio-mute-btn"
                            aria-label="Mute audio"
                            type="button"
                            title="Mute/Unmute">
                        <svg class="audio-icon audio-volume-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                        </svg>
                        <svg class="audio-icon audio-mute-icon" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                    </button>

                    <div class="audio-volume-container">
                        <input type="range"
                               class="audio-volume-slider"
                               min="0"
                               max="100"
                               value="30"
                               aria-label="Volume"
                               title="Volume">
                        <div class="audio-volume-value">30%</div>
                    </div>
                </div>

                <button class="audio-minimize-btn"
                        aria-label="Minimize controls"
                        type="button"
                        title="Minimize">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M19 13H5v-2h14v2z"/>
                    </svg>
                </button>
            </div>
        `;

        controls.innerHTML = content;
        return controls;
    }

    /**
     * Attach event listeners
     * @private
     */
    attachEventListeners() {
        // Play/Pause button
        const playBtn = this.container.querySelector('.audio-play-btn');
        playBtn.addEventListener('click', () => {
            this.audioManager.toggle();
        });

        // Mute button
        const muteBtn = this.container.querySelector('.audio-mute-btn');
        muteBtn.addEventListener('click', () => {
            this.audioManager.toggleMute();
        });

        // Volume slider
        const volumeSlider = this.container.querySelector('.audio-volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value) / 100;
            this.audioManager.setVolume(volume);
        });

        // Minimize button
        const minimizeBtn = this.container.querySelector('.audio-minimize-btn');
        minimizeBtn.addEventListener('click', () => {
            this.toggleMinimize();
        });

        // Listen to audio manager events
        document.addEventListener('audioManager:audioplay', () => this.updateUI());
        document.addEventListener('audioManager:audiopause', () => this.updateUI());
        document.addEventListener('audioManager:audioresume', () => this.updateUI());
        document.addEventListener('audioManager:audiostop', () => this.updateUI());
        document.addEventListener('audioManager:audiomute', () => this.updateUI());
        document.addEventListener('audioManager:audiounmute', () => this.updateUI());
        document.addEventListener('audioManager:volumechange', () => this.updateUI());
    }

    /**
     * Update UI based on current state
     */
    updateUI() {
        const state = this.audioManager.getState();

        // Update play/pause icons
        const playIcon = this.container.querySelector('.audio-play-icon');
        const pauseIcon = this.container.querySelector('.audio-pause-icon');
        if (state.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }

        // Update mute icons
        const volumeIcon = this.container.querySelector('.audio-volume-icon');
        const muteIcon = this.container.querySelector('.audio-mute-icon');
        if (state.isMuted) {
            volumeIcon.style.display = 'none';
            muteIcon.style.display = 'block';
        } else {
            volumeIcon.style.display = 'block';
            muteIcon.style.display = 'none';
        }

        // Update volume slider
        const volumeSlider = this.container.querySelector('.audio-volume-slider');
        const volumeValue = this.container.querySelector('.audio-volume-value');
        const volumePercent = Math.round(state.volume * 100);
        volumeSlider.value = volumePercent;
        volumeValue.textContent = `${volumePercent}%`;

        // Update century label
        if (this.options.showCenturyLabel) {
            const label = this.container.querySelector('.audio-century-label');
            if (state.currentCentury) {
                const centuryNum = parseInt(state.currentCentury.slice(0, 2));
                label.textContent = `${centuryNum + 1}th Century Soundscape`;
            } else {
                label.textContent = 'No audio playing';
            }
        }
    }

    /**
     * Toggle minimize state
     */
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.container.classList.toggle('audio-controls-minimized', this.isMinimized);

        const minimizeBtn = this.container.querySelector('.audio-minimize-btn');
        const svg = minimizeBtn.querySelector('svg');

        if (this.isMinimized) {
            svg.innerHTML = '<path d="M19 13H5v-2h14v2z"/>';
            minimizeBtn.setAttribute('aria-label', 'Expand controls');
            minimizeBtn.setAttribute('title', 'Expand');
        } else {
            svg.innerHTML = '<path d="M7 11h10v2H7z"/>';
            minimizeBtn.setAttribute('aria-label', 'Minimize controls');
            minimizeBtn.setAttribute('title', 'Minimize');
        }
    }

    /**
     * Show controls
     */
    show() {
        this.container.style.display = 'block';
        setTimeout(() => {
            this.container.classList.add('audio-controls-visible');
        }, 10);
    }

    /**
     * Hide controls
     */
    hide() {
        this.container.classList.remove('audio-controls-visible');
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 300);
    }

    /**
     * Destroy controls
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export { AudioControls };
