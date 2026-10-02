"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { LogoRings } from "./LogoRings";
import { Particles } from "./Particles";

interface HeroCanvasProps {
  /** Render loop on/off — off when the hero is out of view or the tab is hidden. */
  active: boolean;
  desktop: boolean;
  interactive: boolean;
  /** Called once, after the first frame has rendered. */
  onReady?: () => void;
}

function FirstFrame({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => onReady?.());
  });
  return null;
}

export default function HeroCanvas({ active, desktop, interactive, onReady }: HeroCanvasProps) {
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.75]);
  const [bloom, setBloom] = useState(true);

  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 40, position: [0, 0, 7], near: 0.1, far: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setBloom(false);
        }}
      />

      <ambientLight intensity={0.4} />
      <pointLight position={[-4, 3, 3]} color="#D900FD" intensity={8} decay={1} />
      <pointLight position={[4, -3, 2]} color="#7A00AE" intensity={6} decay={1} />

      {/* Cheap studio env built from lightformers: no HDR download. Rendered once. */}
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, 4, 4]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={3} color="#D900FD" position={[-5, 1, 2]} scale={[2, 6, 1]} />
        <Lightformer form="ring" intensity={2} color="#9E00C9" position={[5, -2, 3]} scale={3} />
      </Environment>

      <FirstFrame onReady={onReady} />
      <LogoRings interactive={interactive} />
      <Particles count={desktop ? 800 : 300} />

      {desktop && bloom && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.8} luminanceThreshold={0.2} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  );
}
