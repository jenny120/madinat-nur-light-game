/* ============================================
   SCENE 6: Celebration - Game Completion
   ============================================ */

class Scene6Celebration extends Scene {
    constructor(engine) {
        super(engine);
        this.stage = 0; // 0: intro, 1: celebration, 2: summary
        this.confetti = [];
        this.generateConfetti();
    }

    generateConfetti() {
        const w = this.engine.gameState.canvasWidth;
        this.confetti = [];
        
        for (let i = 0; i < 50; i++) {
            this.confetti.push({
                x: Math.random() * w,
                y: Math.random() * -100 - 20,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                color: ['#FFD93D', '#FF6B6B', '#4CAF50', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 5)],
                size: Math.random() * 4 + 2
            });
        }
    }

    init() {
        this.engine.clearButtons();
        this.stage = 0;
        this.animationTime = 0;
        this.generateConfetti();

        // Play celebration music
        this.engine.audio.playVictory();

        // Show celebration message
        this.engine.showMessage('مبروك! لقد أكملت اللعبة!', 3000, 'success');

        setTimeout(() => {
            this.stage = 1;
        }, 3200);
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Update confetti
        this.confetti.forEach(conf => {
            conf.y += conf.vy;
            conf.x += conf.vx;
            conf.rotation += conf.rotationSpeed;

            // Add gravity
            conf.vy += 0.1;

            // Fade out at bottom
            if (conf.y > this.engine.gameState.canvasHeight + 50) {
                conf.y = -20;
                conf.x = Math.random() * this.engine.gameState.canvasWidth;
            }
        });
    }

    render(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        // Celebration background - gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
        bgGradient.addColorStop(0, '#FFD93D');
        bgGradient.addColorStop(0.5, '#FF6B6B');
        bgGradient.addColorStop(1, '#4ECDC4');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);

        // Overlay with transparency
        ctx.fillStyle = 'rgba(255, 200, 50, 0.3)';
        ctx.fillRect(0, 0, w, h);

        // Draw confetti
        this.confetti.forEach(conf => {
            ctx.save();
            ctx.translate(conf.x, conf.y);
            ctx.rotate(conf.rotation);
            ctx.fillStyle = conf.color;
            ctx.fillRect(-conf.size / 2, -conf.size / 2, conf.size, conf.size);
            ctx.restore();
        });

        // Draw character celebrating with stars
        ctx.save();
        this.engine.graphics.drawCharacter(ctx, w / 2, h * 0.5);
        ctx.restore();

        // Draw celebration stars around character
        ctx.save();
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.8;
        const starOffset = Math.sin(this.animationTime * 4) * 20;
        ctx.fillText('⭐', w / 2 - 80 + starOffset, h * 0.3);
        ctx.fillText('⭐', w / 2 + 80 - starOffset, h * 0.3);
        ctx.fillText('✨', w / 2 + starOffset, h * 0.2);
        ctx.restore();

        // Main title
        ctx.save();
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fillText('أنت خبير الضوء!', w / 2, h * 0.15);
        ctx.restore();

        // Celebration message
        if (this.stage === 1) {
            ctx.save();
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 6;
            ctx.fillText('لقد تعلمت كل شيء عن مصادر الضوء', w / 2, h * 0.75);
            ctx.restore();
        }

        // Learning summary
        if (this.stage === 1) {
            const summaryItems = [
                '✓ اكتشفت أنواع مصادر الضوء المختلفة',
                '✓ تعلمت الخصائص المشتركة للضوء',
                '✓ صنفت الأشياء بناءً على معرفتك',
                '✓ استخدمت ضوؤك لإضاءة المدينة'
            ];

            ctx.save();
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';

            summaryItems.forEach((item, index) => {
                ctx.fillText(item, w * 0.1, h * 0.82 + index * 25);
            });
            ctx.restore();
        }

        // Pulsing glow effect
        const glowAlpha = 0.2 + Math.sin(this.animationTime * 2) * 0.15;
        const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
        glow.addColorStop(0, `rgba(255, 217, 61, ${glowAlpha})`);
        glow.addColorStop(1, 'rgba(255, 217, 61, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
    }
}
