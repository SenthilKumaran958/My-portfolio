"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Procedural moonlit ancient world geometry.
 * No external model files required — built from primitives so it loads fast
 * and runs on modest GPUs. All static geometry is merged for performance.
 *
 * Layout (top-down, X right, Z into screen):
 *   - Central plaza at origin (0,0,0)
 *   - Stone path leading north to each of 3 destinations
 *   - Destination plinths at the three marker positions
 *   - Ruined pillars + arches scattered for composition
 *   - Ring of distant mountains as a skyline
 */

const MOONLIGHT = 0x9bb8d6;
const STONE = 0x2a2b34;
const STONE_LIGHT = 0x3a3c48;
const STONE_DARK = 0x16161e;
const MOSS = 0x2b3a30;

export function WorldGeometry() {
  return (
    <group>
      <Ground />
      <CentralPlaza />
      <Paths />
      <DestinationPlinths />
      <Ruins />
      <Mountains />
    </group>
  );
}

function Ground() {
  // Large dark ground with subtle noise via vertex color variation
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      receiveShadow
    >
      <circleGeometry args={[80, 64]} />
      <meshStandardMaterial
        color={STONE_DARK}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function CentralPlaza() {
  // A raised circular stone plaza at the spawn point
  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <ringGeometry args={[3.2, 4, 48]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} receiveShadow>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color={STONE_LIGHT} roughness={0.85} />
      </mesh>
      {/* Decorative inset circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[1.4, 1.5, 48]} />
        <meshStandardMaterial
          color={MOONLIGHT}
          emissive={MOONLIGHT}
          emissiveIntensity={0.25}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

function Paths() {
  // Three stone paths from the plaza toward each destination
  const paths = useMemo(() => {
    const make = (target: [number, number, number]) => {
      const dx = target[0];
      const dz = target[2];
      const len = Math.hypot(dx, dz) - 1.5;
      const angle = Math.atan2(dx, -dz);
      return { len, angle, z: target[2] / 2, x: target[0] / 2 };
      void len;
    };
    return [
      make([-9, 0, -6]),
      make([0, 0, -14]),
      make([9, 0, -6]),
    ];
  }, []);

  return (
    <group>
      {paths.map((p, i) => (
        <group
          key={i}
          position={[p.x, 0.04, p.z]}
          rotation={[0, p.angle, 0]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1.6, p.len]} />
            <meshStandardMaterial color={STONE} roughness={0.95} />
          </mesh>
          {/* Path edge stones */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.7, 0.02, 0]}>
            <planeGeometry args={[0.2, p.len]} />
            <meshStandardMaterial
              color={MOONLIGHT}
              emissive={MOONLIGHT}
              emissiveIntensity={0.15}
              roughness={0.7}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.7, 0.02, 0]}>
            <planeGeometry args={[0.2, p.len]} />
            <meshStandardMaterial
              color={MOONLIGHT}
              emissive={MOONLIGHT}
              emissiveIntensity={0.15}
              roughness={0.7}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DestinationPlinths() {
  // A raised stone plinth at each destination marker position
  const positions: [number, number, number][] = [
    [-9, 0, -6],
    [0, 0, -14],
    [9, 0, -6],
  ];
  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          {/* Base */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 0.3, 3]} />
            <meshStandardMaterial color={STONE_LIGHT} roughness={0.9} />
          </mesh>
          {/* Step */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.1, 2.4]} />
            <meshStandardMaterial color={STONE} roughness={0.9} />
          </mesh>
          {/* Inner glow ring on top */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.41, 0]}>
            <ringGeometry args={[0.9, 1.05, 32]} />
            <meshStandardMaterial
              color={MOONLIGHT}
              emissive={MOONLIGHT}
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Ruins() {
  // Scattered ruined pillars, broken walls, and arches for composition.
  // Positioned to frame sightlines without blocking paths.
  const pillars = useMemo(
    () =>
      [
        { pos: [-14, 0, -10], h: 3.4, r: 0.001 },
        { pos: [-12, 0, -2], h: 2.2, r: 0.2 },
        { pos: [-6, 0, -12], h: 4.0, r: 0.001 },
        { pos: [6, 0, -12], h: 3.6, r: 0.001 },
        { pos: [12, 0, -2], h: 2.6, r: 0.15 },
        { pos: [14, 0, -10], h: 3.2, r: 0.001 },
        { pos: [-3, 0, -3], h: 1.4, r: 0.001 },
        { pos: [3, 0, -3], h: 1.4, r: 0.001 },
      ] as { pos: [number, number, number]; h: number; r: number }[],
    [],
  );

  return (
    <group>
      {pillars.map((p, i) => (
        <group key={i} position={p.pos} rotation={[p.r, i * 0.7, p.r]}>
          <mesh position={[0, p.h / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.35, 0.42, p.h, 8]} />
            <meshStandardMaterial color={STONE} roughness={0.95} />
          </mesh>
          {/* Broken top cap */}
          <mesh position={[0.05, p.h, 0.05]} castShadow>
            <boxGeometry args={[0.7, 0.18, 0.7]} />
            <meshStandardMaterial color={STONE_LIGHT} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Fallen blocks */}
      {[
        { pos: [-5, 0, -8], r: 0.3 },
        { pos: [5, 0, -9], r: -0.5 },
        { pos: [-2, 0, -16], r: 0.1 },
        { pos: [2, 0, -16], r: -0.2 },
      ].map((b, i) => (
        <mesh
          key={`fb-${i}`}
          position={[b.pos[0], 0.3, b.pos[2]]}
          rotation={[0.2, b.r, 0.1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.4, 0.6, 0.8]} />
          <meshStandardMaterial color={STONE} roughness={0.95} />
        </mesh>
      ))}

      {/* Broken archway near center-back */}
      <group position={[0, 0, -16]}>
        <mesh position={[-1.4, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 3.2, 0.5]} />
          <meshStandardMaterial color={STONE_LIGHT} roughness={0.9} />
        </mesh>
        <mesh position={[1.4, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 3.2, 0.5]} />
          <meshStandardMaterial color={STONE_LIGHT} roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.0, 0]} rotation={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[3.3, 0.5, 0.5]} />
          <meshStandardMaterial color={STONE} roughness={0.95} />
        </mesh>
      </group>

      {/* Mossy ground patches near ruins for color variation */}
      {[
        [-12, -2],
        [12, -2],
        [-6, -12],
        [6, -12],
      ].map((p, i) => (
        <mesh
          key={`moss-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[p[0], 0.03, p[1]]}
        >
          <circleGeometry args={[2, 24]} />
          <meshStandardMaterial
            color={MOSS}
            roughness={1}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Mountains() {
  // Distant jagged mountain ring as a low-detail skyline silhouette.
  const peaks = useMemo(() => {
    const arr: { angle: number; height: number; radius: number }[] = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      arr.push({
        angle,
        height: 14 + Math.sin(i * 1.7) * 8 + Math.cos(i * 0.9) * 4,
        radius: 55 + Math.sin(i * 2.3) * 6,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {peaks.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * p.radius,
            p.height / 2 - 2,
            Math.sin(p.angle) * p.radius,
          ]}
        >
          <coneGeometry args={[6, p.height, 5]} />
          <meshStandardMaterial color={STONE_DARK} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function WorldLighting() {
  return (
    <>
      {/* Ambient moonlight */}
      <ambientLight intensity={0.35} color={MOONLIGHT} />
      {/* Key moonlight from above-back */}
      <directionalLight
        position={[10, 24, -12]}
        intensity={1.1}
        color={MOONLIGHT}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={0.1}
        shadow-camera-far={80}
        shadow-bias={-0.0005}
      />
      {/* Cool fill from the side */}
      <directionalLight position={[-14, 8, 6]} intensity={0.3} color={0x6a7fa6} />
      {/* Subtle violet up-light near center for atmosphere */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={6}
        distance={10}
        color={0x8a7ab0}
      />
    </>
  );
}

export function SkyDome() {
  // A large inverted sphere with a gradient sky (night)
  const geo = useMemo(() => new THREE.SphereGeometry(70, 32, 16), []);
  const mat = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#0a0b12");
    grad.addColorStop(0.5, "#10131e");
    grad.addColorStop(1, "#1a1d2c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    // Faint stars
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 120;
      const r = Math.random() * 1.2;
      ctx.fillStyle = `rgba(220,225,240,${0.3 + Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.BackSide,
      fog: false,
    });
  }, []);

  return (
    <mesh geometry={geo} material={mat} scale={[-1, 1, 1]} />
  );
}

export function Moon() {
  // A glowing moon disc high in the sky
  return (
    <group position={[18, 26, -40]}>
      <mesh>
        <circleGeometry args={[3.2, 32]} />
        <meshBasicMaterial color={0xdfe7f5} fog={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[4.6, 32]} />
        <meshBasicMaterial
          color={0x9bb8d6}
          transparent
          opacity={0.18}
          fog={false}
        />
      </mesh>
    </group>
  );
}

export { MOONLIGHT, STONE, STONE_LIGHT, STONE_DARK };
