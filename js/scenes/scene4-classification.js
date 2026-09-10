/* ============================================
   SCENE 4: Classification - Knowledge Testing
   ============================================ */

class Scene4Classification extends Scene {
    constructor(engine) {
        super(engine);
        this.stage = 0; // 0: intro, 1: gameplay, 2: complete
        this.score = 0;
        this.currentRound = 0;
        this.totalRounds = 5;
        this.items = [];
        this.setupClassificationItems();
    }

    setupClassificationItems() {
        this.items = [
            {
                id: 'sun',
                name: 'الشمس',
                icon: '☀️',
                isLightSource: true,
                category: 'natural'
            },
            {
                id: 'moon',
                name: 'القمر',
                icon: '🌙',
                isLightSource: false,
                category: 'natural',
                explanation: 'القمر ينعكس ضوء الشمس عليه'
            },
            {
                id: 'bulb',
                name: 'المصباح الكهربائي',
                icon: '💡',
                isLightSource: true,
                category: 'electric'
            },
            {
                id: 'mirror',
                name: 'المرآة',
                icon: '🪞',
                isLightSource: false,
                category: 'reflector',
                explanation: 'المرآة تعكس الضوء فقط'
            },
            {
                id: 'star',
                name: 'نجم',
                icon: '⭐',
                isLightSource: true,
                category: 'natural'
            },
            {
                id: 'table',
                name: 'طاولة',
                icon: '🪑',
                isLightSource: false,
                category: 'object',
                explanation: 'الطاولة لا تنتج ضوء'
            },
            {
                id: 'screen',
                name: 'شاشة',
                icon: '📱',
                isLightSource: true,
                category: 'electric'
            },
            {
                id: 'book',
                name: 'كتاب',
                icon: '📖',
                isLightSource: false,
                category: 'object',
                explanation: 'الكتاب يعكس الضوء فقط'
            }
        ];

        // Shuffle items
        this.items = this.items.sort(() => Math.random() - 0.5);
    }

    init() {
        this.engine.clearButtons();
        this.stage = 0;
        this.score = 0;
        this.currentRound = 0;
        this.animationTime = 0;

        // Show intro
        this.engine.showMessage('هل هذا مصدر ضوء؟', 3000);

        setTimeout(() => {
            this.stage = 1;
            this.presentItem();
        }, 3200);
    }

    presentItem() {
        if (this.currentRound < this.totalRounds) {
            this.engine.clearButtons();
            const item = this.items[this.currentRound];

            // Add classification buttons
            this.engine.addButton('✓ نعم', () => {
                this.classifyItem(true);
            }, 'button-success');

            this.engine.addButton('✗ لا', () => {
                this.classifyItem(false);
            }, 'button-danger');
        } else {
            this.completeClassification();
        }
    }

    classifyItem(userAnswer) {
        if (this.stage !== 1) return;

        const item = this.items[this.currentRound];
        const isCorrect = userAnswer === item.isLightSource;

        if (isCorrect) {
            this.score++;
            this.engine.audio.playSuccess();
            this.engine.showMessage('صحيح! ✓', 1500, 'success');
            this.engine.addParticles(200, 100, 10, '#4CAF50');
        } else {
            this.engine.audio.playError();
            const message = item.explanation || (item.isLightSource ? 'هذا مصدر ضوء' : 'هذا ليس مصدر ضوء');
            this.engine.showMessage(message, 2000, 'error');
        }

        this.currentRound++;
        setTimeout(() => {
            this.presentItem();
        }, 2000);
    }

    completeClassification() {
        this.stage = 2;
        this.engine.audio.playSuccess();

        const percentage = Math.round((this.score / this.totalRounds) * 100);
        let message = '';

        if (percentage === 100) {
            message = 'ممتاز! أنت خبير في مصادر الضوء!';
        } else if (percentage >= 80) {
            message = 'رائع! أنت تفهم مصادر الضوء جيداً';
        } else if (percentage >= 60) {
            message = 'جيد! استمر في التعلم';
        } else {
            message = 'حاول مرة أخرى لفهم المزيد';
        }

        this.engine.showMessage(message, 3000, 'success');

        setTimeout(() => {
            this.engine.addButton('التالي', () => {
                this.engine.transitionToScene('application');
            }, 'button-primary');
        }, 3200);
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    render(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        // Background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
        bgGradient.addColorStop(0, '#2d3f5f');
        bgGradient.addColorStop(1, '#1a2540');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);

        if (this.stage === 1 && this.currentRound < this.totalRounds) {
            const item = this.items[this.currentRound];

            // Draw progress bar
            ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
            ctx.fillRect(w * 0.1, h * 0.05, w * 0.8, 20);

            const progressWidth = (this.currentRound / this.totalRounds) * (w * 0.8);
            ctx.fillStyle = 'rgba(150, 200, 255, 0.7)';
            ctx.fillRect(w * 0.1, h * 0.05, progressWidth, 20);

            // Draw progress text
            ctx.save();
            ctx.font = '12px Arial';
            ctx.fillStyle = 'rgba(200, 220, 255, 1)';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.currentRound + 1}/${this.totalRounds}`, w / 2, h * 0.08);
            ctx.restore();

            // Draw large item icon in center
            ctx.save();
            ctx.font = 'bold 150px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Pulsing animation for the item
            const scale = 0.9 + Math.sin(this.animationTime * 3) * 0.1;
            ctx.globalAlpha = scale;
            ctx.fillText(item.icon, w / 2, h / 2 - 50);
            ctx.restore();

            // Draw item name
            ctx.save();
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(200, 220, 255, 1)';
            ctx.fillText(item.name, w / 2, h / 2 + 80);
            ctx.restore();

            // Draw question box
            ctx.save();
            ctx.fillStyle = 'rgba(60, 100, 150, 0.4)';
            ctx.fillRect(w * 0.15, h * 0.15, w * 0.7, 60);
            ctx.strokeStyle = 'rgba(150, 180, 220, 0.6)';
            ctx.lineWidth = 2;
            ctx.strokeRect(w * 0.15, h * 0.15, w * 0.7, 60);
            ctx.restore();

            // Draw score
            ctx.save();
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = 'rgba(255, 217, 61, 0.9)';
            ctx.textAlign = 'right';
            ctx.fillText(`النقاط: ${this.score}/${this.currentRound}`, w * 0.95, h * 0.95);
            ctx.restore();
        }

        if (this.stage === 2) {
            // Show final score screen
            ctx.save();
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255, 217, 61, 1)';
            ctx.fillText(`${this.score}/${this.totalRounds}`, w / 2, h / 2 - 50);

            ctx.font = '24px Arial';
            ctx.fillStyle = 'rgba(200, 220, 255, 0.9)';
            ctx.fillText('صحيح من أصل', w / 2, h / 2 + 30);
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
