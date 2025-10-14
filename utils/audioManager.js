/**
 * Audio Manager
 * Manages century-specific soundscapes and audio playback
 * Provides immersive ambient music for each historical period
 */

class AudioManager {
    constructor(options = {}) {
        this.defaultOptions = {
            volume: 0.3,
            fadeInDuration: 2000,
            fadeOutDuration: 1500,
            crossfadeDuration: 2000,
            autoplay: false,
            loop: true,
            respectAutoplayPolicy: true
        };

        this.options = { ...this.defaultOptions, ...options };
        this.currentAudio = null;
        this.currentCentury = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.volumeBeforeMute = this.options.volume;
        this.audioCache = new Map();
        this.fadeInterval = null;

        // Century-specific audio sources
        // Note: These paths should be updated with actual audio file locations
        this.centurySounds = {
            '1600s': {
                url: './audio/baroque-ambient.mp3',
                description: 'Baroque period - Harpsichord and strings',
                fallback: './audio/classical-generic.mp3'
            },
            '1700s': {
                url: './audio/classical-ambient.mp3',
                description: 'Classical period - Chamber music',
                fallback: './audio/classical-generic.mp3'
            },
            '1800s': {
                url: './audio/romantic-ambient.mp3',
                description: 'Romantic period - Orchestral themes',
                fallback: './audio/classical-generic.mp3'
            },
            '1900s': {
                url: './audio/modern-ambient.mp3',
                description: 'Modern period - Contemporary sounds',
                fallback: './audio/classical-generic.mp3'
            }
        };

        // Load user preferences
        this.loadPreferences();

        // Initialize audio context (for Web Audio API support)
        this.initAudioContext();
    }

    /**
     * Initialize Web Audio API context
     * @private
     */
    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.audioContext = null;
        }
    }

    /**
     * Load user preferences from localStorage
     * @private
     */
    loadPreferences() {
        try {
            const prefs = localStorage.getItem('museum_audio_preferences');
            if (prefs) {
                const { volume, isMuted } = JSON.parse(prefs);
                if (volume !== undefined) this.options.volume = volume;
                if (isMuted !== undefined) this.isMuted = isMuted;
            }
        } catch (e) {
            console.warn('Failed to load audio preferences:', e);
        }
    }

    /**
     * Save user preferences to localStorage
     * @private
     */
    savePreferences() {
        try {
            localStorage.setItem('museum_audio_preferences', JSON.stringify({
                volume: this.options.volume,
                isMuted: this.isMuted
            }));
        } catch (e) {
            console.warn('Failed to save audio preferences:', e);
        }
    }

    /**
     * Create or retrieve cached audio element
     * @private
     */
    async getAudioElement(century) {
        // Check cache first
        if (this.audioCache.has(century)) {
            return this.audioCache.get(century);
        }

        const soundConfig = this.centurySounds[century];
        if (!soundConfig) {
            console.warn(`No audio configured for century: ${century}`);
            return null;
        }

        const audio = new Audio();
        audio.loop = this.options.loop;
        audio.volume = 0; // Start at 0 for fade-in
        audio.preload = 'auto';

        // Try main URL, fallback if it fails
        try {
            audio.src = soundConfig.url;
            await this.loadAudio(audio);
        } catch (e) {
            console.warn(`Failed to load ${soundConfig.url}, trying fallback`);
            try {
                audio.src = soundConfig.fallback;
                await this.loadAudio(audio);
            } catch (fallbackError) {
                console.error('Failed to load audio:', fallbackError);
                return null;
            }
        }

        // Cache the audio element
        this.audioCache.set(century, audio);
        return audio;
    }

    /**
     * Load audio with promise
     * @private
     */
    loadAudio(audio) {
        return new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
            audio.addEventListener('error', reject, { once: true });
            audio.load();
        });
    }

    /**
     * Play audio for a specific century
     * @param {string} century - Century to play (e.g., "1600s")
     * @param {Object} options - Override options
     */
    async play(century, options = {}) {
        const playOptions = { ...this.options, ...options };

        // Check if already playing this century
        if (this.currentCentury === century && this.isPlaying) {
            return;
        }

        // Resume AudioContext if suspended (required by some browsers)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (e) {
                console.warn('Failed to resume audio context:', e);
            }
        }

        try {
            const newAudio = await this.getAudioElement(century);
            if (!newAudio) {
                throw new Error(`Failed to load audio for ${century}`);
            }

            // Crossfade if currently playing
            if (this.currentAudio && this.isPlaying) {
                await this.crossfade(this.currentAudio, newAudio, playOptions.crossfadeDuration);
            } else {
                // Simple fade in
                await this.fadeIn(newAudio, playOptions.fadeInDuration);
            }

            this.currentAudio = newAudio;
            this.currentCentury = century;
            this.isPlaying = true;

            // Apply mute state if needed
            if (this.isMuted) {
                this.currentAudio.volume = 0;
            }

            // Dispatch event
            this.dispatchEvent('audioplay', { century });

        } catch (error) {
            console.error('Audio playback failed:', error);
            this.dispatchEvent('audioerror', { century, error });
        }
    }

    /**
     * Stop current audio
     */
    async stop() {
        if (!this.currentAudio || !this.isPlaying) return;

        await this.fadeOut(this.currentAudio, this.options.fadeOutDuration);
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.isPlaying = false;
        this.currentCentury = null;

        this.dispatchEvent('audiostop');
    }

    /**
     * Pause current audio
     */
    async pause() {
        if (!this.currentAudio || !this.isPlaying) return;

        await this.fadeOut(this.currentAudio, this.options.fadeOutDuration);
        this.currentAudio.pause();
        this.isPlaying = false;

        this.dispatchEvent('audiopause');
    }

    /**
     * Resume paused audio
     */
    async resume() {
        if (!this.currentAudio || this.isPlaying) return;

        await this.fadeIn(this.currentAudio, this.options.fadeInDuration);
        this.isPlaying = true;

        this.dispatchEvent('audioresume');
    }

    /**
     * Toggle play/pause
     */
    async toggle() {
        if (this.isPlaying) {
            await this.pause();
        } else if (this.currentAudio) {
            await this.resume();
        }
    }

    /**
     * Mute audio
     */
    mute() {
        if (this.isMuted) return;

        this.isMuted = true;
        if (this.currentAudio) {
            this.volumeBeforeMute = this.currentAudio.volume;
            this.currentAudio.volume = 0;
        }
        this.savePreferences();
        this.dispatchEvent('audiomute');
    }

    /**
     * Unmute audio
     */
    unmute() {
        if (!this.isMuted) return;

        this.isMuted = false;
        if (this.currentAudio) {
            this.currentAudio.volume = this.volumeBeforeMute;
        }
        this.savePreferences();
        this.dispatchEvent('audiounmute');
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    /**
     * Set volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
        this.options.volume = volume;

        if (this.currentAudio && !this.isMuted) {
            this.currentAudio.volume = volume;
        }

        this.savePreferences();
        this.dispatchEvent('volumechange', { volume });
    }

    /**
     * Get current volume
     * @returns {number} Current volume (0-1)
     */
    getVolume() {
        return this.options.volume;
    }

    /**
     * Fade in audio
     * @private
     */
    fadeIn(audio, duration) {
        return new Promise((resolve) => {
            const targetVolume = this.isMuted ? 0 : this.options.volume;
            audio.volume = 0;

            audio.play().catch(e => {
                console.warn('Playback failed (possibly blocked by browser):', e);
            });

            const steps = 50;
            const stepDuration = duration / steps;
            const volumeStep = targetVolume / steps;
            let currentStep = 0;

            this.fadeInterval = setInterval(() => {
                currentStep++;
                audio.volume = Math.min(volumeStep * currentStep, targetVolume);

                if (currentStep >= steps) {
                    clearInterval(this.fadeInterval);
                    resolve();
                }
            }, stepDuration);
        });
    }

    /**
     * Fade out audio
     * @private
     */
    fadeOut(audio, duration) {
        return new Promise((resolve) => {
            const startVolume = audio.volume;
            const steps = 50;
            const stepDuration = duration / steps;
            const volumeStep = startVolume / steps;
            let currentStep = 0;

            this.fadeInterval = setInterval(() => {
                currentStep++;
                audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);

                if (currentStep >= steps) {
                    clearInterval(this.fadeInterval);
                    resolve();
                }
            }, stepDuration);
        });
    }

    /**
     * Crossfade between two audio tracks
     * @private
     */
    async crossfade(oldAudio, newAudio, duration) {
        const fadeOutPromise = this.fadeOut(oldAudio, duration);
        const fadeInPromise = this.fadeIn(newAudio, duration);

        await Promise.all([fadeOutPromise, fadeInPromise]);

        oldAudio.pause();
        oldAudio.currentTime = 0;
    }

    /**
     * Dispatch custom event
     * @private
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`audioManager:${eventName}`, {
            bubbles: true,
            detail
        });
        document.dispatchEvent(event);
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }
        this.audioCache.forEach(audio => {
            audio.pause();
            audio.src = '';
        });
        this.audioCache.clear();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }

    /**
     * Get current playback state
     * @returns {Object} Current state
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            isMuted: this.isMuted,
            volume: this.options.volume,
            currentCentury: this.currentCentury
        };
    }
}

// Create global instance
const audioManager = new AudioManager();

export { AudioManager, audioManager };
