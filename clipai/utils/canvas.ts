import { ShapeId, MediaSource, OutlineStyle } from '../types';

const createHeartPath = (x: number, y: number, width: number, height: number): Path2D => {
    const path = new Path2D();
    const topCurveHeight = height * 0.3;
    path.moveTo(x, y + topCurveHeight);
    path.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight);
    path.bezierCurveTo(x - width / 2, y + (height + topCurveHeight) / 2, x, y + (height + topCurveHeight) / 2, x, y + height);
    path.bezierCurveTo(x, y + (height + topCurveHeight) / 2, x + width / 2, y + (height + topCurveHeight) / 2, x + width / 2, y + topCurveHeight);
    path.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);
    path.closePath();
    return path;
};

const createStarPath = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): Path2D => {
    const path = new Path2D();
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    path.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        path.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        path.lineTo(x, y);
        rot += step;
    }
    path.closePath();
    return path;
};

const createPolygonPath = (x: number, y: number, radius: number, sides: number, rotationOffset: number = 0): Path2D => {
    const path = new Path2D();
    path.moveTo(x + radius * Math.cos(rotationOffset), y + radius * Math.sin(rotationOffset));
    for (let i = 1; i <= sides; i++) {
        path.lineTo(
            x + radius * Math.cos((i * 2 * Math.PI) / sides + rotationOffset),
            y + radius * Math.sin((i * 2 * Math.PI) / sides + rotationOffset)
        );
    }
    path.closePath();
    return path;
};


const createDiamondPath = (x: number, y: number, width: number, height: number): Path2D => {
    const path = new Path2D();
    path.moveTo(x, y - height / 2);
    path.lineTo(x + width / 2, y);
    path.lineTo(x, y + height / 2);
    path.lineTo(x - width / 2, y);
    path.closePath();
    return path;
};

const createTrianglePath = (size: number): Path2D => {
    const path = new Path2D();
    const height = size * (Math.sqrt(3) / 2);
    const yOffset = (size - height) / 2;
    path.moveTo(size / 2, yOffset);
    path.lineTo(0, yOffset + height);
    path.lineTo(size, yOffset + height);
    path.closePath();
    return path;
};

const createArrowPath = (size: number): Path2D => {
    const path = new Path2D();
    const scale = size / 24;
    path.moveTo(14 * scale, 4 * scale);
    path.lineTo(22 * scale, 12 * scale);
    path.lineTo(14 * scale, 20 * scale);
    path.lineTo(14 * scale, 15 * scale);
    path.lineTo(4 * scale, 15 * scale);
    path.lineTo(4 * scale, 9 * scale);
    path.lineTo(14 * scale, 9 * scale);
    path.closePath();
    return path;
};

const createCrossPath = (size: number): Path2D => {
    const path = new Path2D();
    const scale = size / 24;
    path.moveTo(10 * scale, 3 * scale); path.lineTo(14 * scale, 3 * scale);
    path.lineTo(14 * scale, 10 * scale); path.lineTo(21 * scale, 10 * scale);
    path.lineTo(21 * scale, 14 * scale); path.lineTo(14 * scale, 14 * scale);
    path.lineTo(14 * scale, 21 * scale); path.lineTo(10 * scale, 21 * scale);
    path.lineTo(10 * scale, 14 * scale); path.lineTo(3 * scale, 14 * scale);
    path.lineTo(3 * scale, 10 * scale); path.lineTo(10 * scale, 10 * scale);
    path.closePath();
    return path;
};

const createDropletPath = (size: number): Path2D => {
    const path = new Path2D();
    const scale = size / 24;
    const x = 12 * scale, y = 14 * scale, r = 8 * scale, topX = 12 * scale, topY = 2 * scale;
    path.arc(x, y, r, (1 / 180) * Math.PI, (179 / 180) * Math.PI, true);
    path.quadraticCurveTo(3 * scale, 7 * scale, topX, topY);
    path.quadraticCurveTo(21 * scale, 7 * scale, x + r, y);
    path.closePath();
    return path;
};

const createBubblePath = (size: number): Path2D => {
    const path = new Path2D();
    const scale = size / 24;
    path.moveTo(5 * scale, 3 * scale); path.lineTo(19 * scale, 3 * scale);
    path.quadraticCurveTo(21 * scale, 3 * scale, 21 * scale, 5 * scale);
    path.lineTo(21 * scale, 15 * scale);
    path.quadraticCurveTo(21 * scale, 17 * scale, 19 * scale, 17 * scale);
    path.lineTo(7 * scale, 17 * scale); path.lineTo(3 * scale, 21 * scale);
    path.lineTo(3 * scale, 5 * scale);
    path.quadraticCurveTo(3 * scale, 3 * scale, 5 * scale, 3 * scale);
    path.closePath();
    return path;
};

const createCloudPath = (size: number): Path2D => {
    const s = size / 24;
    const path = new Path2D();
    path.moveTo(19.35 * s, 10.04 * s);
    path.bezierCurveTo(18.67 * s, 6.59 * s, 15.64 * s, 4 * s, 12 * s, 4 * s);
    path.bezierCurveTo(9.11 * s, 4 * s, 6.6 * s, 5.64 * s, 5.35 * s, 8.04 * s);
    path.bezierCurveTo(2.34 * s, 8.36 * s, 0 * s, 10.91 * s, 0 * s, 14 * s);
    path.bezierCurveTo(0 * s, 17.31 * s, 2.69 * s, 20 * s, 6 * s, 20 * s);
    path.lineTo(19 * s, 20 * s);
    path.bezierCurveTo(21.76 * s, 20 * s, 24 * s, 17.76 * s, 24 * s, 15 * s);
    path.bezierCurveTo(24 * s, 12.36 * s, 21.95 * s, 10.22 * s, 19.35 * s, 10.04 * s);
    path.closePath();
    return path;
};

const createFlagPath = (size: number): Path2D => {
    const s = size / 24;
    const path = new Path2D();
    path.moveTo(14.4 * s, 6 * s);
    path.lineTo(14 * s, 4 * s);
    path.lineTo(5 * s, 4 * s);
    path.lineTo(5 * s, 21 * s);
    path.lineTo(7 * s, 21 * s);
    path.lineTo(7 * s, 14 * s);
    path.lineTo(12.6 * s, 14 * s);
    path.lineTo(13 * s, 16 * s);
    path.lineTo(20 * s, 16 * s);
    path.lineTo(20 * s, 6 * s);
    path.closePath();
    return path;
};

const createMoonPath = (size: number): Path2D => {
    const path = new Path2D();
    const s = size / 24;
    const cx = 13 * s;
    const cy = 12 * s;
    const r = 10 * s;
    path.arc(cx, cy, r, Math.PI * 1.5, Math.PI * 0.5, true);
    const innerRadius = 8 * s;
    const innerOffsetX = 5 * s;
    path.arc(cx - innerOffsetX, cy, innerRadius, Math.PI * 0.5, Math.PI * 1.5, false);
    path.closePath();
    return path;
};

const getGeometricShapePath = (selectedShape: ShapeId, size: number): Path2D | undefined => {
    switch (selectedShape) {
        case 'circle': return createPolygonPath(size / 2, size / 2, size / 2, 60); // Approximation
        case 'square': { const p = new Path2D(); p.rect(0, 0, size, size); return p; }
        case 'heart': return createHeartPath(size / 2, size / 4, size / 2, size * 0.7);
        case 'star': return createStarPath(size / 2, size / 2, 5, size / 2, size / 4);
        case 'hexagon': return createPolygonPath(size / 2, size / 2, size / 2, 6, Math.PI / 6);
        case 'diamond': return createDiamondPath(size / 2, size / 2, size, size);
        case 'pentagon': return createPolygonPath(size / 2, size / 2, size / 2, 5, -Math.PI / 10);
        case 'triangle': return createTrianglePath(size);
        case 'arrow': return createArrowPath(size);
        case 'cross': return createCrossPath(size);
        case 'droplet': return createDropletPath(size);
        case 'bubble': return createBubblePath(size);
        case 'cloud': return createCloudPath(size);
        case 'flag': return createFlagPath(size);
        case 'sun': return createStarPath(size / 2, size / 2, 8, size / 2, size / 2.5);
        case 'moon': return createMoonPath(size);
        default: return undefined;
    }
};

const getFinalPath = (selectedShape: ShapeId, size: number, customSvgPath: string | null): Path2D => {
    const geometricPath = getGeometricShapePath(selectedShape, size);
    if (geometricPath) {
        return geometricPath;
    }
    
    if (customSvgPath) {
        try {
            return new Path2D(customSvgPath);
        } catch (e) {
            console.error("Invalid SVG Path Data provided:", e);
            return new Path2D();
        }
    }
    
    return new Path2D();
};

const createTexturePattern = (
    ctx: CanvasRenderingContext2D,
    media: MediaSource, 
    size: number,
    zoom: number,
    offset: { x: number; y: number; }
): CanvasPattern | null => {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (!offscreenCtx) return null;

    let mediaWidth, mediaHeight;
    if (media instanceof HTMLVideoElement) {
        mediaWidth = media.videoWidth;
        mediaHeight = media.videoHeight;
    } else {
        mediaWidth = media.naturalWidth;
        mediaHeight = media.naturalHeight;
    }

    offscreenCtx.save();
    offscreenCtx.translate(size / 2 + offset.x, size / 2 + offset.y);
    offscreenCtx.scale(zoom, zoom);
    offscreenCtx.drawImage(media, -mediaWidth / 2, -mediaHeight / 2, mediaWidth, mediaHeight);
    offscreenCtx.restore();
    
    return ctx.createPattern(offscreenCanvas, 'no-repeat');
};

const drawInteractionView = (
    ctx: CanvasRenderingContext2D,
    path: Path2D,
    clippingMode: 'fill' | 'outline',
    outlineThickness: number,
    drawTransformedImage: () => void
) => {
    ctx.globalAlpha = 0.4;
    drawTransformedImage();
    ctx.globalAlpha = 1.0;

    ctx.save();
    ctx.strokeStyle = 'rgba(139, 92, 246, 1)';
    ctx.lineWidth = clippingMode === 'outline' ? outlineThickness : 3;
    if (clippingMode === 'fill') {
        ctx.setLineDash([8, 4]);
    }
    ctx.stroke(path);
    ctx.restore();
};

export const drawClippedImage = (
    canvas: HTMLCanvasElement,
    mediaSource: MediaSource | null,
    selectedShape: ShapeId,
    clippingMode: 'fill' | 'outline',
    outlineOptions: { color: string; thickness: number; style: OutlineStyle },
    zoom: number,
    offset: { x: number; y: number; },
    isInteracting: boolean,
    customSvgPath: string | null
) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 500;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const drawTransformedImage = () => {
        if (!mediaSource) return;
        let mediaWidth, mediaHeight;
        if (mediaSource instanceof HTMLVideoElement) {
            mediaWidth = mediaSource.videoWidth;
            mediaHeight = mediaSource.videoHeight;
        } else {
            mediaWidth = mediaSource.naturalWidth;
            mediaHeight = mediaSource.naturalHeight;
        }

        ctx.save();
        ctx.translate(size / 2 + offset.x, size / 2 + offset.y);
        ctx.scale(zoom, zoom);
        ctx.drawImage(mediaSource, -mediaWidth / 2, -mediaHeight / 2, mediaWidth, mediaHeight);
        ctx.restore();
    };

    const path = getFinalPath(selectedShape, size, customSvgPath);

    if (isInteracting && mediaSource) {
        drawInteractionView(ctx, path, clippingMode, outlineOptions.thickness, drawTransformedImage);
        return;
    }
    
    ctx.save();
    if (clippingMode === 'fill') {
        ctx.clip(path);
        drawTransformedImage();
    } else { // Outline mode
        if (mediaSource && outlineOptions.style === 'texture') {
            const pattern = createTexturePattern(ctx, mediaSource, size, zoom, offset);
            ctx.strokeStyle = pattern || outlineOptions.color; // Fallback to solid color
        } else {
            ctx.strokeStyle = outlineOptions.color;
        }
        ctx.lineWidth = outlineOptions.thickness;
        ctx.stroke(path);
    }
    ctx.restore();
};