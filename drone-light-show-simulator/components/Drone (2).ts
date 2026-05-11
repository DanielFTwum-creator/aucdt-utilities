
import { COLORS, DISPLAY_DURATION, JITTER_AMOUNT } from '../data/constants';

export class Drone {
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    targetX: number;
    targetY: number;
    africanTargetX: number;
    africanTargetY: number;
    africanTextTargetX: number;
    africanTextTargetY: number;
    color: string;
    africanColor: string;
    africanTextColor: string;
    drawColor: string;
    size: number;
    alpha: number;
    culminationPhaseDuration: number;

    constructor(
        initialX: number, initialY: number,
        targetX: number, targetY: number,
        africanTargetX: number, africanTargetY: number,
        africanTextTargetX: number, africanTextTargetY: number,
        color: string, africanColor: string, africanTextColor: string
    ) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.x = initialX;
        this.y = initialY;

        this.targetX = targetX + (Math.random() - 0.5) * JITTER_AMOUNT;
        this.targetY = targetY + (Math.random() - 0.5) * JITTER_AMOUNT;

        this.africanTargetX = africanTargetX;
        this.africanTargetY = africanTargetY;
        
        this.africanTextTargetX = africanTextTargetX;
        this.africanTextTargetY = africanTextTargetY;

        this.color = color;
        this.africanColor = africanColor;
        this.africanTextColor = africanTextColor;
        this.drawColor = COLORS.pureWhite;

        this.size = 1;
        this.alpha = 0;
        this.culminationPhaseDuration = 5000; // 5 seconds
    }

    private lerp(start: number, end: number, t: number): number {
        return start * (1 - t) + end * t;
    }

    private interpolateColor(color1: string, color2: string, factor: number): string {
        const c1 = { r: parseInt(color1.slice(1, 3), 16), g: parseInt(color1.slice(3, 5), 16), b: parseInt(color1.slice(5, 7), 16) };
        const c2 = { r: parseInt(color2.slice(1, 3), 16), g: parseInt(color2.slice(3, 5), 16), b: parseInt(color2.slice(5, 7), 16) };
        const r = Math.round(this.lerp(c1.r, c2.r, factor));
        const g = Math.round(this.lerp(c1.g, c2.g, factor));
        const b = Math.round(this.lerp(c1.b, c2.b, factor));
        return `rgb(${r},${g},${b})`;
    }

    update(currentTime: number, animationStartTime: number): void {
        const elapsedTime = currentTime - animationStartTime;
        const totalDuration = DISPLAY_DURATION;
        let progress = elapsedTime / totalDuration;

        // Phase timings
        const phase1End = 10000;
        const phase2End = 12000;
        const phase3End = 22000;
        const phase4End = 24000;
        const phase5End = 40000;
        const phase6End = 45000;

        if (elapsedTime <= phase1End) { // 0-10s: Scatter to Africa Outline
            const phaseProgress = elapsedTime / phase1End;
            this.x = this.lerp(this.initialX, this.africanTargetX, phaseProgress);
            this.y = this.lerp(this.initialY, this.africanTargetY, phaseProgress);
            this.drawColor = this.interpolateColor(COLORS.pureWhite, this.africanColor, phaseProgress);
            this.alpha = this.lerp(0, 1, phaseProgress);
            this.size = 1.5;

        } else if (elapsedTime <= phase2End) { // 10-12s: Hold Africa Outline
            this.x = this.africanTargetX;
            this.y = this.africanTargetY;
            this.drawColor = this.africanColor;
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase3End) { // 12-22s: Form "AFRICA" Text
            const phaseProgress = (elapsedTime - phase2End) / (phase3End - phase2End);
            this.x = this.lerp(this.africanTargetX, this.africanTextTargetX, phaseProgress);
            this.y = this.lerp(this.africanTargetY, this.africanTextTargetY, phaseProgress);
            this.drawColor = this.interpolateColor(this.africanColor, this.africanTextColor, phaseProgress);
            this.alpha = 1;
            this.size = 1.5;
            
        } else if (elapsedTime <= phase4End) { // 22-24s: Hold "AFRICA" Text
            this.x = this.africanTextTargetX;
            this.y = this.africanTextTargetY;
            this.drawColor = this.africanTextColor;
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase5End) { // 24-40s: Africa/Text to Greek Letter
            const phaseProgress = (elapsedTime - phase4End) / (phase5End - phase4End);
            this.x = this.lerp(this.africanTextTargetX, this.targetX, phaseProgress);
            this.y = this.lerp(this.africanTextTargetY, this.targetY, phaseProgress);
            this.drawColor = this.interpolateColor(this.africanTextColor, this.color, phaseProgress);
            this.alpha = 1;
            this.size = 1.5;

        } else if (elapsedTime <= phase6End) { // 40-45s: Culmination Burst and Fade Out
            const phaseProgress = (elapsedTime - phase5End) / (phase6End - phase5End);
            
            // Burst out then shrink
            const burstProgress = Math.min(phaseProgress * 4, 1); // Burst happens in first quarter
            const fadeProgress = Math.max(0, (phaseProgress - 0.25) / 0.75); // Fade happens in last 3/4
            
            this.size = this.lerp(1.5, 5, burstProgress) * (1 - fadeProgress);
            this.alpha = this.lerp(1, 0, fadeProgress);
            this.drawColor = this.interpolateColor(this.color, COLORS.warmGold, burstProgress);

        } else { // After display duration
             this.alpha = 0;
             this.size = 0;
        }

        // Clamp values
        this.alpha = Math.max(0, Math.min(1, this.alpha));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.alpha <= 0) return;

        const scaledSize = this.size * window.devicePixelRatio;

        ctx.beginPath();
        ctx.arc(this.x, this.y, scaledSize, 0, Math.PI * 2, false);
        ctx.fillStyle = this.drawColor;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.drawColor;
        ctx.shadowBlur = scaledSize * 2;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset global alpha
        ctx.shadowBlur = 0; // Reset shadow
    }
}
