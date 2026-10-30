"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { floors } from "@/data/floors";
import Floor, { useFloorMotion } from "./Floor";
import Life from "./Life";
import CameraRig from "./CameraRig";
import { TOD } from "./constants";

/** Lerps sky colour, fog and lights between Morning / Golden hour / Night. */
function Atmosphere({ low }: { low: boolean }) {
  const scene = useThree((s) => s.scene);
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const c = useRef(new THREE.Color());
  useEffect(() => { scene.background = new THREE.Color(TOD.golden.bg); scene.fog = new THREE.Fog(TOD.golden.fog, 28, 95); }, [scene]);
  useFrame((_, dt) => {
    const p = TOD[useStore.getState().timeOfDay];
    const k = 1 - Math.exp(-dt * 2);
    (scene.background as THREE.Color).lerp(c.current.set(p.bg), k);
    (scene.fog as THREE.Fog).color.lerp(c.current.set(p.fog), k);
    if (sun.current) {
      sun.current.color.lerp(c.current.set(p.sun), k);
      sun.current.intensity = THREE.MathUtils.lerp(sun.current.intensity, p.sunI, k);
      sun.current.position.lerp(new THREE.Vector3(...p.sunPos), k);
    }
    if (amb.current) {
      amb.current.color.lerp(c.current.set(p.ambColor), k);
      amb.current.intensity = THREE.MathUtils.lerp(amb.current.intensity, p.amb, k);
    }
  });
  return (
    <>
      <ambientLight ref={amb} intensity={0.55} />
      <directionalLight ref={sun} position={[-16, 7, 11]} intensity={2.6} castShadow={!low}
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={24} shadow-camera-bottom={-6} shadow-bias={-0.0004} />
      {/* procedural "HDRI": light cards, no external download */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffd9b0" position={[-8, 4, 6]} scale={[14, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#9fb8ff" position={[8, 6, -6]} scale={[12, 6, 1]} />
        <Lightformer form="ring" intensity={0.8} color="#ffffff" position={[0, 12, 0]} scale={8} />
      </Environment>
    </>
  );
}

/** If /models/tower.glb exists, floors named Floor_01 … Floor_NN get the same hover / click / explode behaviour. */
function GlbFloor({ object, level }: { object: THREE.Object3D; level: number }) {
  const { group } = useFloorMotion(level);
  const store = useStore;
  return (
    <group ref={group}
      onPointerOver={(e) => { e.stopPropagation(); store.getState().setHovered(level); }}
      onPointerOut={() => { if (store.getState().hoveredFloor === level) store.getState().setHovered(null); }}
      onClick={(e) => { e.stopPropagation(); if (e.delta > 6) return; store.getState().selectFloor(level, floors[level]?.units[0]); }}>
      <primitive object={object} position={[0, 0, 0]} />
    </group>
  );
}
function GlbTower() {
  const { scene } = useGLTF("/models/tower.glb", true); // true = Draco decoder from CDN
  const parts = scene.children.filter((c) => /^Floor_\d+$/i.test(c.name));
  return <>{parts.map((p) => <GlbFloor key={p.name} object={p} level={parseInt(p.name.split("_")[1], 10)} />)}</>;
}

function Scene({ low }: { low: boolean }) {
  const [hasGlb, setHasGlb] = useState(false);
  useEffect(() => { fetch("/models/tower.glb", { method: "HEAD" }).then((r) => setHasGlb(r.ok)).catch(() => setHasGlb(false)); }, []);
  return (
    <>
      <Atmosphere low={low} />
      <CameraRig />
      <Life low={low} />
      {hasGlb ? <Suspense fallback={null}><GlbTower /></Suspense> : floors.map((f) => <Floor key={f.level} data={f} />)}
      {!low && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.7} intensity={0.55} />
          <Vignette offset={0.25} darkness={0.55} />
          <Noise opacity={0.04} />
        </EffectComposer>
      )}
    </>
  );
}

export default function TowerCanvas() {
  const [low, setLow] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  return (
    <div className="absolute inset-0" data-tower-canvas data-cursor="Drag">
      <Canvas
        shadows={!low} dpr={dpr} camera={{ position: [17, 10, 17], fov: 36 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => useStore.getState().minimise()} // tap outside the tower → minimise panel
      >
        {/* adaptive quality: drop pixel ratio + postprocessing on low-end devices */}
        <PerformanceMonitor onDecline={() => { setLow(true); setDpr([1, 1]); }} onIncline={() => { setLow(false); setDpr([1, 1.75]); }} />
        <Suspense fallback={null}><Scene low={low} /></Suspense>
      </Canvas>
    </div>
  );
}
