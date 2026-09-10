/* ============================================
   SCENE 5: Application - Restoring Light to City
   ============================================ */

class Scene5Application extends Scene {
    constructor(engine) {
        super(engine);
        this.stage = 0; // 0: intro, 1: gameplay, 2: partial success, 3: complete
        this.darkBuildings = [];
        this.restoreLights = [];
        this.setupBuildings();
    }

    setupBuildings() {
        const w = this.engine.gameState.canvasWidth;
        const h = this.engine.gameState.canvasHeight;

        this.darkBuildings = [
            {
                id: 'building1',
                name: 'المنزل الأول',
                x: w * 0.15,
                y: h * 0.4,
                width: 120,
                height: 150,
                windows: 4,
                lit: false,
                lightColor: 'rgba(255, 217, 61, 0.8)'
            },
            {
                id: 'building2',
                name: 'المنزل الثاني',
                x: w * 0.5,
                y: h * 0.35,
                width: 130,
                height: 160,
                windows: 5,
                lit: false,
                lightColor: 'rgba(200, 180, 100, 0.8)'
            },
            {
                id: 'building3',
                name: 'المنزل الثالث',
                x: w * 0.85,
                y: h * 0.4,
                width: 120,
                height: 150,
                windows: 4,
                lit: false,
                lightColor: 'rgba(150, 180, 255, 0.8)'
            },
            {
                id: 'streetlight',
                name: 'مصباح الشارع',
                x: w * 0.3,
                y: h * 0.6,
                width: 40,
                height: 80,
                windows: 1,
                lit: false,
                lightColor: 'rgba(255, 200, 50, 0.8)'
            },
            {
                id: 'tower',
                name: 'البرج',
                x: w * 0.75,
                y: h * 0.3,
                width: 60,
                height: 180,
                windows: 6,
                lit: false,
                lightColor: 'rgba(255, 100, 100, 0.8)'
            }
        ];
    }

    init() {
        this.engine.clearButtons();
        this.stage = 0;
        this.restoreLights = [];
        this.animationTime = 0;

        // Show intro
        this.engine.showMessage('استخدم معرفتك لإضاءة المدينة!', 3000);

        setTimeout(() => {
            this.stage = 1;
            this.engine.showMessage('انقر على المباني لإضاءة الأضواء', 2000);
        }, 3200);
    }

    handleClick(x, y) {
        if (this.stage !== 1) return;

        // Check if clicking on a building
        this.darkBuildings.forEach(building => {
            if (x >= building.x - building.width / 2 &&
                x <= building.x + building.width / 2 &&
                y >= building.y - building.height / 2 &&
                y <= building.y + building.height / 2) {
                
                if (!building.lit) {
                    this.lightBuilding(building);
                }
            }
        });
    }

    lightBuilding(building) {
        building.lit = true;
        this.restoreLights.push(building.id);
        this.engine.audio.playLightOn();

        // Particles
        this.engine.addParticles(building.x, building.y - building.height / 4, 20, building.lightColor);

        // Show message
        this.engine.showMessage(`${building.name} تشع الآن!`, 1500, 'success');

        // Check progress
        if (this.restoreLights.length === Math.ceil(this.darkBuildings.length / 2)) {
            this.partialSuccess();
        } else if (this.restoreLights.length === this.darkBuildings.length) {
            this.completeApplication();
        }
    }

    partialSuccess() {
        if (this.stage === 2) return; // Already in partial success
        
        this.stage = 2;
        this.engine.audio.playSuccess();
        this.engine.showMessage('المدينة تبدأ بالتعافي!', 2500, 'success');
    }

    completeApplication() {
        this.stage = 3;
        this.engine.audio.playSuccess();
        this.engine.showMessage('المدينة استعادت نورها!', 3000, 'success');

        setTimeout(() => {
            this.engine.addButton('التالي', () => {
                this.engine.transitionToScene('celebration');
            }, 'button-primary');
        }, 3200);
    }

    update(deltaTime) {
        super.update(deltaTime);
    }

    render(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        // Night sky background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
        bgGradient.addColorStop(0, '#0a1a3a');
        bgGradient.addColorStop(0.5, '#1a2a4a');
        bgGradient.addColorStop(1, '#2a3a5a');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);

        // Stars (background)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 20; i++) {
            const starX = (i * 123 + 47) % w;
            const starY = (i * 89 + 23) % (h * 0.3);
            ctx.fillRect(starX, starY, 2, 2);
        }

        // Draw ground
        ctx.fillStyle = 'rgba(60, 50, 40, 0.6)';
        ctx.fillRect(0, h * 0.7, w, h * 0.3);

        // Draw buildings
        this.darkBuildings.forEach(building => {
            ctx.save();

            // Building shadow/base
            ctx.fillStyle = building.lit ? 'rgba(100, 90, 70, 0.8)' : 'rgba(40, 35, 30, 0.9)';
            ctx.fillRect(
                building.x - building.width / 2,
                building.y - building.height / 2,
                building.width,
                building.height
            );

            // Building outline
            ctx.strokeStyle = building.lit ? 'rgba(150, 130, 100, 0.7)' : 'rgba(80, 70, 60, 0.7)';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                building.x - building.width / 2,
                building.y - building.height / 2,
                building.width,
                building.height
            );

            // Windows
            const windowSize = 16;
            const windowsPerRow = Math.ceil(Math.sqrt(building.windows));
            const spacing = building.width / (windowsPerRow + 1);
            const verticalSpacing = building.height / 3;

            let windowIndex = 0;
            for (let row = 0; row < Math.ceil(building.windows / windowsPerRow); row++) {
                for (let col = 0; col < windowsPerRow && windowIndex < building.windows; col++) {
                    const wx = building.x - building.width / 2 + spacing * (col + 1);
                    const wy = building.y - building.height / 2 + 30 + row * verticalSpacing;

                    if (building.lit) {
                        // Lit window
                        ctx.fillStyle = building.lightColor;
                        ctx.fillRect(wx - windowSize / 2, wy - windowSize / 2, windowSize, windowSize);
                        
                        // Glow
                        const glow = ctx.createRadialGradient(wx, wy, 0, wx, wy, windowSize);
                        glow.addColorStop(0, building.lightColor);
                        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                        ctx.fillStyle = glow;
                        ctx.fillRect(wx - windowSize * 1.5, wy - windowSize * 1.5, windowSize * 3, windowSize * 3);
                    } else {
                        // Dark window
                        ctx.fillStyle = 'rgba(20, 20, 25, 0.8)';
                        ctx.fillRect(wx - windowSize / 2, wy - windowSize / 2, windowSize, windowSize);
                    }

                    ctx.strokeStyle = 'rgba(100, 100, 120, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(wx - windowSize / 2, wy - windowSize / 2, windowSize, windowSize);

                    windowIndex++;
                }
            }

            ctx.restore();
        });

        // Draw character celebrating
        ctx.save();
        ctx.globalAlpha = 0.7;
        this.engine.graphics.drawCharacter(ctx, w * 0.5, h * 0.75);
        ctx.restore();

        // Progress indicator
        if (this.stage >= 1) {
            ctx.save();
            ctx.font = '18px Arial';
            ctx.fillStyle = 'rgba(200, 220, 255, 0.9)';
            ctx.textAlign = 'center';
            ctx.fillText(`أضاء: ${this.restoreLights.length}/${this.darkBuildings.length}`, w / 2, 30);
            ctx.restore();
        }

        // Completion message
        if (this.stage === 3) {
            ctx.save();
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255, 217, 61, 0.95)';
            ctx.fillText('المدينة استعادت نورها!', w / 2, h * 0.15);
            ctx.restore();
        }

        // Vignette
        const vignette = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h));
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
    }
}
