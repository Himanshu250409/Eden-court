"use client";
/** Tiny generative ambient pad (no audio files needed). Off by default. */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let oscs: OscillatorNode[] = [];

export function startAmbient() {
  if (typeof window === "undefined") return;
  ctx = ctx ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  void ctx.resume();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  filter.connect(master);
  oscs = [110, 164.81, 220, 277.18].map((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i % 2 ? "sine" : "triangle";
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 6;
    const g = ctx!.createGain();
    g.gain.value = 0.18 / (i + 1);
    o.connect(g);
    g.connect(filter);
    o.start();
    return o;
  });
  master.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 3);
}

export function stopAmbient() {
  if (!ctx || !master) return;
  const m = master;
  m.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
  const toStop = oscs;
  oscs = [];
  setTimeout(() => toStop.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } }), 1400);
}
