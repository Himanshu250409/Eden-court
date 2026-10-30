"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TOD, atmos } from "./constants";
import { useStore } from "@/store/useStore";

const rand = (seed: number) => { const x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x); };

/** Ground, roads, neighbouring low-rise, swaying trees, moving cars, drifting clouds & birds. */
export default function Life({ low }: { low: boolean }) {
  const groundMat = useRef<THREE.MeshStandardMaterial>(null);
  const trees = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);
  const cars = useRef<THREE.InstancedMesh>(null);
  const clouds = useRef<THREE.Group>(null);
  const birds = useRef<THREE.Group>(null);

  const treePos = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < (low ? 20 : 44); i++) {
      const a = rand(i + 1) * Math.PI * 2;
      const r = 6 + rand(i + 50) * 14;
      out.push([Math.cos(a) * r, 0, Math.sin(a) * r * 0.8]);
    }
    return out.filter(([x, , z]) => Math.abs(z) > 4.2 || Math.abs(x) > 5.2); // keep clear of the podium
  }, [low]);

  const neighbours = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      x: (i % 4) * 9 - 20 + rand(i) * 3, z: -16 - Math.floor(i / 4) * 8, w: 4 + rand(i + 3) * 3, h: 1.5 + rand(i + 7) * 3,
    })),
    [],
  );

  const tmp = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const tod = TOD[useStore.getState().timeOfDay];
    // ease atmosphere values
    atmos.glow += (tod.glow - atmos.glow) * (1 - Math.exp(-dt * 2));
    if (groundMat.current) groundMat.current.color.lerp(col.set(tod.ground), 1 - Math.exp(-dt * 2));

    if (trees.current && crowns.current) {
      treePos.forEach(([x, , z], i) => {
        const sway = Math.sin(t * 1.1 + i) * 0.04;
        tmp.position.set(x, 0.5, z); tmp.rotation.set(0, 0, sway * 0.3); tmp.scale.set(1, 1, 1); tmp.updateMatrix();
        trees.current!.setMatrixAt(i, tmp.matrix);
        tmp.position.set(x + sway, 1.5, z); tmp.rotation.set(0, 0, sway); tmp.scale.setScalar(1 + 0.4 * rand(i)); tmp.updateMatrix();
        crowns.current!.setMatrixAt(i, tmp.matrix);
      });
      trees.current.instanceMatrix.needsUpdate = true;
      crowns.current.instanceMatrix.needsUpdate = true;
    }
    if (cars.current) {
      for (let i = 0; i < 8; i++) {
        const dir = i % 2 ? 1 : -1;
        const x = ((t * (1.4 + i * 0.15) * dir + i * 9) % 60) - 30;
        tmp.position.set(x, 0.12, i % 2 ? 11.4 : 12.6); tmp.rotation.set(0, 0, 0); tmp.scale.set(1, 1, 1); tmp.updateMatrix();
        cars.current.setMatrixAt(i, tmp.matrix);
      }
      cars.current.instanceMatrix.needsUpdate = true;
    }
    if (clouds.current) clouds.current.children.forEach((c, i) => { c.position.x = ((c.position.x + dt * (0.25 + i * 0.05) + 40) % 80) - 40; });
    if (birds.current) birds.current.children.forEach((b, i) => {
      const a = t * 0.3 + i * 1.7;
      b.position.set(Math.cos(a) * (14 + i * 2), 13 + Math.sin(a * 2) * 1.2, Math.sin(a) * (14 + i * 2));
      b.rotation.y = -a; b.scale.y = 0.5 + Math.abs(Math.sin(t * 8 + i)) * 0.8;
    });
  });

  return (
    <group>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[70, 64]} />
        <meshStandardMaterial ref={groundMat} color="#55654a" roughness={1} />
      </mesh>
      {/* roads */}
      {[12, -12].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]}><planeGeometry args={[120, 3]} /><meshStandardMaterial color="#26282a" roughness={0.9} /></mesh>
      ))}
      {/* neighbouring low-rise */}
      {neighbours.map((n, i) => (
        <mesh key={i} position={[n.x, n.h / 2, n.z]} castShadow receiveShadow>
          <boxGeometry args={[n.w, n.h, n.w * 0.8]} /><meshStandardMaterial color="#b9ad9a" roughness={0.9} />
        </mesh>
      ))}
      {/* trees */}
      <instancedMesh ref={trees} args={[undefined, undefined, treePos.length]} castShadow><cylinderGeometry args={[0.07, 0.1, 1, 6]} /><meshStandardMaterial color="#4a3b2c" /></instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, treePos.length]} castShadow><icosahedronGeometry args={[0.7, 1]} /><meshStandardMaterial color="#3f6a3a" roughness={0.9} /></instancedMesh>
      {/* cars */}
      <instancedMesh ref={cars} args={[undefined, undefined, 8]}><boxGeometry args={[0.7, 0.22, 0.34]} /><meshStandardMaterial color="#d8d2c4" emissive="#ffd9a0" emissiveIntensity={0.25} /></instancedMesh>
      {/* clouds */}
      <group ref={clouds}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} position={[-30 + i * 16, 20 + (i % 3) * 3, -10 - i * 4]}>
            {[0, 1, 2].map((j) => (<mesh key={j} position={[j * 1.6, (j % 2) * 0.4, 0]} scale={[2.4, 1, 1.4]}><sphereGeometry args={[1.4, 12, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.28} depthWrite={false} /></mesh>))}
          </group>
        ))}
      </group>
      {/* birds */}
      <group ref={birds}>
        {[0, 1, 2, 3, 4].map((i) => (<mesh key={i}><boxGeometry args={[0.5, 0.02, 0.12]} /><meshBasicMaterial color="#222" /></mesh>))}
      </group>
    </group>
  );
}
