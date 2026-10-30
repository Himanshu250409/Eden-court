"use client";
import { useEffect, useMemo, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { FH, MID_Y } from "./constants";

interface Controls {
  target: THREE.Vector3; autoRotate: boolean; update: () => void;
  enableRotate: boolean; enableZoom: boolean; domElement: HTMLElement;
}

/**
 * Orbit camera: slow auto-orbit when idle, drag to rotate, pinch/scroll to zoom (limited).
 * Glides to the selected floor when the plan panel is open; returns to orbit when it is minimised.
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as unknown as Controls | null;
  const last = useRef("free");
  const t = useRef(10);
  const off = useMemo(() => new THREE.Vector3(), []);

  // Touch devices: keep vertical swipes for page scroll (no drag-rotate), orbit stays automatic.
  useEffect(() => {
    if (!controls) return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      controls.enableRotate = false;
      controls.enableZoom = false;
      controls.domElement.style.touchAction = "pan-y";
    }
  }, [controls]);

  useFrame((_, dt) => {
    if (!controls) return;
    const st = useStore.getState();
    const focused = st.selectedFloor != null && st.isPanelOpen && !st.isPanelMinimised;
    const key = focused ? `${st.selectedFloor}-${st.insideUnit}` : "free";
    if (key !== last.current) { last.current = key; t.current = 0; }
    t.current += dt;
    controls.autoRotate = !focused;

    const k = 1 - Math.exp(-dt * 3);
    if (focused || t.current < 2.4) {
      const ty = focused ? (st.selectedFloor as number) * FH + FH / 2 : MID_Y;
      controls.target.y = THREE.MathUtils.lerp(controls.target.y, ty, k);
      const wanted = focused ? (st.insideUnit ? 5 : 9.5) : 20;
      off.copy(camera.position).sub(controls.target);
      off.setLength(THREE.MathUtils.lerp(off.length(), wanted, k));
      camera.position.copy(controls.target).add(off);
    }
    controls.update();
  });

  return (
    <OrbitControls
      makeDefault enablePan={false} enableDamping dampingFactor={0.06}
      minDistance={4.5} maxDistance={34} minPolarAngle={0.5} maxPolarAngle={1.52}
      autoRotateSpeed={0.45} target={[0, MID_Y, 0]}
    />
  );
}
