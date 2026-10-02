"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const PALETTE = ["#D900FD", "#BB00E5", "#9E00C9", "#7A00AE", "#5F2C89", "#F5F0FA"];

/** Deterministic PRNG so the field is stable across remounts. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One Points object, one draw call: a slowly drifting spherical shell. */
export function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const rand = mulberry32(7);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // Uniform direction, radius in a shell 3 → 7.
      const u = rand() * 2 - 1;
      const theta = rand() * Math.PI * 2;
      const r = 3 + rand() * 4;
      const s = Math.sqrt(1 - u * u);
      positions.set([r * s * Math.cos(theta), r * u, r * s * Math.sin(theta) - 1], i * 3);
      color.set(PALETTE[Math.floor(rand() * PALETTE.length)]);
      colors.set([color.r, color.g, color.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    p.rotation.y = t * 0.02;
    p.rotation.x = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
