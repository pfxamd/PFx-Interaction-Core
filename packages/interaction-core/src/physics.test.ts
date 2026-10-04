import { describe, expect, it } from 'vitest';
import { inertiaStep, springStep } from './physics.js';

describe('physics', () => {
  it('spring moves toward its target', () => {
    const next = springStep({ position: 0, velocity: 0 }, 100, 1 / 60);
    expect(next.position).toBeGreaterThan(0);
    expect(next.velocity).toBeGreaterThan(0);
  });

  it('inertia reduces velocity with friction', () => {
    const next = inertiaStep({ position: 0, velocity: 100 }, 1 / 60, { friction: 8 });
    expect(next.position).toBeGreaterThan(0);
    expect(next.velocity).toBeLessThan(100);
  });
});

it('rejects non-finite physics configuration', () => {
  expect(() => springStep({ position: 0, velocity: 0 }, 1, 1 / 60, { stiffness: Number.NaN })).toThrow(RangeError);
  expect(() => inertiaStep({ position: 0, velocity: 1 }, 1 / 60, { friction: Number.POSITIVE_INFINITY })).toThrow(RangeError);
});
