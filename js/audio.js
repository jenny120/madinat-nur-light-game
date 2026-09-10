/* ============================================
   Audio System - Web Audio API
   Lightweight sound effects and ambience
   ============================================ */

class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.ambience = null;
        this.isInitialized = false;
    }

    /**
     * Initialize Web Audio API
     */
    init() {
        if (this.isInitialized) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            console.warn('Web Audio API not supported');
            return false;
        }

        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = 0.3; // Moderate volume
        this.isInitialized = true;
        return true;
    }

    /**
     * Play discovery/success sound
     */
    playDiscovery() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const env = this.audioContext.createGain();

        osc.connect(env);
        env.connect(this.masterGain);

        // Ascending tone
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.2); // C6

        env.gain.setValueAtTime(0.3, now);
        env.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Play light activation sound
     */
    playLightOn() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const env = this.audioContext.createGain();

        osc.connect(env);
        env.connect(this.masterGain);

        // Bright activation tone
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

        env.gain.setValueAtTime(0.2, now);
        env.gain.exponentialRampToValueAtTime(0.05, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    /**
     * Play success/correct answer sound
     */
    playSuccess() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const env = this.audioContext.createGain();

            osc.connect(env);
            env.connect(this.masterGain);

            osc.frequency.value = freq;
            env.gain.setValueAtTime(0.2, now + i * 0.1);
            env.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
        });
    }

    /**
     * Play incorrect/error sound
     */
    playError() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const env = this.audioContext.createGain();

        osc.connect(env);
        env.connect(this.masterGain);

        // Descending tone
        osc.frequency.setValueAtTime(349.23, now); // F4
        osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.15); // C4

        env.gain.setValueAtTime(0.15, now);
        env.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    /**
     * Play click sound for UI interaction
     */
    playClick() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const env = this.audioContext.createGain();

        osc.connect(env);
        env.connect(this.masterGain);

        osc.frequency.value = 800;
        env.gain.setValueAtTime(0.1, now);
        env.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    /**
     * Play candle light sound
     */
    playCandle() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const env = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.connect(filter);
        filter.connect(env);
        env.connect(this.masterGain);

        filter.type = 'highpass';
        filter.frequency.value = 2000;

        osc.frequency.value = 600;
        env.gain.setValueAtTime(0.15, now);
        env.gain.exponentialRampToValueAtTime(0.05, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    /**
     * Play magical transformation sound
     */
    playMagic() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        const frequencies = [440, 550, 660, 770, 880];

        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const env = this.audioContext.createGain();

            osc.connect(env);
            env.connect(this.masterGain);

            osc.frequency.value = freq;
            env.gain.setValueAtTime(0, now + i * 0.08);
            env.gain.setValueAtTime(0.15, now + i * 0.08 + 0.01);
            env.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);

            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.3);
        });
    }

    /**
     * Play celebration sound (festival finale)
     */
    playCelebration() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        const notes = [
            { freq: 523.25, time: 0 },      // C5
            { freq: 659.25, time: 0.15 },   // E5
            { freq: 783.99, time: 0.3 },    // G5
            { freq: 1046.5, time: 0.45 },   // C6
        ];

        notes.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const env = this.audioContext.createGain();

            osc.connect(env);
            env.connect(this.masterGain);

            osc.frequency.value = note.freq;
            env.gain.setValueAtTime(0.25, now + note.time);
            env.gain.exponentialRampToValueAtTime(0.05, now + note.time + 0.25);

            osc.start(now + note.time);
            osc.stop(now + note.time + 0.25);
        });
    }

    /**
     * Play ambient background loop (soft hum)
     */
    playAmbience() {
        if (!this.isInitialized || this.ambience) return;

        const osc = this.audioContext.createOscillator();
        const env = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.connect(filter);
        filter.connect(env);
        env.connect(this.masterGain);

        filter.type = 'lowpass';
        filter.frequency.value = 200;

        osc.frequency.value = 110; // A2 - deep, subtle
        env.gain.value = 0.05;

        osc.start();
        this.ambience = { osc, env };
    }

    /**
     * Stop ambient sound
     */
    stopAmbience() {
        if (!this.ambience) return;

        const now = this.audioContext.currentTime;
        this.ambience.env.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        this.ambience.osc.stop(now + 0.5);
        this.ambience = null;
    }

    /**
     * Set master volume
     */
    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    }

    /**
     * Resume audio context (required by browser autoplay policy)
     */
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioSystem;
}
