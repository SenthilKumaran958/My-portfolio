import { create } from "zustand";

export type ExperienceMode = "select" | "3d" | "2d";
export type Quality = "high" | "reduced";

export type DestinationId =
  | "game-development"
  | "environment-art"
  | "level-design";

export type DestinationInfo = {
  id: DestinationId;
  name: string;
  subtitle: string;
  position: [number, number, number];
  color: string;
};

export const DESTINATIONS: DestinationInfo[] = [
  {
    id: "game-development",
    name: "Game Development",
    subtitle: "Shadow Blade — a 2D action-platformer in Godot",
    position: [-9, 0, -6],
    color: "#9bb8d6",
  },
  {
    id: "environment-art",
    name: "Environment Art",
    subtitle: "Worlds in progress — Blender & UE5 studies",
    position: [0, 0, -14],
    color: "#b9a6d6",
  },
  {
    id: "level-design",
    name: "Level Design",
    subtitle: "Blockouts, paths, and environmental storytelling",
    position: [9, 0, -6],
    color: "#8fc6c9",
  },
];

type ExperienceState = {
  mode: ExperienceMode;
  activeDestination: DestinationId | null;
  nearbyDestination: DestinationId | null;
  quality: Quality;
  panelOpen: boolean;
  instructionsSeen: boolean;
  webglOk: boolean | null;
  loaded: boolean;

  setMode: (m: ExperienceMode) => void;
  setActiveDestination: (d: DestinationId | null) => void;
  setNearbyDestination: (d: DestinationId | null) => void;
  setQuality: (q: Quality) => void;
  openPanel: (d: DestinationId) => void;
  closePanel: () => void;
  setInstructionsSeen: (v: boolean) => void;
  setWebglOk: (v: boolean | null) => void;
  setLoaded: (v: boolean) => void;
};

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const useExperience = create<ExperienceState>((set) => ({
  mode: "select",
  activeDestination: null,
  nearbyDestination: null,
  quality: prefersReducedMotion ? "reduced" : "high",
  panelOpen: false,
  instructionsSeen: false,
  webglOk: null,
  loaded: false,

  setMode: (m) =>
    set({
      mode: m,
      activeDestination: null,
      nearbyDestination: null,
      panelOpen: false,
    }),
  setActiveDestination: (d) => set({ activeDestination: d }),
  setNearbyDestination: (d) => set({ nearbyDestination: d }),
  setQuality: (q) => set({ quality: q }),
  openPanel: (d) =>
    set({ activeDestination: d, panelOpen: true, instructionsSeen: true }),
  closePanel: () => set({ panelOpen: false, activeDestination: null }),
  setInstructionsSeen: (v) => set({ instructionsSeen: v }),
  setWebglOk: (v) => set({ webglOk: v }),
  setLoaded: (v) => set({ loaded: v }),
}));
