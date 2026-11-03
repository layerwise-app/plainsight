/**
 * A small 3D toolkit for drawing packaging on a tabletop: a perspective
 * camera, a low sun, and shadows cast onto the table and the wall behind it.
 * World units are millimetres; x runs right, y away from the camera, z up.
 */
export type V3 = [number, number, number];
export type V2 = [number, number];

export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a: V3): V3 => scale(a, 1 / Math.hypot(a[0], a[1], a[2]));

export type Camera = {
  project: (p: V3) => V2;
  eye: V3;
  /** Distance along the view direction, for sorting. */
  depth: (p: V3) => number;
};

export function camera({
  eye,
  target,
  focal,
  center
}: {
  eye: V3;
  target: V3;
  focal: number;
  center: V2;
}): Camera {
  const f = norm(sub(target, eye));
  const r = norm(cross(f, [0, 0, 1]));
  const u = cross(r, f);
  return {
    eye,
    depth: (p) => dot(sub(p, eye), f),
    project(p) {
      const d = sub(p, eye);
      const z = dot(d, f);
      return [center[0] + (focal * dot(d, r)) / z, center[1] - (focal * dot(d, u)) / z];
    }
  };
}

/** Direction towards the sun. Azimuth 0 is from the left, 90° from the camera. */
export function sun(azimuthDeg: number, elevationDeg: number): V3 {
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  return norm([-Math.cos(el) * Math.cos(az), -Math.cos(el) * Math.sin(az), Math.sin(el)]);
}

export type Plane = { point: V3; normal: V3 };
export const TABLE: Plane = { point: [0, 0, 0], normal: [0, 0, 1] };
export const wall = (y: number): Plane => ({ point: [0, y, 0], normal: [0, -1, 0] });

/** Where the shadow of `p` lands on `plane`, travelling away from the sun. */
export function castOnto(p: V3, light: V3, plane: Plane): V3 {
  const dir = scale(light, -1);
  const denom = dot(dir, plane.normal);
  if (Math.abs(denom) < 1e-6) return p;
  const t = dot(sub(plane.point, p), plane.normal) / denom;
  return add(p, scale(dir, Math.max(0, t)));
}

/** Rotate around z, then move. */
export function place(at: V3, yaw: number) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return (p: V3): V3 => [at[0] + p[0] * c - p[1] * s, at[1] + p[0] * s + p[1] * c, at[2] + p[2]];
}

export const turn = (yaw: number) => {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return (n: V3): V3 => [n[0] * c - n[1] * s, n[0] * s + n[1] * c, n[2]];
};

export const path = (points: V2[], close = true) =>
  `${points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join('')}${close ? 'Z' : ''}`;

/** Lambert light on a surface, with a floor of ambient light. */
export const lambert = (normal: V3, light: V3, ambient = 0.34) => ambient + (1 - ambient) * Math.max(0, dot(norm(normal), light));

/**
 * The affine map that puts a flat w × h artwork onto three projected
 * corners: top-left, top-right, bottom-left.
 */
export function affine(tl: V2, tr: V2, bl: V2, w: number, h: number) {
  const a = (tr[0] - tl[0]) / w;
  const b = (tr[1] - tl[1]) / w;
  const c = (bl[0] - tl[0]) / h;
  const d = (bl[1] - tl[1]) / h;
  return `matrix(${a.toFixed(5)} ${b.toFixed(5)} ${c.toFixed(5)} ${d.toFixed(5)} ${tl[0].toFixed(2)} ${tl[1].toFixed(2)})`;
}

/** A face of an object, in world space, for casting its shadow. */
export type Face = V3[];

/** Convex hull of 2D points (monotone chain). */
export function hull(points: V2[]): V2[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const crossZ = (o: V2, a: V2, b: V2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: V2[] = [];
  for (const pt of p) {
    while (lower.length >= 2 && crossZ(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) lower.pop();
    lower.push(pt);
  }
  const upper: V2[] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const pt = p[i];
    while (upper.length >= 2 && crossZ(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) upper.pop();
    upper.push(pt);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

/** Hex colour helpers. */
const toRgb = (hex: string): V3 => {
  const h = hex.replace('#', '');
  return [Number.parseInt(h.slice(0, 2), 16), Number.parseInt(h.slice(2, 4), 16), Number.parseInt(h.slice(4, 6), 16)];
};
const toHex = ([r, g, b]: V3) =>
  `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;

export const mix = (a: string, b: string, t: number) => {
  const x = toRgb(a);
  const y = toRgb(b);
  return toHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
};

export const multiply = (a: string, b: string) => {
  const x = toRgb(a);
  const y = toRgb(b);
  return toHex([(x[0] * y[0]) / 255, (x[1] * y[1]) / 255, (x[2] * y[2]) / 255]);
};

/** The warm light colour a surface turns at a given light level (0–1). */
export const lightAt = (level: number, shade = '#6c5546', sunColour = '#fff6e8') =>
  level <= 0.5 ? mix(shade, '#ffffff', level / 0.5) : mix('#ffffff', sunColour, (level - 0.5) / 0.5);
