/* ============================================
   Graphics & Illustration Utility
   SVG-based visual assets for the game
   ============================================ */

class Graphics {
    constructor() {
        this.svgNS = 'http://www.w3.org/2000/svg';
    }

    /**
     * Create an SVG element
     */
    createSVG(width, height, classes = '') {
        const svg = document.createElementNS(this.svgNS, 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        if (classes) svg.setAttribute('class', classes);
        return svg;
    }

    /**
     * SCENE 1: Beautiful Town at Sunset
     */
    createTownScene(canvas) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Gradient sky: warm sunset to evening
        const skyGradient = ctx.createLinearGradient(0, 0, 0, h);
        skyGradient.addColorStop(0, '#FF9966');      // Warm sunset orange
        skyGradient.addColorStop(0.3, '#FFCC99');    // Peachy
        skyGradient.addColorStop(0.6, '#6699FF');    // Soft blue
        skyGradient.addColorStop(1, '#1A3A52');      // Deep evening blue

        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, w, h);

        // Distant mountains/hills
        this.drawHills(ctx, w, h);

        // Sun (partially hidden by clouds effect)
        this.drawSun(ctx, w * 0.8, h * 0.25);

        // Background buildings (far)
        this.drawBackgroundBuildings(ctx, w, h);

        // Middle ground buildings
        this.drawMiddleBuildings(ctx, w, h);

        // Foreground buildings and street
        this.drawForegroundScene(ctx, w, h);

        // Festival decorations
        this.drawFestivalDecorations(ctx, w, h);

        // Trees and vegetation
        this.drawTrees(ctx, w, h);

        // Character child explorer
        this.drawCharacter(ctx, w * 0.5, h * 0.65);

        // Animated elements (flags, particles)
        this.drawAnimatedElements(ctx, w, h);
    }

    drawHills(ctx, w, h) {
        // Distant hills - layered for depth
        ctx.fillStyle = 'rgba(102, 102, 153, 0.4)';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.5);
        ctx.quadraticCurveTo(w * 0.25, h * 0.35, w * 0.5, h * 0.45);
        ctx.quadraticCurveTo(w * 0.75, h * 0.55, w, h * 0.4);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();

        // Darker hill layer
        ctx.fillStyle = 'rgba(80, 80, 120, 0.3)';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.55);
        ctx.quadraticCurveTo(w * 0.3, h * 0.45, w * 0.6, h * 0.52);
        ctx.quadraticCurveTo(w * 0.8, h * 0.58, w, h * 0.48);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();
    }

    drawSun(ctx, x, y) {
        const radius = 80;

        // Sun glow
        const sunGlow = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
        sunGlow.addColorStop(0, 'rgba(255, 200, 0, 0.4)');
        sunGlow.addColorStop(1, 'rgba(255, 150, 0, 0)');

        ctx.fillStyle = sunGlow;
        ctx.fillRect(x - radius * 1.5, y - radius * 1.5, radius * 3, radius * 3);

        // Sun body
        ctx.fillStyle = '#FFD93D';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Sun highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawBackgroundBuildings(ctx, w, h) {
        // Far buildings - simple silhouettes
        const buildings = [
            { x: w * 0.1, y: h * 0.4, width: 60, height: 120, color: 'rgba(102, 68, 34, 0.6)' },
            { x: w * 0.25, y: h * 0.35, width: 80, height: 140, color: 'rgba(120, 80, 40, 0.6)' },
            { x: w * 0.75, y: h * 0.38, width: 70, height: 130, color: 'rgba(110, 70, 35, 0.6)' },
            { x: w * 0.88, y: h * 0.42, width: 75, height: 115, color: 'rgba(100, 60, 30, 0.6)' },
        ];

        buildings.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.width, b.height);

            // Windows
            ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 4; j++) {
                    ctx.fillRect(b.x + 10 + i * 18, b.y + 15 + j * 25, 12, 15);
                }
            }
        });
    }

    drawMiddleBuildings(ctx, w, h) {
        // Mid-ground buildings with more detail
        const buildings = [
            { x: w * 0.05, y: h * 0.5, width: 120, height: 180, color: '#D4994E', roofColor: '#A0622F' },
            { x: w * 0.2, y: h * 0.48, width: 140, height: 200, color: '#E8B44F', roofColor: '#C09040' },
            { x: w * 0.65, y: h * 0.52, width: 130, height: 190, color: '#D4A456', roofColor: '#A0822F' },
        ];

        buildings.forEach(b => {
            // Building body
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.width, b.height);

            // Roof (triangular)
            ctx.fillStyle = b.roofColor;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x + b.width / 2, b.y - 30);
            ctx.lineTo(b.x + b.width, b.y);
            ctx.fill();

            // Windows with warm light
            ctx.fillStyle = '#FFD93D';
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 5; j++) {
                    ctx.fillRect(b.x + 15 + i * 35, b.y + 20 + j * 30, 20, 18);
                }
            }

            // Window frames
            ctx.strokeStyle = b.roofColor;
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 5; j++) {
                    ctx.strokeRect(b.x + 15 + i * 35, b.y + 20 + j * 30, 20, 18);
                }
            }
        });
    }

    drawForegroundScene(ctx, w, h) {
        // Street/ground
        const groundGradient = ctx.createLinearGradient(0, h * 0.7, 0, h);
        groundGradient.addColorStop(0, '#8B7355');
        groundGradient.addColorStop(1, '#6B5344');

        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, h * 0.7, w, h * 0.3);

        // Street markings
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 30]);
        ctx.beginPath();
        ctx.moveTo(0, h * 0.8);
        ctx.lineTo(w, h * 0.8);
        ctx.stroke();
        ctx.setLineDash([]);

        // Fountain in center
        this.drawFountain(ctx, w * 0.5, h * 0.6);

        // Street lamps
        this.drawStreetLamp(ctx, w * 0.15, h * 0.55);
        this.drawStreetLamp(ctx, w * 0.85, h * 0.55);
    }

    drawFountain(ctx, x, y) {
        // Base
        ctx.fillStyle = '#C0A0A0';
        ctx.beginPath();
        ctx.ellipse(x, y, 80, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Water basin
        ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y - 15, 70, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Central pillar
        ctx.fillStyle = '#A08080';
        ctx.fillRect(x - 15, y - 60, 30, 50);

        // Water spray particles
        ctx.fillStyle = 'rgba(150, 220, 255, 0.6)';
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const px = x + Math.cos(angle) * 50;
            const py = y - 40 + Math.sin(angle) * 20;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawStreetLamp(ctx, x, y) {
        // Pole
        ctx.fillStyle = '#333333';
        ctx.fillRect(x - 4, y, 8, 100);

        // Lamp head
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.ellipse(x, y - 15, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lamp glass (not lit yet in this scene, will light up later)
        ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y - 15, 20, 16, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFestivalDecorations(ctx, w, h) {
        // Bunting/flags
        ctx.strokeStyle = 'rgba(255, 150, 0, 0.7)';
        ctx.lineWidth = 3;

        for (let i = 0; i < 5; i++) {
            const startX = (i / 4) * w;
            const endX = startX + 60;
            ctx.beginPath();
            ctx.moveTo(startX, h * 0.3);
            ctx.quadraticCurveTo((startX + endX) / 2, h * 0.35, endX, h * 0.3);
            ctx.stroke();
        }

        // Colorful banner shapes below the lines
        const colors = ['#FF6B6B', '#FFD93D', '#1DD1A1', '#00D4FF', '#FF69B4'];
        for (let i = 0; i < 5; i++) {
            const x = (i / 4) * w + 30;
            const y = h * 0.32;
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(x - 10, y);
            ctx.lineTo(x + 10, y);
            ctx.lineTo(x + 8, y + 15);
            ctx.lineTo(x - 8, y + 15);
            ctx.fill();
        }
    }

    drawTrees(ctx, w, h) {
        // Left tree
        this.drawTree(ctx, w * 0.15, h * 0.48);

        // Right tree
        this.drawTree(ctx, w * 0.85, h * 0.5);

        // Background trees
        this.drawTree(ctx, w * 0.35, h * 0.42, 0.7);
        this.drawTree(ctx, w * 0.65, h * 0.45, 0.75);
    }

    drawTree(ctx, x, y, scale = 1) {
        scale = scale || 1;

        // Trunk
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(x - 12 * scale, y, 24 * scale, 80 * scale);

        // Foliage layers
        ctx.fillStyle = '#2D5016';
        ctx.beginPath();
        ctx.arc(x, y - 40 * scale, 50 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Lighter foliage highlights
        ctx.fillStyle = 'rgba(45, 200, 60, 0.5)';
        ctx.beginPath();
        ctx.arc(x - 20 * scale, y - 50 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 20 * scale, y - 45 * scale, 32 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCharacter(ctx, x, y) {
        // Head
        ctx.fillStyle = '#F4A76D';
        ctx.beginPath();
        ctx.arc(x, y - 40, 18, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#4A3728';
        ctx.beginPath();
        ctx.arc(x, y - 50, 20, 0, Math.PI);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#2C2C2C';
        ctx.beginPath();
        ctx.arc(x - 7, y - 43, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 7, y - 43, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#2C2C2C';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y - 38, 5, 0, Math.PI);
        ctx.stroke();

        // Body
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(x - 15, y - 20, 30, 35);

        // Arms
        ctx.fillStyle = '#F4A76D';
        ctx.fillRect(x - 28, y - 12, 13, 25);
        ctx.fillRect(x + 15, y - 12, 13, 25);

        // Legs
        ctx.fillStyle = '#4A5568';
        ctx.fillRect(x - 10, y + 15, 9, 30);
        ctx.fillRect(x + 1, y + 15, 9, 30);

        // Shoes
        ctx.fillStyle = '#2C1810';
        ctx.fillRect(x - 10, y + 45, 10, 8);
        ctx.fillRect(x + 1, y + 45, 10, 8);
    }

    drawAnimatedElements(ctx, w, h) {
        // Clouds (will be animated in game loop)
        this.drawCloud(ctx, w * 0.3, h * 0.2, 1);
        this.drawCloud(ctx, w * 0.7, h * 0.15, 0.8);

        // Birds (simple silhouettes in distance)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let i = 0; i < 3; i++) {
            const bx = w * (0.2 + i * 0.3);
            const by = h * (0.1 + i * 0.05);
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bx - 4, by, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bx + 4, by, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawCloud(ctx, x, y, scale = 1) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(x, y, 25 * scale, 0, Math.PI * 2);
        ctx.arc(x + 25 * scale, y, 30 * scale, 0, Math.PI * 2);
        ctx.arc(x + 50 * scale, y, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * LIGHT SOURCE ILLUSTRATIONS
     */

    createCandleIllustration() {
        const svg = this.createSVG(100, 150, 'light-source-illustration');
        
        // Candle wax
        const candle = document.createElementNS(this.svgNS, 'ellipse');
        candle.setAttribute('cx', '50');
        candle.setAttribute('cy', '100');
        candle.setAttribute('rx', '25');
        candle.setAttribute('ry', '35');
        candle.setAttribute('fill', '#F5E6D3');
        svg.appendChild(candle);

        // Wick
        const wick = document.createElementNS(this.svgNS, 'rect');
        wick.setAttribute('x', '47');
        wick.setAttribute('y', '50');
        wick.setAttribute('width', '6');
        wick.setAttribute('height', '50');
        wick.setAttribute('fill', '#3D2817');
        svg.appendChild(wick);

        // Flame (will be animated)
        const flame = document.createElementNS(this.svgNS, 'path');
        flame.setAttribute('d', 'M 50 45 Q 45 20 50 10 Q 55 20 50 45 Z');
        flame.setAttribute('fill', '#FFD93D');
        flame.setAttribute('class', 'flame');
        svg.appendChild(flame);

        return svg;
    }

    createLampIllustration() {
        const svg = this.createSVG(120, 150, 'light-source-illustration');

        // Pole
        const pole = document.createElementNS(this.svgNS, 'rect');
        pole.setAttribute('x', '55');
        pole.setAttribute('y', '80');
        pole.setAttribute('width', '10');
        pole.setAttribute('height', '70');
        pole.setAttribute('fill', '#333333');
        svg.appendChild(pole);

        // Lamp head
        const lampHead = document.createElementNS(this.svgNS, 'ellipse');
        lampHead.setAttribute('cx', '60');
        lampHead.setAttribute('cy', '70');
        lampHead.setAttribute('rx', '35');
        lampHead.setAttribute('ry', '30');
        lampHead.setAttribute('fill', '#555555');
        svg.appendChild(lampHead);

        // Glass
        const glass = document.createElementNS(this.svgNS, 'ellipse');
        glass.setAttribute('cx', '60');
        glass.setAttribute('cy', '70');
        glass.setAttribute('rx', '28');
        glass.setAttribute('ry', '24');
        glass.setAttribute('fill', 'rgba(255, 200, 0, 0.3)');
        glass.setAttribute('class', 'lamp-glass');
        svg.appendChild(glass);

        return svg;
    }

    createFlashlightIllustration() {
        const svg = this.createSVG(100, 130, 'light-source-illustration');

        // Handle
        const handle = document.createElementNS(this.svgNS, 'rect');
        handle.setAttribute('x', '35');
        handle.setAttribute('y', '60');
        handle.setAttribute('width', '30');
        handle.setAttribute('height', '50');
        handle.setAttribute('rx', '5');
        handle.setAttribute('fill', '#333333');
        svg.appendChild(handle);

        // Head
        const head = document.createElementNS(this.svgNS, 'circle');
        head.setAttribute('cx', '50');
        head.setAttribute('cy', '50');
        head.setAttribute('r', '20');
        head.setAttribute('fill', '#444444');
        svg.appendChild(head);

        // Lens
        const lens = document.createElementNS(this.svgNS, 'circle');
        lens.setAttribute('cx', '50');
        lens.setAttribute('cy', '50');
        lens.setAttribute('r', '16');
        lens.setAttribute('fill', 'rgba(200, 220, 255, 0.4)');
        svg.appendChild(lens);

        return svg;
    }

    createSunIllustration() {
        const svg = this.createSVG(140, 140, 'light-source-illustration');

        // Glow
        const glow = document.createElementNS(this.svgNS, 'circle');
        glow.setAttribute('cx', '70');
        glow.setAttribute('cy', '70');
        glow.setAttribute('r', '65');
        glow.setAttribute('fill', 'rgba(255, 200, 0, 0.2)');
        svg.appendChild(glow);

        // Sun body
        const sun = document.createElementNS(this.svgNS, 'circle');
        sun.setAttribute('cx', '70');
        sun.setAttribute('cy', '70');
        sun.setAttribute('r', '45');
        sun.setAttribute('fill', '#FFD93D');
        svg.appendChild(sun);

        // Rays
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const startX = 70 + Math.cos(angle) * 50;
            const startY = 70 + Math.sin(angle) * 50;
            const endX = 70 + Math.cos(angle) * 70;
            const endY = 70 + Math.sin(angle) * 70;

            const ray = document.createElementNS(this.svgNS, 'line');
            ray.setAttribute('x1', startX);
            ray.setAttribute('y1', startY);
            ray.setAttribute('x2', endX);
            ray.setAttribute('y2', endY);
            ray.setAttribute('stroke', '#FFD93D');
            ray.setAttribute('stroke-width', '6');
            ray.setAttribute('stroke-linecap', 'round');
            svg.appendChild(ray);
        }

        return svg;
    }

    createFireIllustration() {
        const svg = this.createSVG(100, 120, 'light-source-illustration');

        // Log base
        const log1 = document.createElementNS(this.svgNS, 'ellipse');
        log1.setAttribute('cx', '35');
        log1.setAttribute('cy', '90');
        log1.setAttribute('rx', '25');
        log1.setAttribute('ry', '15');
        log1.setAttribute('fill', '#5C4033');
        svg.appendChild(log1);

        const log2 = document.createElementNS(this.svgNS, 'ellipse');
        log2.setAttribute('cx', '65');
        log2.setAttribute('cy', '85');
        log2.setAttribute('rx', '28');
        log2.setAttribute('ry', '12');
        log2.setAttribute('fill', '#4A3728');
        svg.appendChild(log2);

        // Flames
        const flameColors = ['#FF6B6B', '#FFD93D', '#FF9F1C'];
        const flames = [
            { cx: 30, cy: 50, rx: 15, ry: 35 },
            { cx: 50, cy: 30, rx: 18, ry: 45 },
            { cx: 70, cy: 45, rx: 16, ry: 38 },
        ];

        flames.forEach((f, i) => {
            const flame = document.createElementNS(this.svgNS, 'ellipse');
            flame.setAttribute('cx', f.cx);
            flame.setAttribute('cy', f.cy);
            flame.setAttribute('rx', f.rx);
            flame.setAttribute('ry', f.ry);
            flame.setAttribute('fill', flameColors[i]);
            flame.setAttribute('class', 'fire-flame');
            svg.appendChild(flame);
        });

        return svg;
    }

    /**
     * Draw light glow effect over a canvas
     */
    drawLightGlow(ctx, x, y, intensity = 1) {
        const maxRadius = 150 * intensity;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, maxRadius);
        gradient.addColorStop(0, 'rgba(255, 217, 61, 0.6)');
        gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x - maxRadius, y - maxRadius, maxRadius * 2, maxRadius * 2);
    }

    /**
     * Draw beam of light (for flashlight)
     */
    drawLightBeam(ctx, startX, startY, angle, length, width) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = 'rgba(255, 217, 61, 0.6)';

        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX - Math.sin(angle) * width, endY + Math.cos(angle) * width);
        ctx.lineTo(endX + Math.sin(angle) * width, endY - Math.cos(angle) * width);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    /**
     * Create particles for light effects
     */
    createParticles(x, y, count = 10, color = '#FFD93D') {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                color,
            });
        }
        return particles;
    }

    /**
     * Update and draw particles
     */
    updateParticles(particles, ctx) {
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 0.02;

            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        return particles;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Graphics;
}
