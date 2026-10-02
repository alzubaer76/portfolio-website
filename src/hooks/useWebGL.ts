"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | undefined;

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/**
 * Hardware-accelerated WebGL2 only. Software rasterisers (SwiftShader,
 * llvmpipe…) render the hero on the CPU — janky, battery-draining, and they
 * wreck main-thread metrics — so those devices get the static fallback.
 * Append `?3d=1` to the URL to force the scene anyway (QA on GPU-less machines).
 */
function detect(): boolean {
  if (cached !== undefined) return cached;
  try {
    if (new URLSearchParams(window.location.search).get("3d") === "1") return (cached = true);
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return (cached = false);
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    cached = !SOFTWARE_RENDERER.test(renderer);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

const noop = () => () => {};

/** `null` on the server / during hydration, then whether fast WebGL2 is available. */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(noop, detect, () => null);
}
