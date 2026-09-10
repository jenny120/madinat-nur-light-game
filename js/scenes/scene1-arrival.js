/* ============================================
   SCENE 1: Arrival - Beautiful Town at Sunset
   ============================================ */

class Scene1Arrival extends Scene {
    constructor(engine) {
        super(engine);
        this.cloudOffset = 0;
        this.characterBob = 0;
        this.messageShown = false;
        this.readyToAdvance = false;
    }

    init() {
        this.engine.clearButtons();
        this.messageShown = false;
        this.readyToAdvance = false;
        this.animationTime = 0;

        // Play ambient sound
        this.engine.audio.playAmbience();

        // Show initial message after a brief delay
        setTimeout(() => {
            if (!this.messageShown) {
                this.messageShown = true;
                this.engine.showMessage('ساعد المدينة على استعادة نورها.', 4000);
            }
        }, 1500);

        // Allow advance to next scene after message
        setTimeout(() => {
            this.readyToAdvance = true;
            this.engine.addButton('ابدأ المغامرة', () => {
                this.engine.audio.stopAmbience();
                this.engine.transitionToScene('discovery');
            }, 'button-primary');
        }, 5500);
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Animate clouds
        this.cloudOffset += deltaTime * 10;
        if (this.cloudOffset > 1200) {
            this.cloudOffset = -200;
        }

        // Character idle bob animation
        this.characterBob = Math.sin(this.animationTime * 2) * 5;
    }

    render(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        // Draw base town scene
        this.engine.graphics.createTownScene(ctx.canvas);

        // Animated clouds movement
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.engine.graphics.drawCloud(ctx, this.cloudOffset, h * 0.15, 1.2);
        this.engine.graphics.drawCloud(ctx, this.cloudOffset + 300, h * 0.18, 0.9);
        ctx.restore();

        // Glow from sunset
        const sunsetGlow = ctx.createRadialGradient(w * 0.8, h * 0.25, 0, w * 0.8, h * 0.25, 400);
        sunsetGlow.addColorStop(0, 'rgba(255, 150, 50, 0.15)');
        sunsetGlow.addColorStop(1, 'rgba(255, 100, 0, 0)');
        ctx.fillStyle = sunsetGlow;
        ctx.fillRect(0, 0, w, h);

        // Character animation bob
        ctx.save();
        ctx.translate(0, this.characterBob);
        this.engine.graphics.drawCharacter(ctx, w * 0.5, h * 0.65 + this.characterBob);
        ctx.restore();

        // Fade-in overlay at start
        if (this.animationTime < 1) {
            ctx.fillStyle = `rgba(0, 0, 0, ${1 - this.animationTime})`;
            ctx.fillRect(0, 0, w, h);
        }

        // Gentle vignette effect
        const vignette = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
    }

    cleanup() {
        super.cleanup();
        this.engine.audio.stopAmbience();
    }
}
