"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { heroState } from "./heroState";
import { progress } from "@/lib/utils";

/**
 * The round "partnership" end of the C. A glossy emissive sphere rather than
 * MeshTransmissionMaterial, which would cost an extra full render pass.
 */
export function PartnerOrb({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const pulse = 1 + (Math.sin(state.clock.elapsedTime * 1.6) * 0.5 + 0.5) * 0.06; // 1 → 1.06
    m.scale.setScalar(pulse);
    // Follow the innermost ring as it moves back in depth.
    m.position.z = 6 * -0.6 * progress(heroState.progress, 0, 0.3);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.35, 48, 48]} />
      <meshPhysicalMaterial
        color="#5E0094"
        emissive="#7A00AE"
        emissiveIntensity={0.6}
        roughness={0.12}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.05}
      />
    </mesh>
  );
}
