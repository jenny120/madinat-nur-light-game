/* ============================================
   Game Engine - Core Logic & State Management
   ============================================ */

class GameEngine {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
        this.gameState = {
            discoveredLights: [],
            currentScene: 'arrival',
            canvasWidth: 1200,
            canvasHeight: 700,
            isAnimating: false,
            particles: [],
        };
        this.canvas = null;
        this.ctx = null;
        this.graphics = new Graphics();
        this.audio = new AudioSystem();
        this.animationId = null;
        this.lastFrameTime = Date.now();
        this.deltaTime = 0;
    }

    /**
     * Initialize the game engine
     */
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.gameState.canvasWidth;
        this.canvas.height = this.gameState.canvasHeight;
        this.ctx = this.canvas.getContext('2d');

        // Append to scene manager
        const sceneManager = document.getElementById('scene-manager');
        sceneManager.appendChild(this.canvas);

        // Initialize audio
        this.audio.init();

        // Register all scenes
        this.registerScene('arrival', new Scene1Arrival(this));
        this.registerScene('discovery', new Scene2Discovery(this));
        this.registerScene('synthesis', new Scene3Synthesis(this));
        this.registerScene('classification', new Scene4Classification(this));
        this.registerScene('festival', new Scene5Festival(this));

        // Start game loop
        this.start();

        // Bind input events
        this.setupInputHandlers();
    }

    /**
     * Register a scene
     */
    registerScene(name, scene) {
        this.scenes[name] = scene;
    }

    /**
     * Transition to a new scene
     */
    transitionToScene(sceneName) {
        if (this.currentScene) {
            this.currentScene.cleanup();
        }

        this.gameState.currentScene = sceneName;
        this.currentScene = this.scenes[sceneName];

        if (this.currentScene) {
            this.currentScene.init();
        }
    }

    /**
     * Display a message on screen
     */
    showMessage(text, duration = 3000, className = '') {
        const messageDisplay = document.getElementById('message-display');
        const messageEl = document.createElement('p');
        messageEl.className = `message-text ${className}`;
        messageEl.textContent = text;
        messageEl.style.direction = 'rtl';
        messageEl.style.textAlign = 'center';

        messageDisplay.innerHTML = '';
        messageDisplay.appendChild(messageEl);

        if (duration > 0) {
            setTimeout(() => {
                messageEl.style.opacity = '0';
                setTimeout(() => {
                    messageDisplay.innerHTML = '';
                }, 500);
            }, duration);
        }

        return messageEl;
    }

    /**
     * Add a button to the UI
     */
    addButton(text, callback, className = 'button-primary') {
        const controlsContainer = document.getElementById('controls-container');
        const button = document.createElement('button');
        button.className = `game-button ${className}`;
        button.textContent = text;
        button.addEventListener('click', () => {
            this.audio.playClick();
            callback();
        });
        controlsContainer.appendChild(button);
        return button;
    }

    /**
     * Clear all buttons
     */
    clearButtons() {
        const controlsContainer = document.getElementById('controls-container');
        controlsContainer.innerHTML = '';
    }

    /**
     * Record a discovered light source
     */
    recordDiscovery(lightType) {
        if (!this.gameState.discoveredLights.includes(lightType)) {
            this.gameState.discoveredLights.push(lightType);
            this.audio.playDiscovery();
        }
    }

    /**
     * Setup input handlers
     */
    setupInputHandlers() {
        this.canvas.addEventListener('click', (e) => {
            if (this.currentScene && this.currentScene.handleClick) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.currentScene.handleClick(x, y);
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.currentScene && this.currentScene.handleMouseMove) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.currentScene.handleMouseMove(x, y);
            }
        });

        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.currentScene && this.currentScene.handleClick) {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                this.currentScene.handleClick(x, y);
            }
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (this.currentScene && this.currentScene.handleKeydown) {
                this.currentScene.handleKeydown(e.key);
            }
        });

        // Resume audio on user interaction
        document.addEventListener('click', () => {
            this.audio.resume();
        });
    }

    /**
     * Main game loop
     */
    start() {
        const loop = () => {
            const now = Date.now();
            this.deltaTime = (now - this.lastFrameTime) / 1000;
            this.lastFrameTime = now;

            // Update
            if (this.currentScene && this.currentScene.update) {
                this.currentScene.update(this.deltaTime);
            }

            // Render
            this.render();

            this.animationId = requestAnimationFrame(loop);
        };

        // Initialize first scene
        this.transitionToScene('arrival');
        loop();
    }

    /**
     * Render current frame
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render scene
        if (this.currentScene && this.currentScene.render) {
            this.currentScene.render(this.ctx);
        }

        // Update particles
        this.gameState.particles = this.graphics.updateParticles(
            this.gameState.particles,
            this.ctx
        );
    }

    /**
     * Add particles to the game
     */
    addParticles(x, y, count = 10, color = '#FFD93D') {
        const particles = this.graphics.createParticles(x, y, count, color);
        this.gameState.particles.push(...particles);
    }

    /**
     * Pause the game
     */
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    /**
     * Resume the game
     */
    resume() {
        this.start();
    }

    /**
     * Stop the game
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

/**
 * Base Scene Class
 */
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

    cleanup() {
        this.engine.clearButtons();
        document.getElementById('message-display').innerHTML = '';
    }

    /**
     * Helper: Check if point is inside circle
     */
    isPointInCircle(px, py, cx, cy, radius) {
        const dx = px - cx;
        const dy = py - cy;
        return dx * dx + dy * dy <= radius * radius;
    }

    /**
     * Helper: Check if point is inside rect
     */
    isPointInRect(px, py, x, y, width, height) {
        return px >= x && px <= x + width && py >= y && py <= y + height;
    }

    /**
     * Helper: Distance between two points
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Helper: Animate value over time
     */
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * Helper: Linear interpolation
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine, Scene };
}
