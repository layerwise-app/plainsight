import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type * as React from 'react';
import { useInView, usePageVisible, useReducedMotion } from '~/components/case/demo-context';

/*
 * Soft Matter's scene: soft wax and clay drops on a pastel floor, raymarched
 * in one fragment shader with raw WebGL. Drops are spheres blended with a
 * smooth minimum, so they merge and part as they move. Shadows and contact
 * occlusion are analytic per sphere, which keeps the shader cheap: only the
 * box around the drops is raymarched; the rest of the floor is one plane hit.
 */

export type Vec3 = [number, number, number];

/** One drop: centre, radius and colour (sRGB hex). */
export type Drop = { p: Vec3; r: number; color: string };

export type Look = {
  /** Share of light that is diffuse. */
  diffuse: number;
  /** Wrap and warm scatter, the subsurface feel. */
  sss: number;
  /** Specular exponent. */
  gloss: number;
  /** 0 opaque, 1 glass: refraction and coloured shadows. */
  transmission: number;
  spec: number;
  /** Velvet rim, for clay. */
  sheen: number;
  /** Shadow softness; lower is softer. */
  soft: number;
  /** Smooth-minimum radius: how eagerly drops merge. */
  blend: number;
  /** Height of a large drop against its width; 1 is a sphere. */
  sag: number;
};

export type MaterialName = 'clay' | 'wax' | 'glass';

export const LOOKS: Record<MaterialName, Look> = {
  clay: { diffuse: 1, sss: 0.2, gloss: 6, transmission: 0, spec: 0.07, sheen: 0.3, soft: 1.7, blend: 0.3, sag: 0.94 },
  wax: { diffuse: 0.92, sss: 1, gloss: 70, transmission: 0, spec: 0.5, sheen: 0.04, soft: 1.6, blend: 0.38, sag: 0.93 },
  glass: { diffuse: 0.2, sss: 0.25, gloss: 220, transmission: 1, spec: 1.4, sheen: 0, soft: 1.5, blend: 0.26, sag: 0.97 }
};

export type Mood = {
  floor: string;
  /** Haze the floor fades into, top and bottom of the frame. */
  hazeTop: string;
  hazeBottom: string;
  /** Ambient light from above: the colour of the shadows. */
  sky: string;
  sun: Vec3;
  sunColor: string;
  /** Colour light turns as it scatters inside wax. */
  scatter: string;
  fog: number;
  exposure: number;
  /** Radius of the pool of light on the floor. */
  pool: number;
};

export type MoodName = 'studio' | 'peach' | 'dusk';

export const MOODS: Record<MoodName, Mood> = {
  studio: {
    floor: '#F7ECE6',
    hazeTop: '#D9CDF7',
    hazeBottom: '#F3E3DD',
    sky: '#B7A8E8',
    sun: [-0.66, 0.6, -0.26],
    sunColor: '#FFF1E2',
    scatter: '#FF7C5C',
    fog: 0.075,
    exposure: 1,
    pool: 3.6
  },
  peach: {
    floor: '#FFE4D6',
    hazeTop: '#FFC9B4',
    hazeBottom: '#FFE9DE',
    sky: '#E9B2BE',
    sun: [0.58, 0.68, -0.44],
    sunColor: '#FFF4E8',
    scatter: '#FF6A52',
    fog: 0.08,
    exposure: 1,
    pool: 3.4
  },
  dusk: {
    floor: '#4B3BA6',
    hazeTop: '#21194A',
    hazeBottom: '#3A2A8C',
    sky: '#5D4FC4',
    sun: [-0.7, 0.42, -0.58],
    sunColor: '#FFC3A6',
    scatter: '#FF6E58',
    fog: 0.11,
    exposure: 1.15,
    pool: 2.8
  }
};

export type View = {
  eye: Vec3;
  target: Vec3;
  /** Vertical field of view in degrees, at `fit` aspect or wider. */
  fov: number;
  /** Below this width/height the view widens to keep the sides in frame. */
  fit?: number;
};

export type Frame = {
  drops: Drop[];
  look: Look;
  mood: Mood;
  view: View;
  /** A soft light on the floor under a finger or the keyboard drop: x, z, radius, strength. */
  touch?: [number, number, number, number];
  /** Centre of the light pool on the floor. */
  pool?: [number, number];
  grain?: number;
};

export const MAX_DROPS = 8;

const VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define NB ${MAX_DROPS}
uniform vec2 u_res;
uniform vec3 u_eye, u_right, u_up, u_fwd;
uniform float u_zoom;
uniform vec4 u_ball[NB];
uniform vec3 u_col[NB];
uniform vec3 u_bmin, u_bmax;
uniform vec3 u_floor, u_hazeTop, u_hazeBot, u_sky, u_sun, u_sunCol, u_scatter;
uniform vec4 u_mat;   // diffuse, sss, gloss, transmission
uniform vec4 u_mat2;  // spec, sheen, shadow softness, blend
uniform vec4 u_touch; // x, z, radius, strength
uniform vec4 u_fx;    // fog, grain, exposure, pool radius
uniform vec2 u_pool;
uniform float u_fogStart;
uniform float u_sag;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

// Large drops sag under their own weight; small ones stay round.
float sagOf(float r) { return mix(1.0, u_sag, smoothstep(0.12, 0.9, r)); }

// The sphere that stands in for a sagged drop in shadows and occlusion.
vec4 proxy(vec4 b) {
  float s = sagOf(b.w);
  return vec4(b.x, b.y - b.w * (1.0 - s), b.z, b.w * 0.5 * (s + 1.0 / s));
}

float drops(vec3 p) {
  float d = 1e4;
  for (int i = 0; i < NB; i++) {
    vec4 b = u_ball[i];
    float s = sagOf(b.w);
    // Squash towards the bottom, so the drop keeps its footing.
    vec3 q = p - b.xyz + vec3(0.0, b.w * (1.0 - s), 0.0);
    q.y /= s;
    q.xz *= s;
    d = smin(d, (length(q) - b.w) * s, u_mat2.w);
  }
  return d;
}

float map(vec3 p) { return min(drops(p), p.y); }

// Normal of the drops alone: the floor has its own, and mixing the two at the crease sparkles.
vec3 normalAt(vec3 p) {
  vec2 e = vec2(1.0, -1.0) * 0.0018;
  return normalize(e.xyy * drops(p + e.xyy) + e.yyx * drops(p + e.yyx) + e.yxy * drops(p + e.yxy) + e.xxx * drops(p + e.xxx));
}

vec2 boxHit(vec3 ro, vec3 rd) {
  vec3 inv = 1.0 / (rd + vec3(1e-6));
  vec3 t0 = (u_bmin - ro) * inv;
  vec3 t1 = (u_bmax - ro) * inv;
  vec3 a = min(t0, t1);
  vec3 b = max(t0, t1);
  return vec2(max(max(a.x, a.y), a.z), min(min(b.x, b.y), b.z));
}

// Soft shadow of one sphere (after Inigo Quilez), plus a caustic spot for glass.
vec2 sphShadow(vec3 ro, vec3 rd, vec4 s, float k, float fade) {
  vec3 oc = ro - s.xyz;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - s.w * s.w;
  float h = b * b - c;
  if (c < 0.0) return vec2(fade > 0.0 ? 1.0 : 0.0, 0.0);
  float line = sqrt(max(0.0, s.w * s.w - h));
  float t = -b - sqrt(max(h, 0.0));
  if (t < 0.0) return vec2(1.0, 0.0);
  float sh = smoothstep(0.0, 1.0, 2.5 * k * (line - s.w) / max(t, 1e-3));
  sh = mix(1.0, sh, smoothstep(0.0, fade + 1e-4, t));
  float caustic = (1.0 - smoothstep(0.0, 0.55, line / s.w)) * step(0.0, h);
  return vec2(sh, caustic);
}

// Shadows from every drop except skip (a drop's own side is shaded by N·L).
vec3 shadowAt(vec3 p, vec3 l, float fade, int skip) {
  vec3 s = vec3(1.0);
  float caustic = 0.0;
  for (int i = 0; i < NB; i++) {
    if (i == skip) continue;
    vec4 b = proxy(u_ball[i]);
    b.w += 0.03;
    vec2 r = sphShadow(p, l, b, u_mat2.z, fade);
    vec3 tint = u_col[i] * u_mat.w * 0.85;
    s = min(s, mix(tint, vec3(1.0), r.x));
    caustic = max(caustic, r.y);
  }
  return s + caustic * u_mat.w * 0.9 * u_sunCol;
}

float sphOcc(vec3 p, vec3 n, vec4 s) {
  vec3 di = s.xyz - p;
  float l = length(di);
  float nl = dot(n, di / l);
  float h = l / s.w;
  float h2 = h * h;
  float k2 = 1.0 - h2 * nl * nl;
  float res = max(0.0, nl) / h2;
  if (k2 > 0.0) res = pow(clamp(0.5 * (nl * h + 1.0) / h2, 0.0, 1.0), 1.5);
  return res;
}

float occlusion(vec3 p, vec3 n) {
  float o = 1.0;
  for (int i = 0; i < NB; i++) {
    vec4 b = proxy(u_ball[i]);
    b.w += 0.05;
    o *= 1.0 - 0.9 * sphOcc(p, n, b);
  }
  return o;
}

vec3 haze(vec2 uv) {
  return mix(u_hazeBot, u_hazeTop, smoothstep(0.05, 0.95, uv.y));
}

// What reflections see: the floor below, the haze above, one softbox by the sun.
vec3 env(vec3 r) {
  vec3 c = mix(u_floor * (u_sky + u_sunCol * 0.4) * 0.8, u_hazeTop * 1.05, smoothstep(-0.25, 0.35, r.y));
  vec3 a = normalize(cross(u_sun, vec3(0.0, 1.0, 0.0)));
  vec3 b = cross(a, u_sun);
  float z = dot(r, u_sun);
  if (z > 0.0) {
    vec2 q = vec2(dot(r, a), dot(r, b)) / z;
    vec2 d = abs(q) - vec2(0.42, 0.26);
    float box = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - 0.08;
    c += u_sunCol * (1.0 - smoothstep(-0.04, 0.06, box)) * 2.4;
  }
  return c;
}

vec3 floorLight(vec3 p, vec3 n) {
  vec3 sh = shadowAt(p + n * 0.003, u_sun, 0.0, -1);
  float ao = occlusion(p, n);
  vec2 dp = p.xz - u_pool;
  float pool = exp(-dot(dp, dp) / (u_fx.w * u_fx.w));
  vec3 direct = u_sunCol * max(dot(n, u_sun), 0.0) * sh * (0.5 + 0.5 * pool);
  vec3 c = u_floor * (direct + u_sky * (0.55 + 0.2 * pool) * ao);
  vec2 dt = p.xz - u_touch.xy;
  c += u_floor * u_sunCol * u_touch.w * exp(-dot(dt, dt) / (u_touch.z * u_touch.z)) * 0.32 * ao;
  return c;
}

vec3 albedoAt(vec3 p) {
  vec3 c = vec3(0.0);
  float ws = 0.0;
  for (int i = 0; i < NB; i++) {
    vec4 b = proxy(u_ball[i]);
    float d = max(length(p - b.xyz) - b.w, 0.0);
    float w = exp(-d * 10.0) * step(0.002, b.w);
    c += u_col[i] * w;
    ws += w;
  }
  return c / max(ws, 1e-4);
}

int nearest(vec3 p) {
  int best = 0;
  float bestD = 1e4;
  for (int i = 0; i < NB; i++) {
    vec4 b = proxy(u_ball[i]);
    float d = length(p - b.xyz) - b.w;
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

vec3 shadeDrop(vec3 p, vec3 n, vec3 rd) {
  vec3 alb = albedoAt(p);
  vec3 l = u_sun;
  vec3 v = -rd;
  float ndl = dot(n, l);
  vec3 sh = shadowAt(p + n * 0.01, l, 0.3, nearest(p));
  float ao = occlusion(p, n);
  float wrap = 0.2 + 0.7 * u_mat.y;
  float dif = clamp((ndl + wrap) / (1.0 + wrap), 0.0, 1.0);
  float lit = clamp(ndl, 0.0, 1.0);
  vec3 scatter = mix(alb, alb * alb * u_scatter * 1.6, 0.7);
  vec3 bounce = u_floor * (u_sunCol * 0.45 + u_sky * 0.3);
  vec3 hemi = mix(bounce, u_sky, 0.5 + 0.5 * n.y);
  float floorOcc = 1.0 - 0.45 * (1.0 - smoothstep(0.0, 0.5, p.y)) * (0.5 - 0.5 * n.y);
  vec3 col = alb * u_sunCol * sh * dif;
  col += scatter * u_sunCol * sh * max(dif - lit, 0.0) * u_mat.y * 1.8;
  col += alb * hemi * ao * floorOcc;
  col *= u_mat.x;

  // Thin parts let light through: necks between drops and small drops.
  float thick = clamp(-drops(p - n * 0.32) / 0.32, 0.0, 1.0);
  float back = pow(clamp(dot(v, -(l + n * 0.45)), 0.0, 1.0), 2.5);
  col += scatter * u_sunCol * (back * 1.4 + 0.22) * (1.0 - thick) * u_mat.y * mix(vec3(1.0), sh, 0.5);

  float nv = clamp(dot(n, v), 0.0, 1.0);
  float fre = pow(1.0 - nv, 5.0);
  col += u_mat2.y * pow(1.0 - nv, 2.5) * hemi * alb * ao * 1.2;

  vec3 h = normalize(l + v);
  float g = u_mat.z;
  float spec = pow(clamp(dot(n, h), 0.0, 1.0), g) * (g + 2.0) / 8.0;
  vec3 r = reflect(rd, n);
  vec3 refl = env(r);
  col += u_mat2.x * (u_sunCol * spec * sh * lit * 0.6 + refl * (0.04 + 0.96 * fre) * ao);

  if (u_mat.w > 0.0) {
    vec3 rr = refract(rd, n, 0.69);
    vec3 through;
    if (rr.y < -0.02) {
      vec3 fp = p + rr * (-p.y / rr.y);
      through = floorLight(fp, vec3(0.0, 1.0, 0.0));
    } else {
      through = env(rr) * 0.8;
    }
    vec3 tint = mix(vec3(1.0), alb, 0.55 + 0.4 * thick);
    vec3 glass = through * tint * mix(vec3(1.0), alb, 0.35) + alb * hemi * 0.18 * ao;
    glass += refl * (0.05 + 0.95 * fre) * 0.95 + u_sunCol * spec * sh * 0.9;
    glass += alb * u_sunCol * (0.12 * dif) * sh;
    col = mix(col, glass, u_mat.w);
  }
  return col;
}

vec3 softClip(vec3 c) {
  vec3 k = vec3(0.78);
  vec3 over = max(c - k, 0.0);
  return min(c, k) + (1.0 - k) * (1.0 - exp(-over / (1.0 - k)));
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_res;
  vec2 q = (2.0 * frag - u_res) / u_res.y;
  vec3 rd = normalize(u_fwd * u_zoom + u_right * q.x + u_up * q.y);
  vec3 ro = u_eye;
  vec3 col;
  float t = 0.0;
  bool hit = false;
  vec2 tb = boxHit(ro, rd);
  if (tb.x < tb.y && tb.y > 0.0) {
    t = max(tb.x, 0.0);
    bool left = false;
    for (int i = 0; i < 80; i++) {
      float d = map(ro + rd * t);
      if (d < 0.0007 * t) { hit = true; break; }
      t += d;
      if (t > tb.y) { left = true; break; }
    }
    // Out of steps while grazing a surface: call it a hit rather than see through it.
    if (!left) hit = true;
  }
  float fogAmt;
  if (hit) {
    vec3 p = ro + rd * t;
    if (drops(p) < p.y) {
      col = shadeDrop(p, normalAt(p), rd);
    } else {
      col = floorLight(ro + rd * (-ro.y / rd.y), vec3(0.0, 1.0, 0.0));
    }
    fogAmt = 1.0 - exp(-max(t - u_fogStart, 0.0) * u_fx.x);
  } else if (rd.y < 0.0) {
    t = -ro.y / rd.y;
    col = floorLight(ro + rd * t, vec3(0.0, 1.0, 0.0));
    fogAmt = 1.0 - exp(-max(t - u_fogStart, 0.0) * u_fx.x);
  } else {
    col = vec3(0.0);
    fogAmt = 1.0;
  }
  col = mix(col * u_fx.z, haze(uv), fogAmt);
  col = softClip(col);
  col = pow(col, vec3(1.0 / 2.2));
  col += (hash(frag) - 0.5) * (1.0 / 255.0 + u_fx.y);
  gl_FragColor = vec4(col, 1.0);
}
`;

const linear = new Map<string, Vec3>();
/** sRGB hex to linear RGB. */
export function toLinear(hex: string): Vec3 {
  const hit = linear.get(hex);
  if (hit) return hit;
  const value = Number.parseInt(hex.replace('#', ''), 16);
  const rgb: Vec3 = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => (c / 255) ** 2.2) as Vec3;
  linear.set(hex, rgb);
  return rgb;
}

const normalize = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Camera basis and zoom for a view at a given aspect, shared by the shader and picking. */
export function cameraFor(view: View, aspect: number) {
  const fwd = normalize([view.target[0] - view.eye[0], view.target[1] - view.eye[1], view.target[2] - view.eye[2]]);
  const right = normalize(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  const fit = view.fit ?? 0;
  const zoom = (1 / Math.tan(((view.fov / 2) * Math.PI) / 180)) * (fit && aspect < fit ? aspect / fit : 1);
  return { eye: view.eye, fwd, right, up, zoom };
}

/**
 * Where a point on the canvas (CSS px from its top left) lands on the
 * horizontal plane at `height`. Null if the ray points away from it.
 */
export function pick(view: View, width: number, height: number, x: number, y: number, planeY = 0.4): [number, number] | null {
  const cam = cameraFor(view, width / height);
  const qx = (2 * x - width) / height;
  const qy = (height - 2 * y) / height;
  const rd = normalize([
    cam.fwd[0] * cam.zoom + cam.right[0] * qx + cam.up[0] * qy,
    cam.fwd[1] * cam.zoom + cam.right[1] * qx + cam.up[1] * qy,
    cam.fwd[2] * cam.zoom + cam.right[2] * qx + cam.up[2] * qy
  ]);
  if (Math.abs(rd[1]) < 1e-4) return null;
  const t = (planeY - cam.eye[1]) / rd[1];
  if (t <= 0) return null;
  return [cam.eye[0] + rd[0] * t, cam.eye[2] + rd[2] * t];
}

/** Mixes two looks, for easing between materials. */
export function mixLook(a: Look, b: Look, t: number): Look {
  const out = {} as Look;
  for (const key of Object.keys(a) as (keyof Look)[]) out[key] = a[key] + (b[key] - a[key]) * t;
  return out;
}

export type SoftRenderer = {
  draw: (frame: Frame, width: number, height: number, pixelRatio: number) => void;
  dispose: () => void;
};

/** Sets up WebGL on a canvas. Returns null when WebGL isn't available. */
export function createRenderer(canvas: HTMLCanvasElement, preserve = false): SoftRenderer | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: preserve
    });
  } catch {
    gl = null;
  }
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      console.warn('Soft Matter scene: shader did not compile.', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, 'a');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  // biome-ignore lint/correctness/useHookAtTopLevel: a WebGL call, not a React hook
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const names = [
    'u_res', 'u_eye', 'u_right', 'u_up', 'u_fwd', 'u_zoom', 'u_ball', 'u_col', 'u_bmin', 'u_bmax', 'u_floor',
    'u_hazeTop', 'u_hazeBot', 'u_sky', 'u_sun', 'u_sunCol', 'u_scatter', 'u_mat', 'u_mat2', 'u_touch', 'u_fx', 'u_pool', 'u_fogStart', 'u_sag'
  ] as const;
  const u = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)])) as Record<
    (typeof names)[number],
    WebGLUniformLocation | null
  >;
  const balls = new Float32Array(MAX_DROPS * 4);
  const cols = new Float32Array(MAX_DROPS * 3);

  return {
    draw(frame, width, height, pixelRatio) {
      if (gl.isContextLost()) return;
      const w = Math.max(1, Math.round(width * pixelRatio));
      const h = Math.max(1, Math.round(height * pixelRatio));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      const cam = cameraFor(frame.view, width / height);
      const min: Vec3 = [1e3, 0, 1e3];
      const max: Vec3 = [-1e3, 0.2, -1e3];
      const margin = frame.look.blend * 0.3 + 0.14;
      for (let i = 0; i < MAX_DROPS; i++) {
        const drop = frame.drops[i];
        if (drop && drop.r > 0.002) {
          balls.set([drop.p[0], drop.p[1], drop.p[2], drop.r], i * 4);
          cols.set(toLinear(drop.color), i * 3);
          for (const axis of [0, 1, 2] as const) {
            min[axis] = Math.min(min[axis], drop.p[axis] - drop.r - margin);
            max[axis] = Math.max(max[axis], drop.p[axis] + drop.r + margin);
          }
        } else {
          balls.set([0, -60, 0, 0.001], i * 4);
          cols.set([0, 0, 0], i * 3);
        }
      }
      min[1] = 0;
      const { mood, look } = frame;
      gl.uniform2f(u.u_res, w, h);
      gl.uniform3fv(u.u_eye, cam.eye);
      gl.uniform3fv(u.u_right, cam.right);
      gl.uniform3fv(u.u_up, cam.up);
      gl.uniform3fv(u.u_fwd, cam.fwd);
      gl.uniform1f(u.u_zoom, cam.zoom);
      gl.uniform4fv(u.u_ball, balls);
      gl.uniform3fv(u.u_col, cols);
      gl.uniform3fv(u.u_bmin, min);
      gl.uniform3fv(u.u_bmax, max);
      gl.uniform3fv(u.u_floor, toLinear(mood.floor));
      gl.uniform3fv(u.u_hazeTop, toLinear(mood.hazeTop));
      gl.uniform3fv(u.u_hazeBot, toLinear(mood.hazeBottom));
      gl.uniform3fv(u.u_sky, toLinear(mood.sky));
      gl.uniform3fv(u.u_sun, normalize(mood.sun));
      gl.uniform3fv(u.u_sunCol, toLinear(mood.sunColor));
      gl.uniform3fv(u.u_scatter, toLinear(mood.scatter));
      gl.uniform4f(u.u_mat, look.diffuse, look.sss, look.gloss, look.transmission);
      gl.uniform4f(u.u_mat2, look.spec, look.sheen, look.soft, look.blend);
      gl.uniform4fv(u.u_touch, frame.touch ?? [0, 0, 1, 0]);
      gl.uniform4f(u.u_fx, mood.fog, frame.grain ?? 0.018, mood.exposure, mood.pool);
      gl.uniform2fv(u.u_pool, frame.pool ?? [frame.view.target[0], frame.view.target[2]]);
      const reach = Math.hypot(...frame.view.eye.map((v, i) => v - frame.view.target[i]));
      gl.uniform1f(u.u_fogStart, reach + 1.2);
      gl.uniform1f(u.u_sag, look.sag);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    }
  };
}

export type SceneFn = (time: number, pointer?: [number, number]) => Omit<Frame, 'look' | 'mood'> & {
  look?: Look;
  mood?: Mood;
};

/**
 * The scene as a component. With `time` it draws exactly one frame for that
 * moment and stops. Without it, it plays in real time while on screen.
 */
export function SoftScene({
  scene,
  width,
  height,
  time,
  pointer,
  material = 'wax',
  mood = 'studio',
  pixelRatio,
  className,
  style
}: {
  scene: SceneFn;
  width: number;
  height: number;
  time?: number;
  /** -1 to 1 across the canvas; scenes may lean towards it. */
  pointer?: [number, number];
  material?: MaterialName | Look;
  mood?: MoodName | Mood;
  /** Canvas pixels per CSS pixel. Defaults to the screen's, capped at 2 for stills and 1.5 live. */
  pixelRatio?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<SoftRenderer | null>(null);
  const [failed, setFailed] = useState(false);
  const still = time !== undefined;
  const inView = useInView(ref);
  const visible = usePageVisible();
  const reduced = useReducedMotion();
  const look = typeof material === 'string' ? LOOKS[material] : material;
  const tone = typeof mood === 'string' ? MOODS[mood] : mood;
  const latest = useRef({ scene, pointer, look, tone, width, height, pixelRatio });
  latest.current = { scene, pointer, look, tone, width, height, pixelRatio };

  const frameAt = (t: number): Frame => {
    const { scene: fn, pointer: pt, look: lk, tone: md } = latest.current;
    const made = fn(t, pt);
    return { ...made, look: made.look ?? lk, mood: made.mood ?? md };
  };

  const ensure = () => {
    if (renderer.current) return renderer.current;
    const canvas = ref.current;
    if (!canvas) return null;
    renderer.current = createRenderer(canvas, still);
    return renderer.current;
  };

  useEffect(
    () => () => {
      renderer.current?.dispose();
      renderer.current = null;
    },
    []
  );

  // Stills: one frame, drawn synchronously for the given time.
  useLayoutEffect(() => {
    if (!still) return;
    const ratio = pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2);
    ensure()?.draw(frameAt(time), width, height, ratio);
  });

  // Live: animate while on screen and the tab is visible; one frame if motion is reduced.
  // biome-ignore lint/correctness/useExhaustiveDependencies: props are read through a ref each frame
  useEffect(() => {
    if (still || failed) return;
    const gl = ensure();
    if (!gl) {
      setFailed(true);
      return;
    }
    const draw = (t: number) => {
      const { width: w, height: h, pixelRatio: pr } = latest.current;
      gl.draw(frameAt(t), w, h, pr ?? Math.min(window.devicePixelRatio || 1, 1.5));
    };
    if (reduced || !inView || !visible) {
      draw(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still, failed, reduced, inView, visible]);

  return (
    <canvas
      ref={ref}
      aria-hidden='true'
      className={className}
      style={{ width, height, display: 'block', background: tone.hazeTop, ...style }}
    />
  );
}
