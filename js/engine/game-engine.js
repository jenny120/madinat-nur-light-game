/* ============================================
   MADINAT NUR - LIGHT SOURCES EDUCATIONAL GAME
   Main Game Engine
   ============================================ */

class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gameState = {
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height,
            currentScene: 'intro',
            isPaused: false,
            volume: 1.0
        };

        this.scenes = {};
        this.currentScene = null;
        this.buttons = [];
        this.particles = [];
        this.messages = [];
        this.animationTime = 0;

        // Initialize subsystems
        this.audio = new AudioManager();
        this.graphics = new GraphicsManager();
        this.input = new InputManager(this);

        // Setup event listeners
        this.setupEventListeners();

        // Register all scenes
        this.registerScenes();
    }

    registerScenes() {
        this.scenes = {
            'intro': new Scene0Intro(this),
            'exploration': new Scene1Exploration(this),
            'observation': new Scene2Observation(this),
            'synthesis': new Scene3Synthesis(this),
            'classification': new Scene4Classification(this),
            'application': new Scene5Application(this),
            'celebration': new Scene6Celebration(this)
        };
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check buttons first
            for (let button of this.buttons) {
                if (button.isClicked(x, y)) {
                    button.callback();
                    return;
                }
            }

            // Pass to scene
            if (this.currentScene) {
                this.currentScene.handleClick(x, y);
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.canvas.style.cursor = 'default';
            for (let button of this.buttons) {
                if (button.isClicked(x, y)) {
                    this.canvas.style.cursor = 'pointer';
                    return;
                }
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePause();
            }
        });
    }

    transitionToScene(sceneName) {
        if (!this.scenes[sceneName]) {
            console.error(`Scene ${sceneName} not found`);
            return;
        }

        this.gameState.currentScene = sceneName;
        this.currentScene = this.scenes[sceneName];
        this.clearButtons();
        this.messages = [];
        this.particles = [];
        this.currentScene.init();
    }

    addButton(label, callback, className = 'button-default') {
        this.buttons.push(new Button(label, callback, className, this.gameState.canvasWidth, this.gameState.canvasHeight));
    }

    clearButtons() {
        this.buttons = [];
    }

    addMessage(text, duration = 3000, type = 'info') {
        this.messages.push({
            text,
            duration,
            type,
            startTime: Date.now(),
            alpha: 1.0
        });
    }

    showMessage(text, duration = 3000, type = 'info') {
        this.addMessage(text, duration, type);
    }

    addParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color,
                size: 3 + Math.random() * 3
            });
        }
    }

    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        if (this.gameState.isPaused) {
            this.showMessage('متوقف مؤقتاً', 1000, 'info');
        }
    }

    update(deltaTime) {
        if (this.gameState.isPaused) return;

        // Update current scene
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }

        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 0.02;
            return p.life > 0;
        });

        // Update messages
        this.messages = this.messages.filter(msg => {
            const elapsed = Date.now() - msg.startTime;
            msg.alpha = Math.max(0, 1 - elapsed / msg.duration);
            return msg.alpha > 0;
        });

        this.animationTime += deltaTime;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.gameState.canvasWidth, this.gameState.canvasHeight);

        // Render current scene
        if (this.currentScene) {
            this.currentScene.render(this.ctx);
        }

        // Render particles
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Render messages
        this.messages.forEach((msg, index) => {
            const y = 60 + index * 50;
            this.ctx.save();
            this.ctx.globalAlpha = msg.alpha;
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';

            // Message background
            this.ctx.fillStyle = this.getMessageColor(msg.type);
            this.ctx.fillRect(this.gameState.canvasWidth / 2 - 200, y - 25, 400, 50);

            // Message text
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(msg.text, this.gameState.canvasWidth / 2, y + 5);
            this.ctx.restore();
        });

        // Render buttons
        this.buttons.forEach(button => button.render(this.ctx));

        // Render UI
        this.renderUI();
    }

    renderUI() {
        this.ctx.save();
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = 'rgba(200, 200, 200, 0.7)';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('اضغط Space للإيقاف المؤقت', this.gameState.canvasWidth - 10, this.gameState.canvasHeight - 10);
        this.ctx.restore();
    }

    getMessageColor(type) {
        switch (type) {
            case 'success':
                return 'rgba(76, 175, 80, 0.8)';
            case 'error':
                return 'rgba(244, 67, 54, 0.8)';
            case 'discovery':
                return 'rgba(255, 193, 7, 0.8)';
            default:
                return 'rgba(63, 81, 181, 0.8)';
        }
    }

    start() {
        // Start the first scene
        this.transitionToScene('intro');

        // Start game loop
        const loop = (timestamp) => {
            const deltaTime = 0.016; // 60 FPS
            this.update(deltaTime);
            this.render();
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }
}

// ============================================
// Button Class
// ============================================

class Button {
    constructor(label, callback, className, canvasWidth, canvasHeight) {
        this.label = label;
        this.callback = callback;
        this.className = className;
        this.width = 180;
        this.height = 50;
        this.padding = 15;
        this.isHovering = false;

        // Calculate position based on number of buttons (center at bottom)
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.updatePosition();
    }

    updatePosition() {
        const buttonsCount = document.querySelectorAll('button').length || 1;
        const totalWidth = this.width * buttonsCount + this.padding * (buttonsCount - 1);
        this.x = (this.canvasWidth - totalWidth) / 2 + (this.width + this.padding) * (buttonsCount - 1);
        this.y = this.canvasHeight - 80;
    }

    isClicked(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }

    render(ctx) {
        ctx.save();

        // Button background
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        
        if (this.className.includes('primary')) {
            gradient.addColorStop(0, 'rgba(66, 165, 245, 0.9)');
            gradient.addColorStop(1, 'rgba(33, 150, 243, 0.9)');
        } else if (this.className.includes('success')) {
            gradient.addColorStop(0, 'rgba(102, 187, 106, 0.9)');
            gradient.addColorStop(1, 'rgba(76, 175, 80, 0.9)');
        } else if (this.className.includes('danger')) {
            gradient.addColorStop(0, 'rgba(239, 83, 80, 0.9)');
            gradient.addColorStop(1, 'rgba(244, 67, 54, 0.9)');
        } else {
            gradient.addColorStop(0, 'rgba(158, 158, 158, 0.9)');
            gradient.addColorStop(1, 'rgba(117, 117, 117, 0.9)');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Button border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Button text
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2);

        ctx.restore();
    }
}

// ============================================
// Audio Manager
// ============================================

class AudioManager {
    constructor() {
        this.sounds = {};
        this.initSounds();
    }

    initSounds() {
        // Create simple beep sounds using Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSuccess() {
        this.playBeep(800, 0.1);
    }

    playError() {
        this.playBeep(300, 0.1);
    }

    playDiscovery() {
        this.playBeep(600, 0.05);
    }

    playLightOn() {
        this.playBeep(1000, 0.08);
    }

    playVictory() {
        // Play a victory fanfare
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playBeep(freq, 0.1), i * 200);
        });
    }

    playBeep(frequency, duration) {
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            // Audio context not available
        }
    }
}

// ============================================
// Graphics Manager
// ============================================

class GraphicsManager {
    drawCharacter(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        // Head
        ctx.fillStyle = '#F4A460';
        ctx.beginPath();
        ctx.arc(0, -30, 20, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(-8, -35, 4, 4);
        ctx.fillRect(4, -35, 4, 4);

        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -28, 8, 0, Math.PI);
        ctx.stroke();

        // Body
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(-15, -10, 30, 30);

        // Arms
        ctx.fillRect(-20, -5, 40, 8);

        // Legs
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(-8, 20, 6, 15);
        ctx.fillRect(2, 20, 6, 15);

        ctx.restore();
    }

    drawLightBulb(ctx, x, y, isLit) {
        ctx.save();
        ctx.translate(x, y);

        // Bulb glass
        if (isLit) {
            const glow = ctx.createRadialGradient(0, -5, 0, 0, -5, 20);
            glow.addColorStop(0, 'rgba(255, 255, 150, 0.8)');
            glow.addColorStop(1, 'rgba(255, 200, 0, 0.3)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, -5, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = isLit ? '#FFD700' : '#CCC';
        ctx.beginPath();
        ctx.arc(0, -5, 15, 0, Math.PI * 2);
        ctx.fill();

        // Base
        ctx.fillStyle = '#333';
        ctx.fillRect(-5, 10, 10, 8);
        ctx.fillRect(-3, 18, 6, 3);

        ctx.restore();
    }
}

// ============================================
// Input Manager
// ============================================

class InputManager {
    constructor(engine) {
        this.engine = engine;
    }
}

// ============================================
// Base Scene Class
// ============================================

class Scene {
    constructor(engine) {
        this.engine = engine;
        this.animationTime = 0;
    }

    init() {
        // Override in subclasses
    }

    update(deltaTime) {
        this.animationTime += deltaTime;
    }

    render(ctx) {
        // Override in subclasses
    }

    handleClick(x, y) {
        // Override in subclasses
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
}

// ============================================
// Initialize Game
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine('gameCanvas');
    game.start();
});
