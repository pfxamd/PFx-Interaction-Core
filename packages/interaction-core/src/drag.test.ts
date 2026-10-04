import { describe, expect, it } from 'vitest';
import { DragRecognizer } from './drag.js';
import type { PointerSample } from './types.js';

const sample = (
  phase: PointerSample['phase'],
  x: number,
  timestamp: number,
  shift = false,
): PointerSample => ({
  kind: 'pointer',
  phase,
  timestamp,
  pointerId: 1,
  pointerType: 'mouse',
  position: { x, y: 0 },
  delta: { x: 0, y: 0 },
  pressure: phase === 'up' ? 0 : 0.5,
  buttons: phase === 'up' ? 0 : 1,
  modifiers: { shift, alt: false, ctrl: false, meta: false },
});

describe('DragRecognizer', () => {
  it('keeps a stable lifecycle and offset', () => {
    const drag = new DragRecognizer();
    expect(drag.handle(sample('down', 10, 0))?.phase).toBe('start');
    const update = drag.handle(sample('move', 30, 16));
    expect(update?.phase).toBe('update');
    expect(update?.offset.x).toBe(20);
    expect(drag.handle(sample('up', 30, 32))?.phase).toBe('end');
  });

  it('supports an activation threshold', () => {
    const drag = new DragRecognizer({ activationDistance: 5 });
    expect(drag.handle(sample('down', 0, 0))?.phase).toBe('possible');
    expect(drag.handle(sample('move', 4, 16))?.phase).toBe('possible');
    expect(drag.handle(sample('move', 6, 32))?.phase).toBe('start');
  });

  it('cancels safely and preserves the latest modifiers', () => {
    const drag = new DragRecognizer();
    drag.handle(sample('down', 0, 0));
    drag.handle(sample('move', 4, 10, true));
    const cancelled = drag.cancel(12);
    expect(cancelled?.phase).toBe('cancel');
    expect(cancelled?.modifiers.shift).toBe(true);
    expect(drag.handle(sample('move', 8, 20))).toBeNull();
  });
});
