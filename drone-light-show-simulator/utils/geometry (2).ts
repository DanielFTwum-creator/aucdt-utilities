
import { ShapeSegment } from '../data/shapes';
import { POINTS_PER_LENGTH_UNIT } from '../data/constants';

type Point = { x: number; y: number; color?: string };

export const generateShapePoints = (
    segments: ShapeSegment[],
    scaleX: number,
    scaleY: number,
    offsetX: number,
    offsetY: number
): Point[] => {
    const points: Point[] = [];

    segments.forEach(segment => {
        if (segment.type === 'line' && segment.points) {
            const [start, end] = segment.points;
            const length = Math.hypot(end.x - start.x, end.y - start.y);
            const numPoints = Math.ceil(length * scaleX * POINTS_PER_LENGTH_UNIT);

            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                points.push({
                    x: (start.x + (end.x - start.x) * t) * scaleX + offsetX,
                    y: (start.y + (end.y - start.y) * t) * scaleY + offsetY,
                    color: segment.color,
                });
            }
        } else if (segment.type === 'arc' && segment.center && segment.radius && segment.startAngle !== undefined && segment.endAngle !== undefined) {
            const { center, radius, startAngle, endAngle, anticlockwise = false } = segment;
            const arcLength = radius * Math.abs(endAngle - startAngle);
            const numPoints = Math.ceil(arcLength * scaleX * POINTS_PER_LENGTH_UNIT);

            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                const angle = startAngle + (endAngle - startAngle) * t;

                points.push({
                    x: (center.x + radius * Math.cos(angle)) * scaleX + offsetX,
                    y: (center.y + radius * Math.sin(angle)) * scaleY + offsetY,
                    color: segment.color,
                });
            }
        }
    });

    return points;
};
