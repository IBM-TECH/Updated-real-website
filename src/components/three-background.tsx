import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars, Wireframe } from "@react-three/drei";
import * as THREE from "three";

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

function HexObject() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x += 0.002;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.15} />
        <Wireframe stroke={"#ff00e5"} fillOpacity={0} thickness={0.02} />
      </mesh>
    </Float>
  );
}

function CssFallbackBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(0,240,255,0.10), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(255,0,229,0.10), transparent 55%), radial-gradient(ellipse at 60% 20%, rgba(168,85,247,0.08), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen animate-pulse"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(0,240,255,0.04), rgba(255,0,229,0.04), rgba(168,85,247,0.04), rgba(0,240,255,0.04))",
          animationDuration: "12s",
        }}
      />
    </div>
  );
}

export default function ThreeBackground() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebGL(detectWebGL());
  }, []);

  if (hasWebGL === null) {
    return <CssFallbackBackground />;
  }

  if (!hasWebGL) {
    return <CssFallbackBackground />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => {
        // OK
      }}
      fallback={<CssFallbackBackground />}
    >
      <fog attach="fog" args={["#0a0a0a", 5, 15]} />
      <ambientLight intensity={0.5} />
      <Sparkles count={150} scale={12} size={1} speed={0.4} opacity={0.2} color="#00f0ff" />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      <group position={[3, 0, -2]}>
        <HexObject />
      </group>
    </Canvas>
  );
}
