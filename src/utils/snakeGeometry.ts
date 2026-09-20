import { Direction, GridCoord } from '../types';
import { DIR_VECTORS } from './levels';

export interface PixelPoint {
  x: number;
  y: number;
}

/**
 * Converts grid coordinates to pixel center coordinates
 */
export function gridToPixelPoints(points: GridCoord[], cellSize: number): PixelPoint[] {
  return points.map((p) => ({
    x: p.c * cellSize + cellSize / 2,
    y: p.r * cellSize + cellSize / 2,
  }));
}

/**
 * Computes total length and cumulative lengths of a polyline
 */
export function getPolylineLengths(pts: PixelPoint[]): { total: number; cum: number[] } {
  const cum = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    total += Math.hypot(dx, dy);
    cum.push(total);
  }
  return { total, cum };
}

/**
 * Samples a point along a polyline at a given distance
 */
export function samplePolyline(
  pts: PixelPoint[],
  cum: number[],
  dist: number
): { point: PixelPoint; tangent: PixelPoint; segmentIndex: number } {
  if (pts.length === 0) {
    return { point: { x: 0, y: 0 }, tangent: { x: 1, y: 0 }, segmentIndex: 0 };
  }
  if (pts.length === 1 || dist <= 0) {
    const tangent =
      pts.length > 1
        ? {
            x: pts[1].x - pts[0].x,
            y: pts[1].y - pts[0].y,
          }
        : { x: 1, y: 0 };
    const len = Math.hypot(tangent.x, tangent.y) || 1;
    return { point: { ...pts[0] }, tangent: { x: tangent.x / len, y: tangent.y / len }, segmentIndex: 0 };
  }

  const total = cum[cum.length - 1];
  if (dist >= total) {
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    const tangent = { x: last.x - prev.x, y: last.y - prev.y };
    const len = Math.hypot(tangent.x, tangent.y) || 1;
    return { point: { ...last }, tangent: { x: tangent.x / len, y: tangent.y / len }, segmentIndex: pts.length - 2 };
  }

  // Binary search or linear search for segment
  let seg = 0;
  while (seg < cum.length - 1 && cum[seg + 1] < dist) {
    seg++;
  }

  const segStart = cum[seg];
  const segEnd = cum[seg + 1];
  const segLen = segEnd - segStart;
  const ratio = segLen > 0 ? (dist - segStart) / segLen : 0;

  const p0 = pts[seg];
  const p1 = pts[seg + 1];

  const point: PixelPoint = {
    x: p0.x + (p1.x - p0.x) * ratio,
    y: p0.y + (p1.y - p0.y) * ratio,
  };

  const tan = { x: p1.x - p0.x, y: p1.y - p0.y };
  const tanLen = Math.hypot(tan.x, tan.y) || 1;
  const tangent = { x: tan.x / tanLen, y: tan.y / tanLen };

  return { point, tangent, segmentIndex: seg };
}

/**
 * Extracts a sub-polyline between startDist and endDist along the polyline
 */
export function slicePolyline(
  pts: PixelPoint[],
  startDist: number,
  endDist: number
): { points: PixelPoint[]; headTangent: PixelPoint } {
  if (pts.length < 2 || startDist >= endDist) {
    return { points: [], headTangent: { x: 1, y: 0 } };
  }

  const { total, cum } = getPolylineLengths(pts);
  const clampedStart = Math.max(0, Math.min(startDist, total));
  const clampedEnd = Math.max(clampedStart, Math.min(endDist, total));

  if (clampedEnd - clampedStart < 1) {
    return { points: [], headTangent: { x: 1, y: 0 } };
  }

  const startSample = samplePolyline(pts, cum, clampedStart);
  const endSample = samplePolyline(pts, cum, clampedEnd);

  const sliced: PixelPoint[] = [{ ...startSample.point }];

  for (let i = 1; i < pts.length - 1; i++) {
    if (cum[i] > clampedStart + 0.5 && cum[i] < clampedEnd - 0.5) {
      sliced.push({ ...pts[i] });
    }
  }

  sliced.push({ ...endSample.point });

  return { points: sliced, headTangent: endSample.tangent };
}

/**
 * Builds extended exit path for snake slithering
 */
export function buildExtendedSnakePath(
  gridPoints: GridCoord[],
  dir: Direction,
  cellSize: number,
  exitDist = 1200
): PixelPoint[] {
  const pixelPts = gridToPixelPoints(gridPoints, cellSize);
  if (pixelPts.length === 0) return [];

  const head = pixelPts[pixelPts.length - 1];
  const { dr, dc } = DIR_VECTORS[dir];

  const extendedHead: PixelPoint = {
    x: head.x + dc * exitDist,
    y: head.y + dr * exitDist,
  };

  return [...pixelPts, extendedHead];
}

/**
 * Builds smooth rounded path for pixel coordinates
 */
export function buildFilletedPixelPath(pts: PixelPoint[], cornerRadius = 12): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  let d = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const next = pts[i + 1];

    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const len1 = Math.hypot(v1x, v1y);

    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const len2 = Math.hypot(v2x, v2y);

    if (len1 < 1 || len2 < 1) {
      d += ` L ${curr.x} ${curr.y}`;
      continue;
    }

    const u1x = v1x / len1;
    const u1y = v1y / len1;
    const u2x = v2x / len2;
    const u2y = v2y / len2;

    const r = Math.min(cornerRadius, len1 / 2, len2 / 2);

    const startX = curr.x - u1x * r;
    const startY = curr.y - u1y * r;
    const endX = curr.x + u2x * r;
    const endY = curr.y + u2y * r;

    d += ` L ${startX} ${startY}`;
    d += ` Q ${curr.x} ${curr.y} ${endX} ${endY}`;
  }

  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
}

/**
 * Builds arrowhead path at arbitrary tip coordinate and tangent angle.
 * Creates a sleek, aerodynamic filled arrowhead with curved base.
 */
export function buildArrowHeadAtPoint(
  tip: PixelPoint,
  tangent: PixelPoint,
  size = 14
): string {
  const tx = tangent.x;
  const ty = tangent.y;
  const perpX = -ty;
  const perpY = tx;

  // Slightly extend tip forward for sharp, crisp directionality
  const tipX = tip.x + tx * (size * 0.2);
  const tipY = tip.y + ty * (size * 0.2);

  const backX = tip.x - tx * (size * 0.85);
  const backY = tip.y - ty * (size * 0.85);

  const wing1X = backX + perpX * (size * 0.65);
  const wing1Y = backY + perpY * (size * 0.65);

  const wing2X = backX - perpX * (size * 0.65);
  const wing2Y = backY - perpY * (size * 0.65);

  // Sleek aerodynamic arrow head with slight inner curve at back
  const innerBackX = tip.x - tx * (size * 0.65);
  const innerBackY = tip.y - ty * (size * 0.65);

  return `M ${tipX} ${tipY} L ${wing1X} ${wing1Y} Q ${innerBackX} ${innerBackY} ${wing2X} ${wing2Y} Z`;
}

