"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { floors, type FloorData } from "@/data/floors";
import { FH, LIFT, atmos } from "./constants";

const GOLD = new THREE.Color("#C2A878");
const WARM = new THREE.Color("#ffcf8a");
const damp = (a: number, b: number, k: number, dt: number) => THREE.MathUtils.lerp(a, b, 1 - Math.exp(-k * dt));

/** Shared per-floor behaviour: build-up, exploded lift, hover scale. Returns state the materials read. */
export function useFloorMotion(level: number) {
  const group = useRef<THREE.Group>(null);
  const s = useRef({ appear: 0, lift: 0, hover: 0, scale: 1 });
  useFrame((_, dt) => {
    const st = useStore.getState();
    const g = group.current;
    if (!g) return;
    const n = floors.length;
    // floors rise one after another as the user scrolls (stagger ≈ 0.04 of progress per floor)
    const target = THREE.MathUtils.clamp((st.buildProgress * (n + 4) - level) / 2, 0, 1);
    s.current.appear = damp(s.current.appear, target, 6, dt);
    const open = st.isPanelOpen && !st.isPanelMinimised && st.selectedFloor != null;
    s.current.lift = damp(s.current.lift, open && level > (st.selectedFloor as number) ? LIFT : 0, 3.5, dt);
    const isHover = st.hoveredFloor === level || (open && st.selectedFloor === level);
    s.current.hover = damp(s.current.hover, isHover ? 1 : 0, 8, dt);
    s.current.scale = 1 + 0.015 * s.current.hover;
    g.visible = s.current.appear > 0.01;
    g.position.y = level * FH + s.current.lift;
    g.scale.set(s.current.scale, Math.max(s.current.appear, 0.001), s.current.scale);
  });
  return { group, s };
}

/** One storey of the procedural tower. Replaced by Floor_NN meshes if /models/tower.glb exists. */
export default function Floor({ data }: { data: FloorData }) {
  const { level, type } = data;
  const { group, s } = useFloorMotion(level);
  const store = useStore;

  const mats = useMemo(() => ({
    slab: new THREE.MeshStandardMaterial({ color: "#e9e1d2", roughness: 0.75, transparent: true }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#6f8795", metalness: 0.3, roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.8, emissive: WARM.clone(), emissiveIntensity: 0 }),
    dark: new THREE.MeshStandardMaterial({ color: "#1a1d1c", roughness: 0.9, transparent: true }),
    hit: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  }), []);
  const pool = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, dt) => {
    const st = store.getState();
    const dimmed = st.hoveredFloor != null && st.hoveredFloor !== level && s.current.hover < 0.5;
    const h = s.current.hover;
    const flicker = 0.75 + 0.25 * Math.abs(Math.sin(level * 12.9898));
    const glow = atmos.glow * flicker * s.current.appear;
    mats.glass.emissive.copy(WARM).lerp(GOLD, h);
    mats.glass.emissiveIntensity = glow * (dimmed ? 0.45 : 1) + h * 0.9;
    mats.glass.opacity = dimmed ? 0.45 : 0.8;
    mats.slab.emissive.copy(GOLD);
    mats.slab.emissiveIntensity = h * 0.45;
    mats.slab.opacity = dimmed ? 0.45 : 1;
    mats.dark.opacity = dimmed ? 0.45 : 1;
    if (pool.current) pool.current.emissiveIntensity = 0.5 + 0.35 * Math.sin(clock.elapsedTime * 1.6 + dt) + atmos.glow * 0.4;
  });

  const onOver = (e: { stopPropagation: () => void }) => { e.stopPropagation(); store.getState().setHovered(level); };
  const onOut = () => { if (store.getState().hoveredFloor === level) store.getState().setHovered(null); };
  const onClick = (e: { stopPropagation: () => void; delta: number }) => {
    e.stopPropagation();
    if (e.delta > 6) return; // it was a drag-rotate, not a tap
    store.getState().selectFloor(level, data.units[0]);
  };

  // footprints
  const w = type === "podium" || type === "stilt" ? 9 : type === "amenity" ? 5.4 : 4.6;
  const d = type === "podium" || type === "stilt" ? 6.6 : type === "amenity" ? 4.2 : 3.4;
  const balconyFront = level % 2 === 0;

  return (
    <group ref={group} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      {/* invisible hit volume so the whole storey is hoverable */}
      <mesh position={[0, FH / 2, 0]} material={mats.hit}><boxGeometry args={[w, FH, d]} /></mesh>

      {/* slab */}
      <mesh position={[0, 0.05, 0]} material={mats.slab} castShadow receiveShadow><boxGeometry args={[w + 0.1, 0.1, d + 0.1]} /></mesh>

      {type === "stilt" && (
        <>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1], [0, 1]].map(([x, z], i) => (
            <mesh key={i} position={[x * (w / 2 - 0.3), FH / 2, z * (d / 2 - 0.3)]} material={mats.slab} castShadow><boxGeometry args={[0.32, FH, 0.32]} /></mesh>
          ))}
          <mesh position={[0, FH / 2, 0]} material={mats.dark}><boxGeometry args={[w - 0.6, FH - 0.2, d - 0.6]} /></mesh>
        </>
      )}

      {type === "podium" && (
        <>
          <mesh position={[0, FH / 2 + 0.05, 0]} material={mats.glass} castShadow><boxGeometry args={[w - 0.2, FH - 0.1, d - 0.2]} /></mesh>
          {/* podium-roof pool deck */}
          <mesh position={[2.6, FH + 0.02, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.6, 1.3]} />
            <meshStandardMaterial ref={pool} color="#5fb7cf" emissive="#5fb7cf" emissiveIntensity={0.5} roughness={0.05} metalness={0.4} />
          </mesh>
        </>
      )}

      {(type === "residential" || type === "amenity") && (
        <>
          <mesh position={[0, FH / 2 + 0.05, 0]} material={mats.glass} castShadow><boxGeometry args={[w - 0.12, FH - 0.12, d - 0.12]} /></mesh>
          {/* mullions */}
          {[-0.33, 0, 0.33].map((x, i) => (
            <mesh key={i} position={[x * w, FH / 2 + 0.05, d / 2 - 0.04]} material={mats.slab}><boxGeometry args={[0.05, FH - 0.1, 0.05]} /></mesh>
          ))}
          {/* alternating offset balconies */}
          {balconyFront ? (
            <>
              <mesh position={[0, 0.1, d / 2 + 0.38]} material={mats.slab} castShadow><boxGeometry args={[w * 0.7, 0.06, 0.76]} /></mesh>
              <mesh position={[0, 0.34, d / 2 + 0.74]} material={mats.glass}><boxGeometry args={[w * 0.7, 0.4, 0.02]} /></mesh>
            </>
          ) : (
            <>
              <mesh position={[w / 2 + 0.38, 0.1, 0]} material={mats.slab} castShadow><boxGeometry args={[0.76, 0.06, d * 0.7]} /></mesh>
              <mesh position={[w / 2 + 0.74, 0.34, 0]} material={mats.glass}><boxGeometry args={[0.02, 0.4, d * 0.7]} /></mesh>
            </>
          )}
        </>
      )}

      {type === "amenity" && (
        <>
          {/* rooftop crown + infinity pool glow */}
          <mesh position={[0, FH + 0.06, 0]} material={mats.slab} castShadow><boxGeometry args={[w + 0.5, 0.12, d + 0.5]} /></mesh>
          <mesh position={[0, FH + 0.14, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w * 0.6, d * 0.45]} />
            <meshStandardMaterial ref={pool} color="#7fd0e6" emissive="#7fd0e6" emissiveIntensity={0.8} roughness={0.05} metalness={0.3} />
          </mesh>
          {[-1, 1].map((x) => [-1, 1].map((z) => (
            <mesh key={`${x}${z}`} position={[x * (w / 2 - 0.1), FH + 0.5, z * (d / 2 - 0.1)]} material={mats.slab}><boxGeometry args={[0.08, 0.8, 0.08]} /></mesh>
          )))}
          <mesh position={[0, FH + 0.95, 0]} material={mats.slab}><boxGeometry args={[w + 0.4, 0.08, d + 0.4]} /></mesh>
        </>
      )}
    </group>
  );
}
