"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { lerp, progress } from "@/lib/utils";
import { heroState } from "./heroState";
import { PartnerOrb } from "./PartnerOrb";

const RADII = [2.2, 1.95, 1.72, 1.5, 1.3, 1.12, 0.96];
const COLORS = ["#D900FD", "#C900F2", "#BB00E5", "#9E00C9", "#8A00BC", "#7A00AE", "#5E0094"];
/** Ring *thickness* tapers 0.16 → 0.09 (Three's `tube` arg is a radius, so it's halved below). */
const THICK_OUTER = 0.16;
const THICK_INNER = 0.09;
const ARC = Math.PI * 1.55; // ≈280°
/** Rotate so the 80° gap is centred on +x (the C opens to the right). */
const OPEN_RIGHT = (Math.PI * 2 - ARC) / 2;
const BASE_FOV_HALF = THREE.MathUtils.degToRad(20);
const CAMERA_Z = 7;

/** Inner end of the innermost arc — where the logo's round "partnership" end sits. */
const INNER_END_ANGLE = OPEN_RIGHT + ARC;
export const ORB_POSITION: [number, number, number] = [
  Math.cos(INNER_END_ANGLE) * RADII[6],
  Math.sin(INNER_END_ANGLE) * RADII[6],
  0,
];

export function LogoRings({ interactive }: { interactive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const size = useThree((s) => s.size);

  const geometries = useMemo(
    () =>
      RADII.map((r, i) => {
        const thickness = lerp(THICK_OUTER, THICK_INNER, i / (RADII.length - 1));
        return new THREE.TorusGeometry(r, thickness / 2, 32, 160, ARC);
      }),
    [],
  );
  // Geometries passed via props aren't auto-disposed by R3F: free the GPU buffers on unmount.
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  // Layout derived from the canvas size at the base camera distance (not the
  // live camera, which flies forward during the scroll sequence).
  const layout = useMemo(() => {
    const aspect = size.width / size.height;
    const visibleH = 2 * CAMERA_Z * Math.tan(BASE_FOV_HALF);
    const visibleW = visibleH * aspect;
    const desktop = size.width >= 1024;
    // Fit the 4.4-unit-wide C into the space we want it to occupy (right ~40% on desktop).
    const scale = desktop ? Math.min(0.85, (visibleW * 0.36) / 4.6) : Math.min(0.85, (visibleW * 0.95) / 4.6);
    return {
      aspect,
      scale,
      x: desktop ? visibleW * 0.27 : 0,
      y: desktop ? 0 : visibleH * 0.08,
    };
  }, [size.width, size.height]);

  useFrame((state, delta) => {
    const g = group.current;
    const t = tilt.current;
    if (!g || !t) return;
    const time = state.clock.elapsedTime;
    const p = heroState.progress;
    const p1 = progress(p, 0, 0.3); // open up
    const p2 = progress(p, 0.3, 0.7); // fly through
    const p3 = progress(p, 0.7, 1); // shrink + exit

    // Each ring: idle wobble (independent phase) + scroll-driven depth/fan.
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.x = Math.sin(time * 0.6 + i * 0.55) * 0.08;
      ring.rotation.y = Math.cos(time * 0.5 + i * 0.7) * 0.08;
      ring.rotation.z = OPEN_RIGHT + (i - 3) * 0.07 * p1;
      ring.position.z = i * -0.6 * p1;
    });

    // Every scroll-driven value is a pure function of progress, so scrolling
    // back up restores the exact initial state.
    g.rotation.z = (Math.PI / 2) * p2;
    const s = layout.scale * lerp(1, 0.4, p3);
    g.scale.setScalar(s);
    const camZ = lerp(CAMERA_Z, 1.2, p2);
    state.camera.position.z = camZ;
    // Exit: the camera now sits at z=1.2, so "top-right" is measured in the
    // frustum at the group's distance from the camera, not at the base z=7.
    const z = lerp(0, -2.5, p3);
    const halfH = (camZ - z) * Math.tan(BASE_FOV_HALF);
    const exitX = halfH * layout.aspect * 0.6;
    const exitY = halfH * 0.55;
    g.position.set(lerp(layout.x, exitX, p3), lerp(layout.y, exitY, p3), z);

    // Pointer tilt (desktop only), eased; fades out as the sequence starts.
    const k = 1 - Math.min(1, p * 4);
    const tx = interactive ? heroState.pointerX * 0.2 * k : 0;
    const ty = interactive ? -heroState.pointerY * 0.2 * k : 0;
    const ease = 1 - Math.pow(0.95, delta * 60); // ≈0.05 per frame at 60fps
    t.rotation.y += (tx - t.rotation.y) * ease;
    t.rotation.x += (ty - t.rotation.x) * ease;
  });

  return (
    <group ref={group}>
      <group ref={tilt}>
        {geometries.map((geometry, i) => (
          <mesh
            key={i}
            ref={(el) => {
              rings.current[i] = el;
            }}
            geometry={geometry}
            rotation-z={OPEN_RIGHT}
          >
            <meshPhysicalMaterial
              color={COLORS[i]}
              emissive={COLORS[i]}
              emissiveIntensity={0.25}
              roughness={0.25}
              metalness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.2}
            />
          </mesh>
        ))}
        <PartnerOrb position={ORB_POSITION} />
      </group>
    </group>
  );
}
