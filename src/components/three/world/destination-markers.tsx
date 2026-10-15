"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { DESTINATIONS, useExperience } from "@/store/experience";

/**
 * Glowing beacons above each destination plinth.
 * Each beacon floats, emits light, and is clickable. Floating text labels
 * are rendered in the DOM HUD (see HudLabels) for reliability — not via
 * drei <Html>, which causes React root races during R3F render.
 *
 * Beacons expose their world position via the shared labelsState so the HUD
 * can project them to screen space each frame.
 */

export type LabelScreen = {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  visible: boolean;
  x: number;
  y: number;
  z: number; // depth for sorting
};

// Shared mutable state read by the HUD label layer
export const labelsState: LabelScreen[] = DESTINATIONS.map((d) => ({
  id: d.id,
  name: d.name,
  subtitle: d.subtitle,
  color: d.color,
  visible: false,
  x: 0,
  y: 0,
  z: 0,
}));

export function DestinationMarkers() {
  return (
    <group>
      {DESTINATIONS.map((d) => (
        <Beacon key={d.id} destination={d} />
      ))}
    </group>
  );
}

function Beacon({
  destination,
}: {
  destination: (typeof DESTINATIONS)[number];
}) {
  const beaconRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const nearby = useExperience((s) => s.nearbyDestination === destination.id);
  const openPanel = useExperience((s) => s.openPanel);
  const { camera } = useThree();

  const color = useMemo(() => new THREE.Color(destination.color), [destination.color]);
  const labelRef = useRef(
    labelsState.find((l) => l.id === destination.id)!,
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beaconRef.current) {
      beaconRef.current.position.y = 2.6 + Math.sin(t * 1.4) * 0.12;
      beaconRef.current.rotation.y = t * 0.4;
    }
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const pulse = 0.5 + Math.sin(t * 2.2) * 0.25;
      mat.opacity = (nearby ? 0.85 : hovered ? 0.7 : 0.4) * pulse;
      const s = 1 + Math.sin(t * 2.2) * 0.06;
      ringRef.current.scale.set(s, s, s);
    }

    // Project beacon world position to screen for HUD labels
    const worldPos = new THREE.Vector3(
      destination.position[0],
      destination.position[1] + 3.6,
      destination.position[2],
    );
    const ndc = worldPos.clone().project(camera);
    const lbl = labelRef.current;
    if (lbl) {
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      lbl.x = (ndc.x * 0.5 + 0.5) * vw;
      lbl.y = (-ndc.y * 0.5 + 0.5) * vh;
      lbl.z = ndc.z;
      // Visible if in front of camera (ndc.z < 1) and roughly on-screen
      // (allow generous margin so edge labels still show)
      lbl.visible =
        ndc.z < 1 &&
        ndc.x > -1.6 &&
        ndc.x < 1.6 &&
        ndc.y > -1.6 &&
        ndc.y < 1.6;
    }
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    openPanel(destination.id);
  };

  return (
    <group position={destination.position}>
      {/* Beacon crystal */}
      <group
        ref={beaconRef}
        position={[0, 2.6, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={onClick}
      >
        <mesh>
          <octahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || nearby ? 2.2 : 1.4}
            transparent
            opacity={0.92}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
        <pointLight
          color={color}
          intensity={hovered || nearby ? 4 : 2.2}
          distance={8}
        />
      </group>

      {/* Ground ring indicator */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.42, 0]}>
        <ringGeometry args={[1.1, 1.3, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
