"use client";

import { useEffect, useRef } from "react";
import { useExperience, DESTINATIONS } from "@/store/experience";
import { labelsState, type LabelScreen } from "./hud/hud-labels";
import { loadThree } from "@/lib/three-loader";

// three.js types are loaded from the CDN at runtime; we use `any` here to
// avoid bundling three.js (which OOMs the dev compiler in this sandbox).
type ThreeModule = any;

/**
 * Raw three.js 3D experience, loaded from a CDN at runtime.
 *
 * three.js is loaded dynamically (not bundled) to avoid OOM during compile
 * in memory-constrained environments. The scene is built imperatively and
 * a single rAF loop drives movement, look, and rendering.
 *
 * Mouse-look uses the Pointer Lock API:
 *   - A click on the canvas requests pointer lock (after raycasting for
 *     beacon clicks).
 *   - While locked, mousemove (movementX/Y) rotates the camera.
 *   - Escape exits pointer lock (handled by the browser).
 *   - When a menu/panel opens, we exit pointer lock so the cursor returns
 *     and mouse movement does NOT rotate the camera.
 */

const EYE_HEIGHT = 1.7;
const MOVE_SPEED = 7.5;
const PITCH_LIMIT = (Math.PI / 180) * 62;
const BOUNDARY = 40;
const OBSTACLES = [
  { cx: 0, cz: -34, rx: 7, rz: 6 },
  { cx: -11, cz: -18, rx: 1.8, rz: 1.8 },
  { cx: 0, cz: -26, rx: 1.8, rz: 1.8 },
  { cx: 11, cz: -18, rx: 1.8, rz: 1.8 },
  { cx: 0, cz: -2, rx: 1.4, rz: 1.4 },
];

const MOONLIGHT = 0x9bb8d6;
const LANTERN_WARM = 0xff9a4a;

export function RawThreeExperience({
  joystickRef,
  lookRef,
  tickRef,
}: {
  joystickRef: React.MutableRefObject<{ x: number; y: number }>;
  lookRef: React.MutableRefObject<{ x: number; y: number }>;
  tickRef: React.MutableRefObject<(() => void) | null>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | null = null;

    loadThree()
      .then((THREE: ThreeModule) => {
        if (disposed) return;
        cleanup = buildScene(THREE, mountRef, joystickRef, lookRef, tickRef);
      })
      .catch((err) => {
        console.error("[RawThreeExperience] three.js load failed:", err);
        useExperience.getState().setMode("2d");
      });

    return () => {
      disposed = true;
      if (cleanup) cleanup();
    };
  }, [joystickRef, lookRef, tickRef]);

  return <div ref={mountRef} className="absolute inset-0" />;
}

function buildScene(
  THREE: ThreeModule,
  mountRef: React.RefObject<HTMLDivElement | null>,
  joystickRef: React.MutableRefObject<{ x: number; y: number }>,
  lookRef: React.MutableRefObject<{ x: number; y: number }>,
  tickRef: React.MutableRefObject<(() => void) | null>,
) {
  const mount = mountRef.current;
  if (!mount) return () => {};

  let width = mount.clientWidth;
  let height = mount.clientHeight;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x070810, 1);
  mount.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.cursor = "pointer";

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x10121b, 18, 70);

  const camera = new THREE.PerspectiveCamera(68, width / height, 0.1, 200);
  camera.position.set(0, EYE_HEIGHT, 6);

  // Lighting
  scene.add(new THREE.AmbientLight(MOONLIGHT, 0.32));
  const keyLight = new THREE.DirectionalLight(MOONLIGHT, 1.4);
  keyLight.position.set(14, 28, -10);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -30;
  keyLight.shadow.camera.right = 30;
  keyLight.shadow.camera.top = 30;
  keyLight.shadow.camera.bottom = -30;
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 90;
  keyLight.shadow.bias = -0.0004;
  scene.add(keyLight);
  const fill = new THREE.DirectionalLight(0x5a6a90, 0.35);
  fill.position.set(-18, 10, 8);
  scene.add(fill);
  scene.add(new THREE.HemisphereLight(0x202428, 0x140c08, 0.25));

  // Procedural canvas textures — generated to read as worn, weathered stone
  // with visible grain, cracks, and color variation (not flat primitives).
  const makeNoiseTexture = (
    base: [number, number, number],
    variance: number,
    repeat: number,
    detail = 5,
  ) => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const ctx = c.getContext("2d")!;
    // Base fill
    ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
    ctx.fillRect(0, 0, 512, 512);
    // Large blotches (worn patches / discoloration)
    for (let i = 0; i < detail * 30; i++) {
      const r = 25 + Math.random() * 120;
      const v = (Math.random() - 0.5) * variance * 1.4;
      const col = [
        Math.max(0, Math.min(255, base[0] + v)),
        Math.max(0, Math.min(255, base[1] + v)),
        Math.max(0, Math.min(255, base[2] + v)),
      ];
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},0.3)`;
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Darker mossy patches near the bottom of the texture (weathering)
    for (let i = 0; i < detail * 8; i++) {
      const r = 30 + Math.random() * 90;
      const x = Math.random() * 512;
      const y = 200 + Math.random() * 312;
      ctx.fillStyle = `rgba(${Math.max(0, base[0] - 30)},${Math.max(0, base[1] - 10)},${Math.max(0, base[2] - 25)},0.25)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Fine grain speckle
    for (let i = 0; i < 512 * 512 * 0.03; i++) {
      const v = (Math.random() - 0.5) * variance * 1.5;
      const col = [
        Math.max(0, Math.min(255, base[0] + v)),
        Math.max(0, Math.min(255, base[1] + v)),
        Math.max(0, Math.min(255, base[2] + v)),
      ];
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},0.5)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    // Crack lines (jagged dark strokes)
    ctx.strokeStyle = `rgba(${Math.max(0, base[0] - 50)},${Math.max(0, base[1] - 50)},${Math.max(0, base[2] - 50)},0.55)`;
    ctx.lineWidth = 1 + Math.random();
    for (let i = 0; i < detail * 4; i++) {
      ctx.beginPath();
      let x = Math.random() * 512;
      let y = Math.random() * 512;
      ctx.moveTo(x, y);
      const segs = 4 + Math.floor(Math.random() * 5);
      for (let s = 0; s < segs; s++) {
        x += (Math.random() - 0.5) * 80;
        y += (Math.random() - 0.5) * 80;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
    tex.anisotropy = 4;
    return tex;
  };

  // Bump/normal-ish map from speckled gradients (gives surfaces visible relief
  // under the raking moonlight without needing external normal map images).
  const makeBumpTexture = (strength = 0.7) => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256 * 256 * 0.04; i++) {
      const dx = (Math.random() - 0.5) * 70 * strength;
      const dy = (Math.random() - 0.5) * 70 * strength;
      ctx.fillStyle = `rgb(${128 + dx},${128 + dy},255)`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    // A few crack normals
    ctx.strokeStyle = "rgb(90,90,255)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      let x = Math.random() * 256;
      let y = Math.random() * 256;
      ctx.moveTo(x, y);
      for (let s = 0; s < 5; s++) {
        x += (Math.random() - 0.5) * 60;
        y += (Math.random() - 0.5) * 60;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  };

  const floorBump = makeBumpTexture(0.8);
  const wallBump = makeBumpTexture(0.6);
  const pillarBump = makeBumpTexture(0.5);

  const matFloor = new THREE.MeshStandardMaterial({
    map: makeNoiseTexture([58, 60, 70], 26, 8, 6),
    normalMap: floorBump,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughness: 0.95, metalness: 0, color: 0x9a9ca6,
  });
  const matWall = new THREE.MeshStandardMaterial({
    map: makeNoiseTexture([62, 64, 74], 28, 4, 5),
    normalMap: wallBump,
    normalScale: new THREE.Vector2(0.6, 0.6),
    roughness: 0.92, metalness: 0, color: 0x8a8c96,
  });
  const matPillar = new THREE.MeshStandardMaterial({
    map: makeNoiseTexture([78, 80, 90], 24, 2, 5),
    normalMap: pillarBump,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughness: 0.85, metalness: 0.05, color: 0xa6a8b2,
  });
  const matCapital = new THREE.MeshStandardMaterial({
    map: makeNoiseTexture([96, 96, 104], 18, 1, 4),
    roughness: 0.8, metalness: 0.05, color: 0xb4b6be,
  });
  const matRubble = new THREE.MeshStandardMaterial({
    map: makeNoiseTexture([54, 56, 64], 30, 1, 6),
    roughness: 1, metalness: 0, color: 0x7a7c86, flatShading: true,
  });
  const matMountain = new THREE.MeshStandardMaterial({
    map: makeNoiseTexture([44, 46, 56], 34, 6, 8),
    roughness: 1, metalness: 0, color: 0x6a6c78, flatShading: true,
  });
  const matMoss = new THREE.MeshStandardMaterial({
    map: makeNoiseTexture([52, 66, 52], 26, 2, 5),
    roughness: 1, metalness: 0, color: 0x4a5a44, transparent: true, opacity: 0.85,
  });
  const matWood = new THREE.MeshStandardMaterial({ color: 0x3a2a1e, roughness: 0.9, metalness: 0 });
  const matMetal = new THREE.MeshStandardMaterial({
    color: 0x2a2a30, roughness: 0.35, metalness: 0.85,
    emissive: 0x1a1410, emissiveIntensity: 0.2,
  });
  void matMoss;

  const addMesh = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x: number, y: number, z: number,
    cast = true, receive = true,
  ) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = receive;
    scene.add(m);
    return m;
  };

  // Ground
  const ground = addMesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({ color: 0x1a1c22, roughness: 1, metalness: 0 }),
    0, -0.05, 0, false, true,
  );
  ground.rotation.x = -Math.PI / 2;

  // Courtyard paving slabs
  for (let ix = -5; ix <= 5; ix++) {
    for (let iz = -2; iz <= 6; iz++) {
      const s1 = Math.sin(ix * 7.1 + iz * 3.3) * 0.5;
      const s2 = Math.sin(ix * 3.7 + iz * 11.1) * 0.5;
      const slab = addMesh(
        new THREE.BoxGeometry(1.5 + s1 * 0.04, 0.12, 1.5 + s2 * 0.04),
        matFloor.clone(),
        ix * 1.6 + s1 * 0.05, 0.02 + Math.abs(s2) * 0.015, iz * 1.6 + s2 * 0.05,
      );
      slab.rotation.set(-Math.PI / 2, s1 * 0.03, 0);
    }
  }

  // Central altar
  const altar = new THREE.Group();
  altar.position.set(0, 0, -2);
  const aBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.2, 8), matCapital);
  aBase.position.y = 0.1; aBase.castShadow = aBase.receiveShadow = true; altar.add(aBase);
  const aStep = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.1, 8), matCapital);
  aStep.position.y = 0.25; aStep.castShadow = aStep.receiveShadow = true; altar.add(aStep);
  const aStump = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.5, 1.1, 8), matPillar);
  aStump.position.y = 0.8; aStump.castShadow = aStump.receiveShadow = true; altar.add(aStump);
  const aTop = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.5), matRubble);
  aTop.position.set(0.1, 1.35, 0.05); aTop.rotation.set(0.2, 0.5, 0.15); aTop.castShadow = true; altar.add(aTop);
  scene.add(altar);

  const carvedPillar = (x: number, z: number) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.3, 0.95), matCapital);
    base.position.y = 0.15; base.castShadow = base.receiveShadow = true; g.add(base);
    const base2 = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.78), matWall);
    base2.position.y = 0.4; base2.castShadow = base2.receiveShadow = true; g.add(base2);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 3.0, 8, 6), matPillar);
    shaft.position.y = 2.0; shaft.castShadow = shaft.receiveShadow = true; g.add(shaft);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.4, 0.5, 8), matCapital);
    cap.position.y = 3.5; cap.castShadow = cap.receiveShadow = true; g.add(cap);
    const capTop = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.95), matCapital);
    capTop.position.y = 3.78; capTop.castShadow = capTop.receiveShadow = true; g.add(capTop);
    return g;
  };

  // Destination gateways
  const gateways: { pos: [number, number, number]; rot: number; accent: number }[] = [
    { pos: [-11, 0, -18], rot: 0.5, accent: 0x9bb8d6 },
    { pos: [0, 0, -26], rot: 0, accent: 0xb9a6d6 },
    { pos: [11, 0, -18], rot: -0.5, accent: 0x8fc6c9 },
  ];
  for (const g of gateways) {
    const grp = new THREE.Group();
    grp.position.set(...g.pos);
    grp.rotation.y = g.rot;
    grp.add(carvedPillar(-1.6, 0));
    grp.add(carvedPillar(1.6, 0));
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(4, 0.6, 0.9), matWall);
    lintel.position.y = 3.6; lintel.castShadow = lintel.receiveShadow = true; grp.add(lintel);
    const keystone = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.0), matCapital);
    keystone.position.y = 3.6; keystone.castShadow = true; grp.add(keystone);
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 1.4), matCapital);
    step1.position.set(0, 0.1, 1.4); step1.castShadow = step1.receiveShadow = true; grp.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.16, 1.0), matFloor);
    step2.position.set(0, 0.22, 1.1); step2.castShadow = step2.receiveShadow = true; grp.add(step2);
    const accentLight = new THREE.PointLight(g.accent, 2.4, 7, 1.5);
    accentLight.position.set(0, 1.8, 0); grp.add(accentLight);
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 3.4),
      new THREE.MeshBasicMaterial({ color: g.accent, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }),
    );
    glow.position.set(0, 1.8, 0); grp.add(glow);
    scene.add(grp);
  }

  // Approach lanterns
  const lanternPositions: [number, number, number][] = [
    [-2.2, 0, 2], [2.2, 0, 2], [-3.2, 0, -6], [3.2, 0, -6], [-2.0, 0, -14], [2.0, 0, -14],
  ];
  for (const p of lanternPositions) {
    const g = new THREE.Group();
    g.position.set(...p);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), matCapital);
    plinth.position.y = 0.25; plinth.castShadow = plinth.receiveShadow = true; g.add(plinth);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.2, 8), matMetal);
    post.position.y = 1.1; post.castShadow = true; g.add(post);
    const housing = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.5, 0.34),
      new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.6, metalness: 0.7 }),
    );
    housing.position.y = 1.95; housing.castShadow = true; g.add(housing);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshBasicMaterial({ color: LANTERN_WARM }));
    flame.position.y = 1.95; g.add(flame);
    const light = new THREE.PointLight(LANTERN_WARM, 3.2, 6, 1.8);
    light.position.y = 1.95; g.add(light);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.18, 6), new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.7, metalness: 0.6 }));
    cap.position.y = 2.25; g.add(cap);
    scene.add(g);
  }

  // Monumental temple
  const temple = new THREE.Group();
  temple.position.set(0, 0, -34);
  for (let i = 0; i < 6; i++) {
    const z = -3 + i * 0.6;
    const step = new THREE.Mesh(new THREE.BoxGeometry(16, 0.35, 0.7), matCapital);
    step.position.set(0, 0.2 + i * 0.35, z); step.castShadow = step.receiveShadow = true; temple.add(step);
  }
  const platform = new THREE.Mesh(new THREE.BoxGeometry(17, 0.6, 4), matFloor);
  platform.position.set(0, 2.5, 1.5); platform.castShadow = platform.receiveShadow = true; temple.add(platform);
  for (const x of [-5, -3.4, -1.8, 1.8, 3.4, 5]) {
    const c = new THREE.Group();
    c.position.set(x, 0, 1.5);
    const cbase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), matCapital);
    cbase.position.y = 0.4; cbase.castShadow = cbase.receiveShadow = true; c.add(cbase);
    const cshaft = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 5.5, 12, 8), matPillar);
    cshaft.position.y = 2.85; cshaft.castShadow = cshaft.receiveShadow = true; c.add(cshaft);
    const ccap = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.55, 0.5, 12), matCapital);
    ccap.position.y = 5.8; ccap.castShadow = ccap.receiveShadow = true; c.add(ccap);
    temple.add(c);
  }
  const ped1 = new THREE.Mesh(new THREE.BoxGeometry(12, 1.0, 1.4), matWall);
  ped1.position.set(-1, 8.0, 1.5); ped1.rotation.z = 0.02; ped1.castShadow = ped1.receiveShadow = true; temple.add(ped1);
  const ped2 = new THREE.Mesh(new THREE.BoxGeometry(4, 1.0, 1.4), matRubble);
  ped2.position.set(5, 7.6, 1.5); ped2.rotation.z = -0.15; ped2.castShadow = true; temple.add(ped2);
  const wall1 = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 0.6), matWall);
  wall1.position.set(-3, 5.5, 2.4); wall1.castShadow = wall1.receiveShadow = true; temple.add(wall1);
  const wall2 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 0.6), matWall);
  wall2.position.set(4, 4.5, 2.4); wall2.castShadow = wall2.receiveShadow = true; temple.add(wall2);
  const wall3 = new THREE.Mesh(new THREE.BoxGeometry(14, 7, 0.6), matWall);
  wall3.position.set(0, 5, 3.4); wall3.castShadow = wall3.receiveShadow = true; temple.add(wall3);
  const collapse = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 1.8), matRubble);
  collapse.position.set(2, 1.2, 0.5); collapse.rotation.set(0.3, 0.4, 0.2); collapse.castShadow = collapse.receiveShadow = true; temple.add(collapse);
  for (const bx of [-6, 6]) {
    const brazier = new THREE.Group();
    brazier.position.set(bx, 2.8, 1.0);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 0.6, 8), matMetal);
    bowl.castShadow = true; brazier.add(bowl);
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), new THREE.MeshBasicMaterial({ color: LANTERN_WARM }));
    ember.position.y = 0.4; brazier.add(ember);
    const bLight = new THREE.PointLight(LANTERN_WARM, 5, 9, 1.6);
    bLight.position.y = 0.5; brazier.add(bLight);
    temple.add(brazier);
  }
  scene.add(temple);

  // Trees
  const treePositions: { pos: [number, number, number]; scale: number }[] = [
    { pos: [-6, 0, 4], scale: 1.1 },
    { pos: [6, 0, 3], scale: 0.9 },
    { pos: [-8, 0, -10], scale: 1.0 },
    { pos: [8, 0, -10], scale: 1.2 },
    { pos: [-15, 0, -6], scale: 0.85 },
    { pos: [15, 0, -6], scale: 0.95 },
  ];
  for (const t of treePositions) {
    const g = new THREE.Group();
    g.position.set(...t.pos);
    g.scale.setScalar(t.scale);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.8, 6, 4), matWood);
    trunk.position.y = 1.4; trunk.castShadow = trunk.receiveShadow = true; g.add(trunk);
    const canopy = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), new THREE.MeshStandardMaterial({ color: 0x2a3a2a, roughness: 1, flatShading: true }));
    canopy.position.y = 3.2; canopy.castShadow = true; g.add(canopy);
    const canopy2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), new THREE.MeshStandardMaterial({ color: 0x33402f, roughness: 1, flatShading: true }));
    canopy2.position.set(0.6, 2.8, 0.3); canopy2.castShadow = true; g.add(canopy2);
    scene.add(g);
  }

  // Mountains (noise-deformed cones)
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2 + Math.sin(i) * 0.2;
    const radius = 48 + Math.sin(i * 1.7) * 8;
    const h = 16 + Math.sin(i * 2.3) * 10 + Math.cos(i) * 6;
    const r = 7 + Math.cos(i * 1.3) * 3;
    const geo = new THREE.ConeGeometry(r, h, 7, 5);
    const posAttr = geo.attributes.position as unknown as { count: number; getXYZ: (i: number) => [number, number, number]; setXYZ: (i: number, x: number, y: number, z: number) => void };
    const v = new THREE.Vector3();
    for (let k = 0; k < posAttr.count; k++) {
      (v as any).fromBufferAttribute(posAttr, k);
      const t = (v.y + h / 2) / h;
      const noise =
        Math.sin(v.x * 0.7 + i) * 0.6 +
        Math.cos(v.z * 0.6 + i * 1.3) * 0.6 +
        Math.sin(v.x * 1.9 + v.z * 1.7 + i) * 0.3;
      v.x += noise * (1 - t) * 0.5;
      v.z += noise * (1 - t) * 0.5 * Math.cos(i);
      v.y += noise * 0.2;
      posAttr.setXYZ(k, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, matMountain);
    m.position.set(Math.cos(angle) * radius, h / 2 - 4, Math.sin(angle) * radius);
    m.castShadow = m.receiveShadow = true;
    scene.add(m);
  }

  // Sky dome
  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = skyCanvas.height = 512;
  const skyCtx = skyCanvas.getContext("2d")!;
  const grad = skyCtx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#070810");
  grad.addColorStop(0.45, "#0e1019");
  grad.addColorStop(0.75, "#161a28");
  grad.addColorStop(1, "#1c2030");
  skyCtx.fillStyle = grad;
  skyCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) {
    skyCtx.fillStyle = `rgba(220,228,245,${0.25 + Math.random() * 0.55})`;
    skyCtx.beginPath();
    skyCtx.arc(Math.random() * 512, Math.random() * 260, Math.random() * 1.3, 0, Math.PI * 2);
    skyCtx.fill();
  }
  const skyTex = new THREE.CanvasTexture(skyCanvas);
  skyTex.mapping = THREE.EquirectangularReflectionMapping;
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(80, 32, 16),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false }),
  );
  sky.scale.set(-1, 1, 1);
  scene.add(sky);

  // Moon
  const moon = new THREE.Group();
  moon.position.set(16, 32, -52);
  const moonHalos = [10, 6.5, 4.6, 3.4];
  const moonColors = [0x6a86b0, 0x8aa0c4, 0xc4d2ea, 0xeef2fb];
  const moonOpacities = [0.06, 0.1, 0.22, 1];
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(moonHalos[i], 48),
      new THREE.MeshBasicMaterial({ color: moonColors[i], transparent: i < 3, opacity: i < 3 ? moonOpacities[i] : 1, fog: false }),
    );
    moon.add(m);
  }
  scene.add(moon);

  // Destination beacons
  const beacons: THREE.Group[] = [];
  labelsState.length = 0;
  for (const d of DESTINATIONS) {
    labelsState.push({ id: d.id, name: d.name, subtitle: d.subtitle, color: d.color, visible: false, x: 0, y: 0 } as LabelScreen);
  }
  for (const d of DESTINATIONS) {
    const g = new THREE.Group();
    g.position.set(...d.position);
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.32, 0),
      new THREE.MeshStandardMaterial({ color: d.color, emissive: d.color, emissiveIntensity: 1.4, transparent: true, opacity: 0.92, roughness: 0.2, metalness: 0.3 }),
    );
    crystal.position.y = 2.6;
    g.add(crystal);
    const light = new THREE.PointLight(d.color, 2.2, 8, 1);
    light.position.y = 2.6; g.add(light);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.3, 48),
      new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.42;
    g.add(ring);
    crystal.userData = { destinationId: d.id };
    beacons.push(g);
    scene.add(g);
  }

  // Raycaster for beacon clicks
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const beaconMeshes = beacons.map((g) => g.children[0] as THREE.Mesh);

  // State
  const yaw = { current: 0 };
  const pitch = { current: 0 };
  const keys: Record<string, boolean> = {};
  const vel = new THREE.Vector3();
  let locked = false;

  const canvas = renderer.domElement;
  const onCanvasClick = (e: MouseEvent) => {
    const st = useExperience.getState();
    if (st.panelOpen || st.menuOpen) return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(beaconMeshes, false);
    if (hits.length > 0) {
      const id = hits[0].object.userData.destinationId;
      if (id) {
        useExperience.getState().openPanel(id);
        return;
      }
    }
    const p = canvas.requestPointerLock?.();
    if (p && typeof (p as Promise<void>).catch === "function") {
      (p as Promise<void>).catch(() => useExperience.getState().setPointerLockDenied(true));
    }
  };
  canvas.addEventListener("click", onCanvasClick);

  const setPointerLocked = useExperience.getState().setPointerLocked;
  const setPointerLockDenied = useExperience.getState().setPointerLockDenied;
  const setInstructionsSeen = useExperience.getState().setInstructionsSeen;
  const setNearby = useExperience.getState().setNearbyDestination;

  const onLockChange = () => {
    locked = document.pointerLockElement === canvas;
    setPointerLocked(locked);
    if (locked) {
      setPointerLockDenied(false);
      setInstructionsSeen(true);
    }
  };
  document.addEventListener("pointerlockchange", onLockChange);
  const onLockError = () => setPointerLockDenied(true);
  document.addEventListener("pointerlockerror", onLockError);

  const onMouseMove = (e: MouseEvent) => {
    if (!locked) return;
    const st = useExperience.getState();
    if (st.panelOpen || st.menuOpen) return;
    const sens = 0.0022 * st.sensitivity;
    yaw.current -= e.movementX * sens;
    pitch.current -= e.movementY * sens;
    pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
  };
  document.addEventListener("mousemove", onMouseMove);

  const onFallbackLook = (e: Event) => {
    const ce = e as CustomEvent<{ dx: number; dy: number }>;
    if (!ce.detail) return;
    const st = useExperience.getState();
    if (st.panelOpen || st.menuOpen) return;
    const sens = 0.004 * st.sensitivity;
    yaw.current -= ce.detail.dx * sens;
    pitch.current -= ce.detail.dy * sens;
    pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
  };
  window.addEventListener("experience:look", onFallbackLook as EventListener);

  const onKeyDown = (e: KeyboardEvent) => {
    keys[e.code] = true;
    if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
      setInstructionsSeen(true);
    }
    if (e.code === "KeyE") {
      const st = useExperience.getState();
      if (st.nearbyDestination) st.openPanel(st.nearbyDestination);
    }
  };
  const onKeyUp = (e: KeyboardEvent) => { keys[e.code] = false; };
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  const onResize = () => {
    width = mount.clientWidth;
    height = mount.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  window.addEventListener("resize", onResize);

  const tick = () => {
    const now = performance.now();
    const dt = Math.min((now - (tick as any)._last || now) / 1000, 0.05);
    (tick as any)._last = now;

    const st = useExperience.getState();
    const pOpen = st.panelOpen;
    const mOpen = st.menuOpen;
    const qual = st.quality;

    // Animate beacons + project labels
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    for (let i = 0; i < beacons.length; i++) {
      const b = beacons[i];
      const d = DESTINATIONS[i];
      const crystal = b.children[0] as THREE.Mesh;
      crystal.position.y = 2.6 + Math.sin(now / 1000 * 1.4 + i) * 0.12;
      crystal.rotation.y = now / 1000 * 0.4;
      const ring = b.children[2] as THREE.Mesh;
      const ringMat = ring.material as THREE.MeshBasicMaterial;
      ringMat.opacity = 0.5 * (0.5 + Math.sin(now / 1000 * 2.2) * 0.25);
      const s = 1 + Math.sin(now / 1000 * 2.2) * 0.06;
      ring.scale.set(s, s, s);

      const worldPos = new THREE.Vector3(d.position[0], d.position[1] + 3.6, d.position[2]);
      const ndc = worldPos.clone().project(camera);
      const lbl = labelsState[i];
      if (lbl) {
        lbl.x = (ndc.x * 0.5 + 0.5) * vw;
        lbl.y = (-ndc.y * 0.5 + 0.5) * vh;
        lbl.visible = ndc.z < 1 && ndc.x > -1.6 && ndc.x < 1.6 && ndc.y > -1.6 && ndc.y < 1.6;
      }
    }

    // Touch look
    if ((lookRef.current.x || lookRef.current.y) && !pOpen && !mOpen) {
      yaw.current -= lookRef.current.x * 0.005 * st.sensitivity;
      pitch.current -= lookRef.current.y * 0.005 * st.sensitivity;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
      lookRef.current.x = 0;
      lookRef.current.y = 0;
    }

    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");

    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const move = new THREE.Vector3();
    if (keys["KeyW"] || keys["ArrowUp"]) move.add(forward);
    if (keys["KeyS"] || keys["ArrowDown"]) move.sub(forward);
    if (keys["KeyD"] || keys["ArrowRight"]) move.add(right);
    if (keys["KeyA"] || keys["ArrowLeft"]) move.sub(right);
    if (joystickRef.current.x || joystickRef.current.y) {
      move.add(right.clone().multiplyScalar(joystickRef.current.x));
      move.add(forward.clone().multiplyScalar(-joystickRef.current.y));
    }
    if (pOpen || mOpen) move.set(0, 0, 0);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(MOVE_SPEED * dt * (qual === "reduced" ? 1.2 : 1));
      vel.lerp(move, 0.35);
    } else {
      vel.lerp(new THREE.Vector3(), 0.2);
    }

    const next = camera.position.clone().add(vel);
    next.y = EYE_HEIGHT;
    for (const o of OBSTACLES) {
      const dx = next.x - o.cx;
      const dz = next.z - o.cz;
      const px = o.rx + 0.6 - Math.abs(dx);
      const pz = o.rz + 0.6 - Math.abs(dz);
      if (px > 0 && pz > 0) {
        if (px < pz) next.x = o.cx + Math.sign(dx) * (o.rx + 0.6);
        else next.z = o.cz + Math.sign(dz) * (o.rz + 0.6);
        vel.multiplyScalar(0.2);
      }
    }
    const distFromCenter = Math.hypot(next.x, next.z);
    if (distFromCenter > BOUNDARY) {
      const sc = BOUNDARY / distFromCenter;
      next.x *= sc;
      next.z *= sc;
    }
    camera.position.set(next.x, next.y, next.z);

    let closestId: string | null = null;
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
    if (closestId !== st.nearbyDestination) setNearby(closestId as any);

    renderer.render(scene, camera);
  };
  (tick as any)._last = performance.now();
  tickRef.current = tick;

  return () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("pointerlockchange", onLockChange);
    document.removeEventListener("pointerlockerror", onLockError);
    window.removeEventListener("experience:look", onFallbackLook as EventListener);
    canvas.removeEventListener("click", onCanvasClick);
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    renderer.dispose();
    if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    tickRef.current = null;
  };
}
