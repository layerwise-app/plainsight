import type { ComponentType } from 'react';

/**
 * Sample-work screens are React components. `pnpm render-work` renders each
 * still to an image and each motion entry to a short MP4, written beside the
 * case study. Components get `time` in seconds and must look the same every
 * time they are given the same `time` (no Math.random, no Date.now).
 */
export type ScreenProps = { time?: number };

export type Still = {
  component: ComponentType<ScreenProps>;
  /** Size in CSS pixels; the image is rendered 2880 px wide. */
  width: number;
  height: number;
  /** The moment to capture, in seconds. */
  time?: number;
};

export type Motion = {
  component: ComponentType<{ time: number }>;
  width: number;
  height: number;
  /** Seconds; the loop should end where it began. */
  duration: number;
  /** Width of the video in pixels. */
  outputWidth?: number;
  fps?: number;
};

export type ScreenSet = {
  stills: Record<string, Still>;
  motion?: Record<string, Motion>;
};

export function defineScreens(set: ScreenSet): ScreenSet {
  return set;
}
