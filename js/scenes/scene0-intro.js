/* ============================================
   SCENE 0: Intro - Game Introduction
   ============================================ */

class Scene0Intro extends Scene {
    constructor(engine) {
        super(engine);
        this.stage = 0; // 0: title, 1: story, 2: instructions, 3: ready
        this.storyIndex = 0;
        this.storyText = [
            'مرحباً بك في مدينة النور! 👋',
            'كانت مدينتنا الجميلة تتمتع بالنور في كل مكان...',
            'لكن حدث شيء ما... اختفى النور! 😟',
            'نحتاج إلى خبيرك لمساعدتنا على استعادة الضوء 💡',
            'هل أنت مستعد لهذه المغامرة؟ 🚀'
        ];
    }

    init() {
        this.engine.clearButtons();
        this.stage = 0;
        this.storyIndex = 0;
        this.animationTime = 0;

        // Show initial message
        this.showStory();
    }

    showStory() {
        if (this.storyIndex < this.storyText.length) {
            this.engine.showMessage(this.storyText[this.storyIndex], 3000, 'info');
            this.storyIndex++;

            setTimeout(() => {
                this.showStory();
            }, 3200);
        } else {
            this.stage = 2;
            this.showInstructions();
        }
    }

    showInstructions() {
        this.engine.showMessage('تعرف على مصادر الضوء المختلفة', 2000, 'discovery');

        setTimeout(() => {
            this.engine.addButton('ابدأ المغامرة', () => {
                this.engine.transitionToScene('exploration');
            }, 'button-primary');
        }, 2200);
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    render(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        // Animated background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
        bgGradient.addColorStop(0, '#1a1a2e');
        bgGradient.addColorStop(0.5, '#16213e');
        bgGradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);

        // Animated stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 30; i++) {
            const x = (i * 137 + 47 + this.animationTime * 10) % (w + 100);
            const y = (i * 71 + 23) % h;
            ctx.fillRect(x, y, 2, 2);
        }

        // Draw sun icon (top right)
        this.drawSun(ctx, w * 0.85, h * 0.15);

        // Draw title
        ctx.save();
        ctx.font = 'bold 56px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 217, 61, 0.95)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        ctx.fillText('مدينة النور', w / 2, h * 0.25);
        ctx.restore();

        // Draw subtitle
        ctx.save();
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(200, 220, 255, 0.85)';
        ctx.fillText('لعبة تعليمية عن مصادر الضوء', w / 2, h * 0.35);
        ctx.restore();

        // Draw character in center
        ctx.save();
        ctx.globalAlpha = 0.8;
        this.engine.graphics.drawCharacter(ctx, w / 2, h * 0.6);
        ctx.restore();

        // Draw animated light rays
        this.drawLightRays(ctx, w, h);

        // Draw decorative lights around
        ctx.save();
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.6 + Math.sin(this.animationTime * 2) * 0.3;
        ctx.fillText('💡', w * 0.15, h * 0.4);
        ctx.fillText('🔥', w * 0.85, h * 0.5);
        ctx.fillText('⭐', w * 0.2, h * 0.75);
        ctx.fillText('✨', w * 0.8, h * 0.7);
        ctx.restore();

        // Draw version/credits
        ctx.save();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText('© 2026 برنامج مدينة النور', w / 2, h - 15);
        ctx.restore();

        // Vignette effect
        const vignette = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
    }

    drawSun(ctx, x, y) {
        ctx.save();

        // Outer glow
        const glow1 = ctx.createRadialGradient(x, y, 0, x, y, 70);
        glow1.addColorStop(0, 'rgba(255, 200, 0, 0.2)');
        glow1.addColorStop(1, 'rgba(255, 200, 0, 0)');
        ctx.fillStyle = glow1;
        ctx.beginPath();
        ctx.arc(x, y, 70, 0, Math.PI * 2);
        ctx.fill();

        // Middle glow
        const glow2 = ctx.createRadialGradient(x, y, 0, x, y, 50);
        glow2.addColorStop(0, 'rgba(255, 180, 0, 0.3)');
        glow2.addColorStop(1, 'rgba(255, 180, 0, 0)');
        ctx.fillStyle = glow2;
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fill();

        // Sun rays
        ctx.strokeStyle = 'rgba(255, 200, 0, 0.6)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const x1 = x + Math.cos(angle) * 40;
            const y1 = y + Math.sin(angle) * 40;
            const x2 = x + Math.cos(angle) * 65;
            const y2 = y + Math.sin(angle) * 65;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Sun core
        const sunGradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        sunGradient.addColorStop(0, 'rgba(255, 255, 100, 0.95)');
        sunGradient.addColorStop(1, 'rgba(255, 200, 0, 0.95)');
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawLightRays(ctx, w, h) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 217, 61, 0.15)';
        ctx.lineWidth = 2;

        const rayOffset = this.animationTime * 50;
        for (let i = 0; i < 5; i++) {
            const x = (w / 2 + (i - 2) * 60);
            const y = 0 - rayOffset;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 40, h + rayOffset);
            ctx.stroke();
        }

        ctx.restore();
    }
}
