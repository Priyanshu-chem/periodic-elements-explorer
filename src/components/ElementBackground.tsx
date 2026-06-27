'use client';

import { useRef, useEffect } from 'react';

type VisualPattern = 'metallic' | 'crystal' | 'gas' | 'liquid' | 'glow' | 'nebula' | 'radioactive' | 'magnetic' | 'sparks' | 'flame' | 'iridescent' | 'graphite' | 'semiconductor' | 'futuristic';

interface ElementVisual {
  base: [number, number, number];
  accent: [number, number, number];
  pattern: VisualPattern;
  secondary?: VisualPattern;
  particleCount?: number;
  particleSpeed?: number;
  glowStrength?: number;
  opacity?: number;
}

interface ElemData {
  atomicNumber: number;
  category: string;
  phase: string;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  electronegativity?: number;
  ionizationEnergy?: number;
  atomicRadius?: number;
  electricalConductivity?: number;
  thermalConductivity?: number;
  magneticProperties?: string;
  hardness?: number;
  valenceElectrons?: number;
  isRadioactive: boolean;
  crystalStructureType?: string;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function normalize(v: number, min: number, max: number) { return (v - min) / (max - min); }

const ELEMENT_VISUALS: Record<number, ElementVisual> = {
  1:  { base: [100, 180, 255], accent: [180, 220, 255], pattern: 'nebula', particleCount: 60, glowStrength: 0.6, opacity: 0.25 },
  2:  { base: [255, 215, 0], accent: [255, 240, 180], pattern: 'glow', particleCount: 40, glowStrength: 0.5, opacity: 0.2 },
  3:  { base: [190, 190, 200], accent: [220, 80, 60], pattern: 'flame', particleCount: 35, glowStrength: 0.4, opacity: 0.25 },
  4:  { base: [210, 215, 220], accent: [255, 255, 255], pattern: 'crystal', particleCount: 30, glowStrength: 0.7, opacity: 0.2 },
  5:  { base: [60, 50, 45], accent: [140, 130, 120], pattern: 'crystal', particleCount: 25, glowStrength: 0.3, opacity: 0.25 },
  6:  { base: [50, 50, 55], accent: [200, 200, 220], pattern: 'graphite', particleCount: 50, glowStrength: 0.5, opacity: 0.25 },
  7:  { base: [30, 60, 140], accent: [100, 160, 220], pattern: 'gas', particleCount: 55, glowStrength: 0.5, opacity: 0.2 },
  8:  { base: [100, 180, 255], accent: [200, 230, 255], pattern: 'gas', particleCount: 50, glowStrength: 0.4, opacity: 0.18 },
  9:  { base: [180, 230, 100], accent: [220, 255, 160], pattern: 'gas', particleCount: 45, glowStrength: 0.5, opacity: 0.22 },
  10: { base: [255, 80, 30], accent: [255, 160, 100], pattern: 'glow', particleCount: 35, glowStrength: 0.7, opacity: 0.25 },
  11: { base: [200, 200, 210], accent: [255, 200, 50], pattern: 'sparks', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  12: { base: [210, 210, 215], accent: [255, 255, 255], pattern: 'metallic', particleCount: 25, glowStrength: 0.6, opacity: 0.18 },
  13: { base: [200, 205, 210], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, glowStrength: 0.5, opacity: 0.15 },
  14: { base: [100, 120, 140], accent: [180, 200, 220], pattern: 'semiconductor', particleCount: 30, glowStrength: 0.4, opacity: 0.2 },
  15: { base: [200, 180, 160], accent: [255, 200, 100], pattern: 'glow', particleCount: 40, glowStrength: 0.6, opacity: 0.25 },
  16: { base: [240, 210, 50], accent: [255, 240, 150], pattern: 'crystal', particleCount: 35, glowStrength: 0.5, opacity: 0.3 },
  17: { base: [80, 200, 80], accent: [160, 255, 140], pattern: 'gas', particleCount: 50, glowStrength: 0.5, opacity: 0.22 },
  18: { base: [140, 120, 230], accent: [200, 180, 255], pattern: 'glow', particleCount: 30, glowStrength: 0.6, opacity: 0.2 },
  19: { base: [190, 190, 200], accent: [180, 120, 220], pattern: 'flame', particleCount: 30, glowStrength: 0.4, opacity: 0.2 },
  20: { base: [200, 200, 205], accent: [255, 220, 200], pattern: 'metallic', particleCount: 25, glowStrength: 0.4, opacity: 0.15 },
  21: { base: [205, 205, 210], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, opacity: 0.15 },
  22: { base: [190, 195, 200], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, glowStrength: 0.5, opacity: 0.15 },
  23: { base: [180, 185, 190], accent: [220, 220, 230], pattern: 'metallic', particleCount: 25, opacity: 0.15 },
  24: { base: [200, 205, 210], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, glowStrength: 0.6, opacity: 0.15 },
  25: { base: [170, 175, 180], accent: [200, 200, 210], pattern: 'crystal', particleCount: 25, opacity: 0.18 },
  26: { base: [130, 135, 140], accent: [255, 200, 50], pattern: 'magnetic', particleCount: 35, glowStrength: 0.5, opacity: 0.2 },
  27: { base: [150, 160, 180], accent: [200, 210, 240], pattern: 'magnetic', particleCount: 30, glowStrength: 0.4, opacity: 0.18 },
  28: { base: [190, 195, 200], accent: [220, 225, 230], pattern: 'metallic', particleCount: 25, opacity: 0.15 },
  29: { base: [200, 120, 60], accent: [255, 180, 100], pattern: 'metallic', particleCount: 30, glowStrength: 0.5, opacity: 0.25 },
  30: { base: [180, 190, 200], accent: [200, 210, 220], pattern: 'crystal', particleCount: 25, opacity: 0.18 },
  31: { base: [190, 195, 200], accent: [210, 215, 220], pattern: 'liquid', particleCount: 25, glowStrength: 0.3, opacity: 0.2 },
  32: { base: [140, 150, 160], accent: [200, 210, 220], pattern: 'semiconductor', particleCount: 30, glowStrength: 0.4, opacity: 0.2 },
  33: { base: [140, 145, 150], accent: [180, 185, 190], pattern: 'crystal', particleCount: 25, opacity: 0.2 },
  34: { base: [80, 75, 70], accent: [200, 60, 50], pattern: 'crystal', particleCount: 30, glowStrength: 0.4, opacity: 0.22 },
  35: { base: [160, 50, 40], accent: [220, 120, 100], pattern: 'liquid', particleCount: 40, glowStrength: 0.4, opacity: 0.25 },
  36: { base: [200, 190, 230], accent: [230, 220, 255], pattern: 'glow', particleCount: 25, glowStrength: 0.5, opacity: 0.18 },
  37: { base: [190, 190, 200], accent: [200, 100, 150], pattern: 'sparks', particleCount: 30, glowStrength: 0.4, opacity: 0.2 },
  38: { base: [195, 195, 200], accent: [255, 100, 80], pattern: 'flame', particleCount: 25, glowStrength: 0.4, opacity: 0.2 },
  39: { base: [200, 200, 205], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, opacity: 0.15 },
  40: { base: [205, 210, 215], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, glowStrength: 0.4, opacity: 0.15 },
  41: { base: [185, 190, 195], accent: [220, 225, 230], pattern: 'metallic', particleCount: 20, opacity: 0.15 },
  42: { base: [170, 175, 180], accent: [200, 205, 210], pattern: 'crystal', particleCount: 25, opacity: 0.18 },
  43: { base: [160, 165, 170], accent: [100, 255, 150], pattern: 'radioactive', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  44: { base: [180, 185, 190], accent: [210, 215, 220], pattern: 'crystal', particleCount: 20, opacity: 0.18 },
  45: { base: [210, 215, 220], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, glowStrength: 0.6, opacity: 0.15 },
  46: { base: [200, 205, 210], accent: [255, 255, 240], pattern: 'metallic', particleCount: 20, glowStrength: 0.5, opacity: 0.15 },
  47: { base: [210, 210, 215], accent: [255, 255, 255], pattern: 'metallic', particleCount: 25, glowStrength: 0.7, opacity: 0.18 },
  48: { base: [180, 190, 200], accent: [200, 210, 220], pattern: 'metallic', particleCount: 20, opacity: 0.15 },
  49: { base: [195, 200, 205], accent: [210, 215, 220], pattern: 'liquid', particleCount: 20, glowStrength: 0.3, opacity: 0.18 },
  50: { base: [200, 205, 210], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, opacity: 0.15 },
  51: { base: [140, 150, 160], accent: [180, 190, 200], pattern: 'crystal', particleCount: 25, opacity: 0.2 },
  52: { base: [180, 185, 190], accent: [210, 215, 220], pattern: 'crystal', particleCount: 25, opacity: 0.18 },
  53: { base: [120, 60, 140], accent: [200, 120, 220], pattern: 'crystal', particleCount: 35, glowStrength: 0.5, opacity: 0.25 },
  54: { base: [100, 140, 220], accent: [180, 210, 255], pattern: 'glow', particleCount: 30, glowStrength: 0.6, opacity: 0.2 },
  55: { base: [200, 190, 160], accent: [150, 100, 220], pattern: 'sparks', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  56: { base: [195, 195, 200], accent: [160, 230, 160], pattern: 'flame', particleCount: 25, glowStrength: 0.4, opacity: 0.2 },
  57: { base: [205, 205, 210], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, opacity: 0.15 },
  58: { base: [190, 195, 200], accent: [200, 180, 150], pattern: 'crystal', particleCount: 25, glowStrength: 0.3, opacity: 0.18 },
  59: { base: [180, 200, 180], accent: [160, 220, 160], pattern: 'metallic', particleCount: 25, glowStrength: 0.4, opacity: 0.18 },
  60: { base: [180, 160, 200], accent: [140, 100, 220], pattern: 'magnetic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  61: { base: [170, 170, 180], accent: [100, 255, 150], pattern: 'radioactive', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  62: { base: [195, 195, 200], accent: [180, 100, 200], pattern: 'magnetic', particleCount: 25, glowStrength: 0.4, opacity: 0.18 },
  63: { base: [100, 150, 230], accent: [160, 200, 255], pattern: 'glow', particleCount: 30, glowStrength: 0.6, opacity: 0.22 },
  64: { base: [190, 195, 200], accent: [100, 180, 255], pattern: 'magnetic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  65: { base: [100, 220, 120], accent: [160, 255, 180], pattern: 'glow', particleCount: 30, glowStrength: 0.6, opacity: 0.22 },
  66: { base: [195, 195, 200], accent: [180, 100, 220], pattern: 'magnetic', particleCount: 25, glowStrength: 0.4, opacity: 0.18 },
  67: { base: [210, 180, 100], accent: [240, 200, 120], pattern: 'magnetic', particleCount: 25, glowStrength: 0.4, opacity: 0.18 },
  68: { base: [220, 160, 180], accent: [255, 200, 220], pattern: 'glow', particleCount: 25, glowStrength: 0.5, opacity: 0.2 },
  69: { base: [180, 190, 220], accent: [200, 210, 255], pattern: 'metallic', particleCount: 20, glowStrength: 0.4, opacity: 0.18 },
  70: { base: [200, 205, 210], accent: [255, 255, 255], pattern: 'metallic', particleCount: 20, opacity: 0.15 },
  71: { base: [195, 200, 205], accent: [220, 225, 230], pattern: 'crystal', particleCount: 25, opacity: 0.18 },
  72: { base: [190, 195, 200], accent: [100, 200, 255], pattern: 'metallic', particleCount: 25, glowStrength: 0.4, opacity: 0.18 },
  73: { base: [100, 120, 150], accent: [160, 180, 210], pattern: 'metallic', particleCount: 20, opacity: 0.18 },
  74: { base: [120, 125, 130], accent: [255, 180, 80], pattern: 'metallic', particleCount: 25, glowStrength: 0.5, opacity: 0.18 },
  75: { base: [170, 175, 180], accent: [200, 205, 210], pattern: 'crystal', particleCount: 25, opacity: 0.18 },
  76: { base: [130, 140, 150], accent: [160, 170, 180], pattern: 'crystal', particleCount: 25, opacity: 0.2 },
  77: { base: [200, 205, 210], accent: [160, 180, 230], pattern: 'metallic', particleCount: 20, glowStrength: 0.5, opacity: 0.15 },
  78: { base: [205, 205, 210], accent: [255, 255, 255], pattern: 'metallic', particleCount: 25, glowStrength: 0.6, opacity: 0.18 },
  79: { base: [255, 200, 50], accent: [255, 230, 150], pattern: 'metallic', particleCount: 30, glowStrength: 0.6, opacity: 0.3 },
  80: { base: [190, 195, 200], accent: [255, 255, 255], pattern: 'liquid', particleCount: 35, glowStrength: 0.4, opacity: 0.22 },
  81: { base: [160, 165, 170], accent: [190, 195, 200], pattern: 'metallic', particleCount: 20, opacity: 0.18 },
  82: { base: [120, 130, 140], accent: [160, 170, 180], pattern: 'metallic', particleCount: 25, opacity: 0.2 },
  83: { base: [180, 170, 200], accent: [255, 200, 100], pattern: 'iridescent', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  84: { base: [170, 175, 180], accent: [100, 255, 100], pattern: 'radioactive', particleCount: 40, glowStrength: 0.7, opacity: 0.28 },
  85: { base: [130, 120, 140], accent: [200, 150, 240], pattern: 'radioactive', particleCount: 35, glowStrength: 0.5, opacity: 0.25 },
  86: { base: [150, 200, 150], accent: [100, 255, 100], pattern: 'radioactive', particleCount: 40, glowStrength: 0.6, opacity: 0.22 },
  87: { base: [190, 190, 200], accent: [255, 100, 100], pattern: 'radioactive', particleCount: 45, glowStrength: 0.8, opacity: 0.3 },
  88: { base: [180, 200, 180], accent: [100, 255, 100], pattern: 'radioactive', particleCount: 40, glowStrength: 0.7, opacity: 0.28 },
  89: { base: [195, 195, 200], accent: [150, 255, 200], pattern: 'radioactive', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  90: { base: [140, 145, 150], accent: [100, 200, 255], pattern: 'radioactive', particleCount: 30, glowStrength: 0.5, opacity: 0.22 },
  91: { base: [160, 165, 170], accent: [100, 255, 150], pattern: 'radioactive', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  92: { base: [80, 120, 80], accent: [100, 255, 100], pattern: 'radioactive', particleCount: 40, glowStrength: 0.7, opacity: 0.3 },
  93: { base: [170, 175, 180], accent: [100, 220, 200], pattern: 'radioactive', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  94: { base: [100, 100, 110], accent: [255, 100, 50], pattern: 'radioactive', particleCount: 45, glowStrength: 0.8, opacity: 0.3 },
  95: { base: [190, 195, 200], accent: [100, 255, 150], pattern: 'radioactive', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  96: { base: [170, 170, 180], accent: [200, 100, 255], pattern: 'radioactive', particleCount: 40, glowStrength: 0.7, opacity: 0.28 },
  97: { base: [175, 180, 185], accent: [150, 255, 200], pattern: 'radioactive', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  98: { base: [150, 200, 100], accent: [100, 255, 100], pattern: 'radioactive', particleCount: 40, glowStrength: 0.8, opacity: 0.28 },
  99: { base: [160, 140, 200], accent: [200, 150, 255], pattern: 'radioactive', particleCount: 35, glowStrength: 0.7, opacity: 0.25 },
  100: { base: [170, 175, 180], accent: [200, 220, 255], pattern: 'radioactive', particleCount: 35, glowStrength: 0.6, opacity: 0.25 },
  101: { base: [180, 180, 190], accent: [200, 200, 255], pattern: 'radioactive', particleCount: 30, glowStrength: 0.6, opacity: 0.22 },
  102: { base: [160, 150, 200], accent: [200, 180, 255], pattern: 'radioactive', particleCount: 30, glowStrength: 0.6, opacity: 0.22 },
  103: { base: [190, 195, 200], accent: [200, 200, 255], pattern: 'futuristic', particleCount: 30, glowStrength: 0.6, opacity: 0.22 },
  104: { base: [180, 185, 190], accent: [100, 200, 255], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  105: { base: [175, 180, 185], accent: [200, 150, 255], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  106: { base: [170, 175, 180], accent: [150, 255, 200], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  107: { base: [165, 170, 175], accent: [255, 200, 100], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  108: { base: [160, 165, 170], accent: [200, 200, 255], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  109: { base: [175, 180, 185], accent: [255, 200, 200], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  110: { base: [180, 185, 190], accent: [200, 220, 255], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  111: { base: [185, 190, 195], accent: [255, 220, 200], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  112: { base: [180, 185, 190], accent: [200, 255, 255], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  113: { base: [175, 180, 185], accent: [255, 200, 150], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  114: { base: [170, 175, 180], accent: [200, 255, 200], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  115: { base: [165, 170, 175], accent: [255, 150, 200], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  116: { base: [160, 165, 170], accent: [200, 255, 150], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  117: { base: [155, 160, 165], accent: [255, 200, 100], pattern: 'futuristic', particleCount: 30, glowStrength: 0.5, opacity: 0.2 },
  118: { base: [150, 155, 160], accent: [255, 255, 255], pattern: 'futuristic', particleCount: 35, glowStrength: 0.6, opacity: 0.22 },
};

function getVisual(elem: ElemData): ElementVisual {
  const v = ELEMENT_VISUALS[elem.atomicNumber];
  if (v) return v;
  const hue = (elem.atomicNumber * 47 + 200) % 360;
  const base = hslToRgb(hue, elem.isRadioactive ? 50 : 30, 55);
  const accent = hslToRgb(hue, 70, 70);
  return {
    base, accent, pattern: 'metallic',
    particleCount: Math.round(clamp(normalize(elem.density ?? 5, 0, 20), 0, 1) * 30 + 15),
    glowStrength: elem.isRadioactive ? 0.6 : 0.3, opacity: 0.18,
  };
}

function drawGas(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  for (let i = 0; i < 25; i++) {
    const a = (i / 25) * Math.PI * 2 + t * 0.002;
    const r = rand(60, 180);
    const x = w * (0.5 + 0.7 * Math.sin(a + i * 1.7));
    const y = h * (0.5 + 0.7 * Math.cos(a * 0.7 + i * 2.3));
    const alpha = (0.08 + 0.06 * Math.sin(t * 0.005 + i * 1.1)) * (vis.opacity ?? 0.2);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${br},${bg},${bb},${alpha})`);
    grad.addColorStop(0.6, `rgba(${ar},${ag},${ab},${alpha * 0.4})`);
    grad.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < (vis.particleCount ?? 40); i++) {
    const a = t * 0.003 + i * 0.15;
    const x = w * (0.5 + 0.85 * Math.sin(a * 0.8 + i * 0.5));
    const y = h * (0.5 + 0.85 * Math.cos(a * 0.6 + i * 0.7));
    const alpha = 0.15 + 0.2 * Math.sin(t * 0.01 + i * 0.3);
    ctx.beginPath();
    ctx.arc(x, y, rand(1.5, 4), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${alpha})`;
    ctx.fill();
  }
}

function drawLiquid(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, `rgba(${br},${bg},${bb},0)`);
  grad.addColorStop(0.3, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.2) * 0.6})`);
  grad.addColorStop(0.5, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.2) * 1.2})`);
  grad.addColorStop(0.7, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.2) * 0.6})`);
  grad.addColorStop(1, `rgba(${br},${bg},${bb},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  for (let row = 0; row < 4; row++) {
    const baseY = h * (0.2 + row * 0.2);
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += 3) {
      const y = baseY + Math.sin(x * 0.015 + t * 0.02 + row) * 12 + Math.sin(x * 0.03 + t * 0.035 + row * 2) * 6;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${0.08 + row * 0.03})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  for (let i = 0; i < 25; i++) {
    const a = t * 0.01 + i * 0.2;
    const x = w * (0.1 + 0.8 * ((i / 25 + t * 0.002) % 1));
    const y = h * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(a + i * 0.1)));
    const ripple = Math.sin(a * 2 + i) * 0.3 + 0.7;
    ctx.beginPath();
    ctx.arc(x, y, rand(2, 5) * ripple, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${0.12 * ripple})`;
    ctx.fill();
  }
}

function drawMetallic(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  const cx = w / 2, cy = h / 2;
  const maxR = Math.max(w, h) * 0.8;
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  bgGrad.addColorStop(0, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.18) * 0.5})`);
  bgGrad.addColorStop(0.5, `rgba(${Math.max(0,br-40)},${Math.max(0,bg-40)},${Math.max(0,bb-40)},${(vis.opacity ?? 0.18) * 0.8})`);
  bgGrad.addColorStop(1, `rgba(0,0,0,${(vis.opacity ?? 0.18) * 1.2})`);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  const palette = [
    [br, bg, bb],
    [Math.min(255, br + 60), Math.min(255, bg + 60), Math.min(255, bb + 60)],
    [Math.max(0, br - 40), Math.max(0, bg - 40), Math.max(0, bb - 40)],
  ];
  for (let i = 0; i < 10; i++) {
    const baseRadius = (maxR / 10) * i;
    const r = Math.max(2, baseRadius + Math.sin(t * 0.008 + i * 2) * 15);
    const alpha = 0.12 + 0.08 * Math.sin(t * 0.004 + i * 1.5);
    const ci = i % 3;
    const rotAngle = t * 0.002 + i * (Math.PI / 12);
    const scaleX = 0.3 + 0.7 * Math.abs(Math.cos(rotAngle));
    const scaleY = 0.3 + 0.7 * Math.abs(Math.sin(rotAngle));
    ctx.strokeStyle = `rgba(${palette[ci][0]},${palette[ci][1]},${palette[ci][2]},${alpha})`;
    ctx.lineWidth = 1.5 + Math.sin(t * 0.01 + i) * 0.8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * scaleX, r * scaleY, rotAngle * 0.2, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 3; i++) {
    const angle = t * 0.001 + i * Math.PI / 2;
    const sg = ctx.createLinearGradient(
      cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR,
      cx + Math.cos(angle + 0.2) * maxR * 0.6, cy + Math.sin(angle + 0.2) * maxR * 0.6,
    );
    const a = 0.04 + 0.03 * Math.sin(t * 0.003 + i);
    sg.addColorStop(0, `rgba(${ar},${ag},${ab},0)`);
    sg.addColorStop(0.3, `rgba(${ar},${ag},${ab},${a})`);
    sg.addColorStop(0.7, `rgba(${ar},${ag},${ab},${a * 0.5})`);
    sg.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawCrystal(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  const cx = w / 2, cy = h / 2;
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
  bgGrad.addColorStop(0, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.2) * 0.6})`);
  bgGrad.addColorStop(1, `rgba(${Math.max(0,br-30)},${Math.max(0,bg-30)},${Math.max(0,bb-30)},0)`);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  const cols = Math.max(4, Math.floor(w / 100));
  const rows = Math.max(3, Math.floor(h / 100));
  const nodes: { x: number; y: number; pulse: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push({ x: (w / (cols - 1)) * c + rand(-10, 10), y: (h / (rows - 1)) * r + rand(-10, 10), pulse: rand(0, Math.PI * 2) });
    }
  }
  const connDist = Math.min(w, h) * 0.3;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connDist) {
        const alpha = (1 - dist / connDist) * 0.15;
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  for (const node of nodes) {
    const glow = Math.sin(t * 0.008 + node.pulse) * 0.3 + 0.7;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 2 + glow, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${glow * 0.4})`;
    ctx.fill();
  }
}

function drawGlow(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  const cx = w / 2, cy = h / 2;
  const maxR = Math.max(w, h) * 0.5;
  const pulse = Math.sin(t * 0.004) * 0.3 + 0.7;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  g.addColorStop(0, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.2) * pulse * 0.8})`);
  g.addColorStop(0.4, `rgba(${ar},${ag},${ab},${(vis.opacity ?? 0.2) * pulse * 0.3})`);
  g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) {
    const radius = maxR * (0.25 + 0.2 * Math.sin(t * 0.005 + i * 1.5));
    const a = (0.08 + 0.06 * Math.sin(t * 0.006 + i * 2)) * pulse;
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < (vis.particleCount ?? 30); i++) {
    const angle = t * 0.003 + i * 0.2;
    const dist = maxR * (0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.004 + i)));
    const x = cx + Math.cos(angle + i * 0.3) * dist;
    const y = cy + Math.sin(angle + i * 0.3) * dist;
    const energy = Math.sin(t * 0.02 + i) * 0.3 + 0.7;
    ctx.shadowColor = `rgba(${ar},${ag},${ab},${energy * 0.3})`;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + energy * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${0.2 + energy * 0.3})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawNebula(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  for (let i = 0; i < 5; i++) {
    const x = w * (0.3 + 0.4 * Math.sin(t * 0.001 + i * 1.3));
    const y = h * (0.3 + 0.4 * Math.cos(t * 0.001 + i * 1.7));
    const r = rand(80, 200);
    const a = (0.04 + 0.02 * Math.sin(t * 0.002 + i)) * (vis.opacity ?? 0.25);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${br},${bg},${bb},${a * 0.8})`);
    grad.addColorStop(0.5, `rgba(${ar},${ag},${ab},${a * 0.3})`);
    grad.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < (vis.particleCount ?? 50); i++) {
    const a = t * 0.004 + i * 0.15;
    const x = w * (0.5 + 0.8 * Math.sin(a + i * 0.7));
    const y = h * (0.5 + 0.8 * Math.cos(a * 0.6 + i * 0.9));
    const alpha = 0.1 + 0.15 * Math.sin(t * 0.01 + i);
    ctx.shadowColor = `rgba(${ar},${ag},${ab},${alpha * 0.3})`;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x, y, rand(1, 3), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${br + 50},${bg + 50},${bb + 50},${alpha})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawRadioactiveBG(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [ar, ag, ab] = vis.accent;
  const cx = w / 2, cy = h / 2;
  const maxR = Math.max(w, h) * 0.6;
  const pulse = Math.sin(t * 0.005) * 0.3 + 0.7;
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  bgGrad.addColorStop(0, `rgba(${ar},${ag},${ab},${(vis.opacity ?? 0.25) * pulse * 0.5})`);
  bgGrad.addColorStop(0.5, `rgba(${Math.max(0,ar-60)},${Math.max(0,ag-60)},${Math.max(0,ab-60)},${(vis.opacity ?? 0.25) * 0.3})`);
  bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 3; i++) {
    const radius = (maxR / 3) * (i + 1) + Math.sin(t * 0.004 + i * 1.5) * 15;
    const a = (0.08 + 0.06 * Math.sin(t * 0.006 + i * 2)) * pulse;
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${a})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, radius), 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 30; i++) {
    const a = rand(0, Math.PI * 2);
    const s = rand(0.5, 2);
    const x = cx + Math.cos(a) * (t % 200) * s;
    const y = cy + Math.sin(a) * (t % 200) * s;
    const px = cx + Math.cos(a) * (((t - 10) % 200) * s);
    const py = cy + Math.sin(a) * (((t - 10) % 200) * s);
    const alpha = Math.max(0, 1 - Math.hypot(x - cx, y - cy) / (maxR));
    ctx.shadowColor = `rgba(${ar},${ag},${ab},${alpha * 0.5})`;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(px, py, 1 + alpha * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${alpha})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawMagnetic(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  const cx = w / 2, cy = h / 2;
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
  bgGrad.addColorStop(0, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.18) * 0.6})`);
  bgGrad.addColorStop(1, `rgba(0,0,0,0)`);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 6; i++) {
    const offset = (i / 6) * w * 0.6 + w * 0.2;
    const x1 = offset;
    const y1 = 0;
    const x2 = offset + Math.sin(t * 0.003 + i) * 40;
    const y2 = h;
    const a = 0.05 + 0.04 * Math.sin(t * 0.004 + i * 1.3);
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${a})`;
    ctx.lineWidth = 1.5 + Math.sin(t * 0.005 + i) * 0.8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const cpx = (x1 + x2) / 2 + Math.sin(t * 0.002 + i * 0.7) * 60;
    ctx.quadraticCurveTo(cpx, h / 2, x2, y2);
    ctx.stroke();
  }
  for (let i = 0; i < (vis.particleCount ?? 25); i++) {
    const a = t * 0.005 + i * 0.25;
    const x = w * (0.2 + 0.6 * ((i / 25 + t * 0.001) % 1));
    const y = h * (0.5 + 0.4 * Math.sin(a + i * 0.3));
    ctx.beginPath();
    ctx.arc(x, y, rand(1.5, 3), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${0.15 + 0.15 * Math.sin(t * 0.01 + i)})`;
    ctx.fill();
  }
}

function drawSparks(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [ar, ag, ab] = vis.accent;
  drawMetallic(ctx, vis, t, w, h);
  for (let i = 0; i < 15; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(1, 3);
    const life = (t + i * 50) % 200;
    const alpha = life < 180 ? 1 : 1 - (life - 180) / 20;
    if (alpha <= 0) continue;
    const x = w / 2 + Math.cos(angle) * life * speed * 0.5;
    const y = h / 2 + Math.sin(angle) * life * speed * 0.5;
    const trailX = w / 2 + Math.cos(angle) * (life - 5) * speed * 0.5;
    const trailY = h / 2 + Math.sin(angle) * (life - 5) * speed * 0.5;
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${alpha * 0.6})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(trailX, trailY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.shadowColor = `rgba(${ar},${ag},${ab},${alpha * 0.5})`;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.min(255, ar + 100)},${Math.min(255, ag + 100)},${Math.min(255, ab + 100)},${alpha})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function drawFlame(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  drawMetallic(ctx, vis, t, w, h);
  const [ar, ag, ab] = vis.accent;
  for (let i = 0; i < 8; i++) {
    const x = w * (0.2 + 0.6 * ((i / 8 + t * 0.002) % 1));
    const y = h * 0.8;
    const flameH = h * (0.1 + 0.15 * Math.sin(t * 0.008 + i * 1.3));
    const grad = ctx.createLinearGradient(x, y, x, y - flameH);
    grad.addColorStop(0, `rgba(${ar},${ag},${ab},0)`);
    grad.addColorStop(0.3, `rgba(${ar},${ag},${ab},${0.06 + 0.04 * Math.sin(t * 0.01 + i)})`);
    grad.addColorStop(0.7, `rgba(${Math.min(255, ar + 50)},${Math.min(255, ag + 50)},${Math.min(255, ab + 50)},${0.04 + 0.03 * Math.sin(t * 0.012 + i * 0.7)})`);
    grad.addColorStop(1, `rgba(${ar + 100},${ag + 100},${ab + 100},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.quadraticCurveTo(x - 15 + Math.sin(t * 0.01 + i) * 10, y - flameH * 0.6, x + Math.sin(t * 0.008 + i * 0.5) * 5, y - flameH);
    ctx.quadraticCurveTo(x + 15 + Math.sin(t * 0.012 + i * 0.3) * 10, y - flameH * 0.6, x + 20, y);
    ctx.fill();
  }
}

function drawGraphite(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.5);
  bgGrad.addColorStop(0, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.25) * 0.8})`);
  bgGrad.addColorStop(1, `rgba(0,0,0,${(vis.opacity ?? 0.25) * 0.5})`);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  for (let row = 0; row < 8; row++) {
    const y = (h / 8) * row + Math.sin(t * 0.002 + row) * 5;
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${0.03 + 0.02 * Math.sin(t * 0.003 + row)})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 2) {
      ctx.lineTo(x, y + Math.sin(x * 0.05 + t * 0.005 + row * 0.5) * 3);
    }
    ctx.stroke();
  }
  for (let i = 0; i < (vis.particleCount ?? 40); i++) {
    const a = t * 0.003 + i * 0.2;
    const x = w * (0.5 + 0.7 * Math.sin(a + i * 0.5));
    const y = h * (0.5 + 0.7 * Math.cos(a * 0.7 + i * 0.8));
    const alpha = 0.08 + 0.1 * Math.sin(t * 0.008 + i);
    ctx.beginPath();
    ctx.arc(x, y, rand(0.8, 2.5), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${alpha})`;
    ctx.fill();
  }
  const sparkle = Math.sin(t * 0.02) * 0.5 + 0.5;
  if (sparkle > 0.7) {
    const sx = w * (0.15 + 0.7 * Math.sin(t * 0.015));
    const sy = h * (0.15 + 0.7 * Math.cos(t * 0.012));
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 30);
    sg.addColorStop(0, `rgba(255,255,255,${sparkle * 0.3})`);
    sg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(sx, sy, 30, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSemiconductor(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.5);
  bgGrad.addColorStop(0, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.2) * 0.6})`);
  bgGrad.addColorStop(1, `rgba(${Math.max(0,br-40)},${Math.max(0,bg-40)},${Math.max(0,bb-40)},0)`);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const x = (w / 5) * c + Math.sin(t * 0.002 + r + c) * 8;
      const y = (h / 5) * r + Math.cos(t * 0.002 + r - c) * 8;
      const glow = Math.sin(t * 0.006 + r * 2 + c * 3) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(${ar},${ag},${ab},${glow * 0.15})`;
      ctx.fillRect(x - 8, y - 8, 16, 16);
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${glow * 0.08})`;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x - 8, y - 8, 16, 16);
    }
  }
}

function drawIridescent(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const cx = w / 2, cy = h / 2;
  const maxR = Math.max(w, h) * 0.6;
  for (let i = 0; i < 8; i++) {
    const hue = (t * 0.2 + i * 45) % 360;
    const rgb = hslToRgb(hue, 60, 55);
    const radius = maxR * (0.3 + 0.4 * ((i / 8) + Math.sin(t * 0.003 + i) * 0.1));
    const a = 0.04 + 0.03 * Math.sin(t * 0.005 + i * 1.5);
    ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
    ctx.lineWidth = 2 + Math.sin(t * 0.008 + i) * 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * 0.6, t * 0.001 + i * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < (vis.particleCount ?? 30); i++) {
    const hue = (t * 0.3 + i * 60) % 360;
    const rgb = hslToRgb(hue, 80, 60);
    const a = t * 0.005 + i * 0.3;
    const x = cx + Math.cos(a) * maxR * (0.5 + 0.3 * Math.sin(t * 0.004 + i));
    const y = cy + Math.sin(a) * maxR * (0.5 + 0.3 * Math.cos(t * 0.004 + i));
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.sin(t * 0.01 + i) * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.15 + 0.15 * Math.sin(t * 0.008 + i)})`;
    ctx.fill();
  }
}

function drawFuturistic(ctx: CanvasRenderingContext2D, vis: ElementVisual, t: number, w: number, h: number) {
  const [br, bg, bb] = vis.base;
  const [ar, ag, ab] = vis.accent;
  const cx = w / 2, cy = h / 2;
  const maxR = Math.max(w, h) * 0.5;
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.5);
  bgGrad.addColorStop(0, `rgba(${br},${bg},${bb},${(vis.opacity ?? 0.2) * 0.7})`);
  bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 6; i++) {
    const angle = t * 0.001 + i * (Math.PI / 3);
    const r = maxR * (0.5 + 0.3 * Math.sin(t * 0.004 + i * 1.5));
    const a = 0.04 + 0.03 * Math.sin(t * 0.005 + i);
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, r), angle, angle + Math.PI * 0.6);
    ctx.stroke();
  }
  for (let i = 0; i < (vis.particleCount ?? 30); i++) {
    const angle = t * 0.004 + i * 0.25;
    const dist = maxR * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.003 + i * 0.7)));
    const x = cx + Math.cos(angle + i * 0.2) * dist;
    const y = cy + Math.sin(angle + i * 0.2) * dist;
    const alpha = 0.1 + 0.2 * Math.sin(t * 0.008 + i * 0.5);
    ctx.shadowColor = `rgba(${ar},${ag},${ab},${alpha * 0.3})`;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + alpha * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ar},${ag},${ab},${alpha})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export default function ElementBackground(elem: ElemData) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef<{ time: number; running: boolean }>({ time: 0, running: true });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    let width = 0, height = 0;
    const state = stateRef.current;
    state.time = 0;
    state.running = true;

    const vis = getVisual(elem);

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    function animate() {
      if (!state.running) return;
      state.time++;
      const t = state.time;
      ctx!.clearRect(0, 0, width, height);

      const drawFn = {
        gas: drawGas, liquid: drawLiquid, metallic: drawMetallic,
        crystal: drawCrystal, glow: drawGlow, nebula: drawNebula,
        radioactive: drawRadioactiveBG, magnetic: drawMagnetic,
        sparks: drawSparks, flame: drawFlame, graphite: drawGraphite,
        semiconductor: drawSemiconductor, iridescent: drawIridescent,
        futuristic: drawFuturistic,
      }[vis.pattern] ?? drawMetallic;

      drawFn(ctx!, vis, t, width, height);

      if (vis.secondary) {
        const drawFn2 = {
          gas: drawGas, liquid: drawLiquid, metallic: drawMetallic,
          crystal: drawCrystal, glow: drawGlow, nebula: drawNebula,
          radioactive: drawRadioactiveBG, magnetic: drawMagnetic,
          sparks: drawSparks, flame: drawFlame, graphite: drawGraphite,
          semiconductor: drawSemiconductor, iridescent: drawIridescent,
          futuristic: drawFuturistic,
        }[vis.secondary] ?? drawMetallic;
        drawFn2(ctx!, { ...vis, opacity: (vis.opacity ?? 0.2) * 0.6 }, t, width, height);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      state.running = false;
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elem.atomicNumber, elem.category, elem.phase, elem.isRadioactive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
