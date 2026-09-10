/* ============================================
   SCENE 2: Discovery - Interactive Light Sources
   ============================================ */

class Scene2Discovery extends Scene {
    constructor(engine) {
        super(engine);
        this.darkScene = true;
        this.lightSources = [];
        this.activeLights = [];
        this.selectedLight = null;
        this.setupLightSources();
    }

    setupLightSources() {
        const w = this.engine.gameState.canvasWidth;
        const h = this.engine.gameState.canvasHeight;

        this.lightSources = [
            {
                id: 'candle',
                name: 'الشمعة',
                x: w * 0.2,
                y: h * 0.5,
                type: 'interactive',
                active: false,
                illustration: this.engine.graphics.createCandleIllustration(),
                glowRadius: 120,
                glowColor: 'rgba(255, 217, 61, 0.5)',
                message: 'هذا الشيء يُنتج الضوء.',
                light: { r: 255, g: 217, b: 61 }
            },
            {
                id: 'lamp',
                name: 'المصباح',
                x: w * 0.5,
                y: h * 0.45,
                type: 'interactive',
                active: false,
                illustration: this.engine.graphics.createLampIllustration(),
                glowRadius: 140,
                glowColor: 'rgba(255, 200, 0, 0.5)',
                message: 'هذا الشيء يُنتج الضوء.',
                light: { r: 255, g: 200, b: 0 }
            },
            {
                id: 'flashlight',
                name: 'المصباح اليدوي',
                x: w * 0.8,
                y: h * 0.5,
                type: 'interactive',
                active: false,
                illustration: this.engine.graphics.createFlashlightIllustration(),
                glowRadius: 100,
                glowColor: 'rgba(100, 200, 255, 0.4)',
                message: 'هذا الشيء يُنتج الضوء.',
                light: { r: 100, g: 200, b: 255 }
            },
            {
                id: 'fire',
                name: 'النار',
                x: w * 0.35,
                y: h * 0.65,
                type: 'interactive',
                active: false,
                illustration: this.engine.graphics.createFireIllustration(),
                glowRadius: 130,
                glowColor: 'rgba(255, 150, 50, 0.5)',
                message: 'هذا الشيء يُنتج الضوء.',
                light: { r: 255, g: 150, b: 50 }
            },
        ];
    }

    init() {
        this.engine.clearButtons();
        this.activeLights = [];
        this.selectedLight = null;
        this.animationTime = 0;
        this.darkScene = true;

        // Show instruction
        this.engine.showMessage('انقر على الأشياء لإضاءة الضوء', 2500);

        // Add button to proceed to synthesis when ready
        setTimeout(() => {
            this.engine.addButton('التالي', () => {
                if (this.engine.gameState.discoveredLights.length >= 2) {
                    this.engine.transitionToScene('synthesis');
                } else {
                    this.engine.showMessage('اكتشف المزيد من مصادر الضوء', 1500);
                }
            }, 'button-secondary');
        }, 500);
    }

    handleClick(x, y) {
        // Check if clicking on a light source
        this.lightSources.forEach(light => {
            const dist = this.distance(x, y, light.x, light.y);
            if (dist < 60) {
                this.activateLight(light);
            }
        });
    }

    activateLight(light) {
        if (!light.active) {
            light.active = true;
            this.activeLights.push(light.id);
            this.engine.recordDiscovery(light.id);

            // Play appropriate sound
            if (light.id === 'candle') {
                this.engine.audio.playCandle();
            } else {
                this.engine.audio.playLightOn();
            }

            // Show discovery message
            this.engine.showMessage(light.message, 2500, 'discovery');

            // Create particles
            this.engine.addParticles(light.x, light.y, 15, `rgb(${light.light.r}, ${light.light.g}, ${light.light.b})`);
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Gradually brighten scene as lights are discovered
        const brightnessRatio = this.activeLights.length / 4;
        this.darkScene = 1 - (brightnessRatio * 0.7);
    }

    render(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        // Dark scene background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
        bgGradient.addColorStop(0, `rgba(26, 35, 60, ${this.darkScene})`);
        bgGradient.addColorStop(1, `rgba(15, 52, 96, ${this.darkScene})`);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);

        // Light up background slightly
        ctx.fillStyle = `rgba(100, 100, 120, ${0.2 * (1 - this.darkScene)})`;
        ctx.fillRect(0, 0, w, h);

        // Draw ground
        ctx.fillStyle = `rgba(80, 70, 60, ${0.6 + this.darkScene * 0.3})`;
        ctx.fillRect(0, h * 0.7, w, h * 0.3);

        // Draw simple environment (buildings silhouettes)
        ctx.fillStyle = `rgba(50, 50, 70, ${0.8 + this.darkScene * 0.2})`;
        ctx.fillRect(w * 0.05, h * 0.5, 150, 200);
        ctx.fillRect(w * 0.75, h * 0.55, 160, 190);

        // Draw light sources with glows
        this.lightSources.forEach(light => {
            // Draw glow if active
            if (light.active) {
                this.engine.graphics.drawLightGlow(ctx, light.x, light.y, 0.8);
                
                // Enhanced glow animation
                const glowPulse = 0.9 + Math.sin(this.animationTime * 5) * 0.1;
                const gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.glowRadius * glowPulse);
                gradient.addColorStop(0, light.glowColor);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(light.x - light.glowRadius * glowPulse, light.y - light.glowRadius * glowPulse,
                            light.glowRadius * 2 * glowPulse, light.glowRadius * 2 * glowPulse);
            }

            // Draw illustration
            ctx.save();
            ctx.globalAlpha = light.active ? 1 : 0.6;
            ctx.drawImage(light.illustration, light.x - 50, light.y - 60, 100, 120);
            ctx.restore();

            // Highlight on hover/interaction
            if (light.active) {
                ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(light.x, light.y, 65, 0, Math.PI * 2);
                ctx.stroke();
            }
        });

        // Draw character in scene
        this.engine.graphics.drawCharacter(ctx, w * 0.5, h * 0.65);

        // Particles render in main loop already, but adding enhanced effect here
        // Vignette
        const vignette = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, `rgba(0, 0, 0, ${0.3 + this.darkScene * 0.2})`);
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
    }
}
