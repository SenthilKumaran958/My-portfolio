"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DESTINATIONS, useExperience } from "@/store/experience";

/**
 * First-person controller: pointer-lock + WASD on desktop.
 * Touch-look + on-screen joystick handled by HUD on mobile.
 * Camera constrained to a sensible play area and pitch range.
 */

const EYE_HEIGHT = 1.6;
const MOVE_SPEED = 7;
const BOUNDARY = 38; // outer play radius
const PITCH_LIMIT = (Math.PI / 180) * 60;

export function CameraController({
  joystickRef,
  lookRef,
}: {
  joystickRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isLocked = useRef(false);
  const setNearby = useExperience((s) => s.setNearbyDestination);
  const nearby = useExperience((s) => s.nearbyDestination);
  const setInstructionsSeen = useExperience((s) => s.setInstructionsSeen);
  const quality = useExperience((s) => s.quality);
  const vel = useRef(new THREE.Vector3());

  // Initial camera placement — center of plaza, looking north
  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 2);
    yaw.current = 0;
    pitch.current = 0;
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  // Keyboard listeners (only when canvas focused / pointer locked)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (
        ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code,
        )
      ) {
        setInstructionsSeen(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [setInstructionsSeen]);

  // Pointer lock handling
  useEffect(() => {
    const canvas = gl.domElement;
    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };
    document.addEventListener("pointerlockchange", onLockChange);
    const onMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      const sens = 0.0022;
      yaw.current -= e.movementX * sens;
      pitch.current -= e.movementY * sens;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
    };
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("pointerlockchange", onLockChange);
      document.removeEventListener("mousemove", onMove);
    };
  }, [gl]);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);

    // Touch look (mobile) applied via lookRef deltas
    if (lookRef.current.x || lookRef.current.y) {
      yaw.current -= lookRef.current.x * 0.005;
      pitch.current -= lookRef.current.y * 0.005;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
      lookRef.current.x = 0;
      lookRef.current.y = 0;
    }

    // Apply rotation to camera (YXZ order: yaw then pitch)
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

    // Movement vector
    const forward = new THREE.Vector3(
      -Math.sin(yaw.current),
      0,
      -Math.cos(yaw.current),
    );
    const right = new THREE.Vector3(
      Math.cos(yaw.current),
      0,
      -Math.sin(yaw.current),
    );

    const move = new THREE.Vector3();
    if (keys.current["KeyW"] || keys.current["ArrowUp"]) move.add(forward);
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) move.sub(forward);
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) move.add(right);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) move.sub(right);

    // Joystick (mobile)
    if (joystickRef.current.x || joystickRef.current.y) {
      move.add(right.clone().multiplyScalar(joystickRef.current.x));
      move.add(forward.clone().multiplyScalar(-joystickRef.current.y));
    }

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(MOVE_SPEED * dt * (quality === "reduced" ? 1.2 : 1));
      vel.current.lerp(move, 0.4);
    } else {
      vel.current.lerp(new THREE.Vector3(), 0.2);
    }

    // Compute next position in a local vector, then apply via setter
    const next = camera.position.clone().add(vel.current);
    next.y = EYE_HEIGHT;

    // Keep player inside circular boundary
    const distFromCenter = Math.hypot(next.x, next.z);
    if (distFromCenter > BOUNDARY) {
      const scale = BOUNDARY / distFromCenter;
      next.x *= scale;
      next.z *= scale;
    }
    camera.position.set(next.x, next.y, next.z);

    // Destination proximity detection
    let closestId: (typeof DESTINATIONS)[number]["id"] | null = null;
    let closestDist = Infinity;
    for (const d of DESTINATIONS) {
      const dx = camera.position.x - d.position[0];
      const dz = camera.position.z - d.position[2];
      const dist = Math.hypot(dx, dz);
      if (dist < 4.5 && dist < closestDist) {
        closestDist = dist;
        closestId = d.id;
      }
    }
    if (closestId !== nearby) {
      setNearby(closestId);
    }
  });

  return null;
}
