import { useRef } from 'react';
import {
  animateSpring,
  applyPrecision,
  clamp,
  stepValue,
  wrap,
} from '@pfx/interaction-core';
import { createRafScheduler } from '@pfx/interaction-dom';
import { useDrag, useKeyboardSensor } from '@pfx/interaction-react';

function HorizontalSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLOutputElement>(null);
  const valueRef = useRef(0.5);

  const paint = (value: number) => {
    valueRef.current = clamp(value, 0, 1);
    if (thumbRef.current) thumbRef.current.style.left = `${valueRef.current * 100}%`;
    if (outputRef.current) outputRef.current.value = valueRef.current.toFixed(3);
    trackRef.current?.setAttribute('aria-valuenow', String(Math.round(valueRef.current * 100)));
  };

  useDrag(trackRef, {
    preventDefault: true,
    onChange(snapshot) {
      if (snapshot.phase !== 'start' && snapshot.phase !== 'update') return;
      const width = trackRef.current?.clientWidth ?? 1;
      const delta = applyPrecision(snapshot.delta.x / width, snapshot.modifiers.shift, 0.12);
      paint(valueRef.current + delta);
    },
  });

  useKeyboardSensor(trackRef, {
    preventDefault: (event) => event.key === 'ArrowLeft' || event.key === 'ArrowRight',
    onSample(sample) {
      if (sample.phase !== 'down') return;
      const amount = sample.modifiers.shift ? 0.005 : 0.025;
      if (sample.key === 'ArrowLeft') paint(valueRef.current - amount);
      if (sample.key === 'ArrowRight') paint(valueRef.current + amount);
    },
  });

  return (
    <section className="card">
      <header><h2>Axis + Precision</h2><output ref={outputRef}>0.500</output></header>
      <div
        ref={trackRef}
        className="slider"
        tabIndex={0}
        role="slider"
        aria-label="Interaction value"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        data-testid="slider"
      >
        <div ref={thumbRef} className="thumb" style={{ left: '50%' }} />
      </div>
      <p>Drag or use arrow keys. Hold Shift for fine movement.</p>
    </section>
  );
}


function VerticalSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(0.5);

  const paint = (value: number) => {
    valueRef.current = clamp(value, 0, 1);
    if (thumbRef.current) thumbRef.current.style.top = `${(1 - valueRef.current) * 100}%`;
    trackRef.current?.setAttribute('aria-valuenow', String(Math.round(valueRef.current * 100)));
  };

  useDrag(trackRef, {
    preventDefault: true,
    onChange(snapshot) {
      if (snapshot.phase !== 'start' && snapshot.phase !== 'update') return;
      const height = trackRef.current?.clientHeight ?? 1;
      const delta = applyPrecision(-snapshot.delta.y / height, snapshot.modifiers.shift, 0.12);
      paint(valueRef.current + delta);
    },
  });

  useKeyboardSensor(trackRef, {
    preventDefault: (event) => event.key === 'ArrowUp' || event.key === 'ArrowDown',
    onSample(sample) {
      if (sample.phase !== 'down') return;
      const amount = sample.modifiers.shift ? 0.005 : 0.025;
      if (sample.key === 'ArrowUp') paint(valueRef.current + amount);
      if (sample.key === 'ArrowDown') paint(valueRef.current - amount);
    },
  });

  return (
    <section className="card compact-card">
      <header><h2>Vertical Axis</h2><span>1D</span></header>
      <div
        ref={trackRef}
        className="vertical-slider"
        tabIndex={0}
        role="slider"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
      >
        <div ref={thumbRef} className="vertical-thumb" style={{ top: '50%' }} />
      </div>
      <p>Vertical normalized control with keyboard and precision input.</p>
    </section>
  );
}

function FreeDrag() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });

  const paint = (x: number, y: number) => {
    positionRef.current = { x, y };
    if (objectRef.current) objectRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  useDrag(zoneRef, {
    preventDefault: true,
    onChange(snapshot) {
      if (snapshot.phase !== 'start' && snapshot.phase !== 'update') return;
      paint(positionRef.current.x + snapshot.delta.x, positionRef.current.y + snapshot.delta.y);
    },
  });

  return (
    <section className="card">
      <header><h2>Free Drag</h2><span>2D Delta</span></header>
      <div ref={zoneRef} className="free-zone">
        <div ref={objectRef} className="free-object">MOVE</div>
      </div>
      <p>Raw relative 2D movement without domain meaning or visual assumptions.</p>
    </section>
  );
}

function InputProbe() {
  const probeRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLOutputElement>(null);

  useDrag(probeRef, {
    preventDefault: true,
    onChange(snapshot) {
      if (!outputRef.current) return;
      outputRef.current.value = `${snapshot.pointerType} / pressure ${snapshot.pressure.toFixed(2)}`;
    },
  });

  return (
    <section className="card compact-card">
      <header><h2>Input Probe</h2><output ref={outputRef}>idle</output></header>
      <div ref={probeRef} className="probe-zone">Touch / Pen / Mouse</div>
      <p>Verifies unified pointer input while preserving device characteristics.</p>
    </section>
  );
}

function XYPad() {
  const padRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef({ x: 0.5, y: 0.5 });

  const paint = (x: number, y: number) => {
    valueRef.current = { x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
    if (handleRef.current) {
      handleRef.current.style.left = `${valueRef.current.x * 100}%`;
      handleRef.current.style.top = `${valueRef.current.y * 100}%`;
    }
  };

  useDrag(padRef, {
    preventDefault: true,
    onChange(snapshot) {
      if (snapshot.phase !== 'start' && snapshot.phase !== 'update') return;
      const width = padRef.current?.clientWidth ?? 1;
      const height = padRef.current?.clientHeight ?? 1;
      paint(valueRef.current.x + snapshot.delta.x / width, valueRef.current.y + snapshot.delta.y / height);
    },
  });

  return (
    <section className="card">
      <header><h2>XY Control</h2><span>2D</span></header>
      <div ref={padRef} className="xy-pad" data-testid="xy-pad">
        <div ref={handleRef} className="xy-handle" style={{ left: '50%', top: '50%' }} />
      </div>
      <p>Headless 2D position with bounded normalized output.</p>
    </section>
  );
}

function Rotary() {
  const controlRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(0);

  const paint = (degrees: number) => {
    valueRef.current = wrap(degrees, 0, 360);
    if (dialRef.current) dialRef.current.style.transform = `rotate(${valueRef.current}deg)`;
    controlRef.current?.setAttribute('aria-valuenow', String(Math.round(valueRef.current)));
  };

  useDrag(controlRef, {
    preventDefault: true,
    onChange(snapshot) {
      if (snapshot.phase !== 'start' && snapshot.phase !== 'update') return;
      const raw = valueRef.current - snapshot.delta.y * (snapshot.modifiers.shift ? 0.2 : 1.2);
      paint(stepValue(raw, snapshot.modifiers.alt ? 15 : 1));
    },
  });

  return (
    <section className="card">
      <header><h2>Rotary + Detents</h2><span>0..360</span></header>
      <div ref={controlRef} className="rotary-wrap" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={359} aria-valuenow={0}>
        <div ref={dialRef} className="rotary"><i /></div>
      </div>
      <p>Vertical drag. Shift = precision. Alt = 15° detents.</p>
    </section>
  );
}

function SpringDrag() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const schedulerRef = useRef(createRafScheduler());
  const xRef = useRef(0);
  const yRef = useRef(0);
  const startRef = useRef({ x: 0, y: 0 });
  const animationX = useRef<ReturnType<typeof animateSpring> | null>(null);
  const animationY = useRef<ReturnType<typeof animateSpring> | null>(null);

  const paint = (x: number, y: number) => {
    xRef.current = x;
    yRef.current = y;
    if (objectRef.current) objectRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const returnToOrigin = () => {
    animationX.current?.cancel();
    animationY.current?.cancel();
    animationX.current = animateSpring({
      scheduler: schedulerRef.current,
      from: { position: xRef.current, velocity: 0 },
      target: 0,
      spring: { stiffness: 260, damping: 24 },
      onUpdate: (state) => paint(state.position, yRef.current),
    });
    animationY.current = animateSpring({
      scheduler: schedulerRef.current,
      from: { position: yRef.current, velocity: 0 },
      target: 0,
      spring: { stiffness: 260, damping: 24 },
      onUpdate: (state) => paint(xRef.current, state.position),
    });
  };

  useDrag(zoneRef, {
    preventDefault: true,
    onChange(snapshot) {
      if (snapshot.phase === 'start') {
        animationX.current?.cancel();
        animationY.current?.cancel();
        startRef.current = { x: xRef.current, y: yRef.current };
      }
      if (snapshot.phase === 'start' || snapshot.phase === 'update') {
        paint(startRef.current.x + snapshot.offset.x, startRef.current.y + snapshot.offset.y);
      }
      if (snapshot.phase === 'end' || snapshot.phase === 'cancel') returnToOrigin();
    },
  });

  return (
    <section className="card">
      <header><h2>Spring Return</h2><span>Physics</span></header>
      <div ref={zoneRef} className="spring-zone">
        <div ref={objectRef} className="spring-object">PFx</div>
      </div>
      <p>Free drag with a composable return-to-origin spring.</p>
    </section>
  );
}

function SnapControl() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(0.5);
  const valueRef = useRef(0.5);

  const paint = (value: number) => {
    const snapped = stepValue(clamp(value, 0, 1), 0.25);
    valueRef.current = snapped;
    if (thumbRef.current) thumbRef.current.style.left = `${snapped * 100}%`;
  };

  useDrag(trackRef, {
    preventDefault: true,
    onChange(snapshot) {
      if (snapshot.phase === 'start') startRef.current = valueRef.current;
      paint(startRef.current + snapshot.offset.x / (trackRef.current?.clientWidth ?? 1));
    },
  });

  return (
    <section className="card">
      <header><h2>Snap Points</h2><span>Modifier</span></header>
      <div ref={trackRef} className="slider snap-slider">
        {[0, 25, 50, 75, 100].map((value) => <i key={value} style={{ left: `${value}%` }} />)}
        <div ref={thumbRef} className="thumb" style={{ left: '50%' }} />
      </div>
      <p>Drag input passes through a 0.25 step modifier.</p>
    </section>
  );
}

export function App() {
  return (
    <main>
      <header className="hero">
        <div>
          <span className="eyebrow">PFx Interaction Core / v0.1</span>
          <h1>Interaction Playground</h1>
        </div>
        <p>Pointer, keyboard, constraints, precision and physics in one headless interaction foundation.</p>
      </header>
      <div className="grid">
        <HorizontalSlider />
        <VerticalSlider />
        <XYPad />
        <Rotary />
        <FreeDrag />
        <SpringDrag />
        <SnapControl />
        <InputProbe />
      </div>
      <footer>
        <span>Mouse</span><span>Touch</span><span>Pen</span><span>Keyboard</span><span>60fps-oriented</span>
      </footer>
    </main>
  );
}
