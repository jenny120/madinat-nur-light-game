/* ============================================
   SCENE 3: Synthesis - Learning Common Properties
   ============================================ */

class Scene3Synthesis extends Scene {
    constructor(engine) {
        super(engine);
        this.stage = 0; // 0: intro, 1: property exploration, 2: synthesis
        this.selectedProperty = null;
        this.revealedProperties = [];
        this.propertyCards = [];
        this.setupPropertyCards();
    }

    setupPropertyCards() {
        const w = this.engine.gameState.canvasWidth;
        const h = this.engine.gameState.canvasHeight;

        this.propertyCards = [
            {
                id: 'heat',
                label: 'حرارة',
                icon: '🔥',
                x: w * 0.15,
                y: h * 0.4,
                revealed: false,
                description: 'مصادر الضوء تنتج حرارة',
                examples: ['الشمعة', 'النار']
            },
            {
                id: 'energy',
                label: 'الطاقة',
                icon: '⚡',
                x: w * 0.5,
                y: h * 0.35,
                revealed: false,
                description: 'تحتاج إلى طاقة لإنتاج الضوء',
                examples: ['المصباح', 'المصباح اليدوي']
            },
            {
                id: 'visibility',
                label: 'الرؤية',
                icon: '👁️',
                x: w * 0.85,
                y: h * 0.4,
                revealed: false,
                description: 'الضوء يجعل الأشياء مرئية',
                examples: ['جميع المصادر']
            },
            {
                id: 'color',
                label: 'اللون',
                icon: '🎨',
                x: w * 0.3,
                y: h * 0.65,
                revealed: false,
                description: 'لكل مصدر ضوء لون مختلف',
                examples: ['أصفر', 'أزرق', 'برتقالي']
            },
            {
                id: 'direction',
                label: 'الاتجاه',
                icon: '→',
                x: w * 0.7,
                y: h * 0.65,
                revealed: false,
                description: 'الضوء ينتشر في اتجاهات',
                examples: ['إشعاع', 'توهج']
            }
        ];
    }

    init() {
        this.engine.clearButtons();
        this.stage = 0;
        this.selectedProperty = null;
        this.revealedProperties = [];
        this.animationTime = 0;

        // Show intro message
        this.engine.showMessage('ما الذي يشترك فيه كل مصادر الضوء؟', 3000);

        setTimeout(() => {
            this.stage = 1;
            this.engine.showMessage('انقر على الخصائص لاستكشافها', 2000);
        }, 3200);
    }

    handleClick(x, y) {
        if (this.stage !== 1) return;

        // Check if clicking on a property card
        this.propertyCards.forEach(card => {
            const dist = this.distance(x, y, card.x, card.y);
            if (dist < 50 && !card.revealed) {
                this.revealProperty(card);
            }
        });
    }

    revealProperty(card) {
        if (card.revealed) return;

        card.revealed = true;
        this.revealedProperties.push(card.id);
        this.engine.audio.playDiscovery();

        // Show property details
        this.engine.showMessage(card.description, 2500, 'discovery');

        // Create particles
        this.engine.addParticles(card.x, card.y, 12, '#FFD93D');

        // Check if all properties revealed
        if (this.revealedProperties.length === this.propertyCards.length) {
            setTimeout(() => {
                this.completeSynthesis();
            }, 1500);
        }
    }

    completeSynthesis() {
        this.stage = 2;
        this.engine.audio.playSuccess();
        this.engine.showMessage('الضوء له خصائص مشتركة!', 3000, 'success');

        setTimeout(() => {
            this.engine.addButton('التالي', () => {
                this.engine.transitionToScene('classification');
            }, 'button-primary');
        }, 3200);
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    render(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        // Background - library/study scene
        const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
        bgGradient.addColorStop(0, '#1a2540');
        bgGradient.addColorStop(1, '#2d3f5f');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);

        // Draw bookshelves silhouette
        ctx.fillStyle = 'rgba(80, 70, 100, 0.3)';
        ctx.fillRect(0, 0, w * 0.15, h);
        ctx.fillRect(w * 0.85, 0, w * 0.15, h);

        // Draw character in thinking pose
        ctx.save();
        ctx.globalAlpha = 0.8;
        this.engine.graphics.drawCharacter(ctx, w * 0.5, h * 0.75);
        ctx.restore();

        // Draw property cards
        this.propertyCards.forEach((card, index) => {
            ctx.save();

            // Card background
            ctx.fillStyle = card.revealed ? 'rgba(100, 150, 200, 0.6)' : 'rgba(60, 80, 120, 0.5)';
            ctx.beginPath();
            ctx.arc(card.x, card.y, 50, 0, Math.PI * 2);
            ctx.fill();

            // Card border
            ctx.strokeStyle = card.revealed ? 'rgba(200, 220, 255, 0.8)' : 'rgba(150, 170, 200, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(card.x, card.y, 50, 0, Math.PI * 2);
            ctx.stroke();

            // Glow effect if revealed
            if (card.revealed) {
                const glowAlpha = 0.3 + Math.sin(this.animationTime * 4) * 0.2;
                ctx.fillStyle = `rgba(150, 200, 255, ${glowAlpha})`;
                ctx.beginPath();
                ctx.arc(card.x, card.y, 55, 0, Math.PI * 2);
                ctx.fill();
            }

            // Icon
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = card.revealed ? 1 : 0.6;
            ctx.fillText(card.icon, card.x, card.y);

            // Label below card
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = card.revealed ? 'rgba(200, 220, 255, 1)' : 'rgba(150, 170, 200, 0.7)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(card.label, card.x, card.y + 65);

            ctx.restore();
        });

        // Draw connection lines between revealed properties
        if (this.revealedProperties.length > 1) {
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            
            for (let i = 0; i < this.revealedProperties.length - 1; i++) {
                const card1 = this.propertyCards.find(c => c.id === this.revealedProperties[i]);
                const card2 = this.propertyCards.find(c => c.id === this.revealedProperties[i + 1]);
                if (card1 && card2) {
                    ctx.beginPath();
                    ctx.moveTo(card1.x, card1.y);
                    ctx.lineTo(card2.x, card2.y);
                    ctx.stroke();
                }
            }
            ctx.setLineDash([]);
        }

        // Synthesis message when all revealed
        if (this.stage === 2) {
            ctx.save();
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255, 217, 61, 0.8)';
            ctx.fillText('جميع مصادر الضوء لها خصائص مشتركة', w / 2, h * 0.15);
            ctx.restore();
        }

        // Vignette
        const vignette = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
    }
}
