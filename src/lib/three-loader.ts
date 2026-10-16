/**
 * Loads three.js from a CDN at runtime so it never enters the bundler's
 * compile graph (the bundler would otherwise OOM compiling three.js in
 * memory-constrained sandboxes).
 *
 * After loadPromise resolves, `window.THREE` is available and we re-export
 * the same module shape via the `THREE` export of this file.
 */

declare global {
  interface Window {
    THREE: typeof import("three");
  }
}

const CDN_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js";

let _promise: Promise<typeof import("three")> | null = null;

export function loadThree(): Promise<typeof import("three")> {
  if (typeof window !== "undefined" && window.THREE) {
    return Promise.resolve(window.THREE);
  }
  if (_promise) return _promise;
  _promise = new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("document not available"));
      return;
    }
    const existing = document.querySelector(
      `script[data-three-loader]`,
    ) as HTMLScriptElement | null;
    const onLoad = () => {
      if (window.THREE) resolve(window.THREE);
      else reject(new Error("THREE failed to attach to window"));
    };
    if (existing) {
      existing.addEventListener("load", onLoad);
      existing.addEventListener("error", () => reject(new Error("script error")));
      return;
    }
    const s = document.createElement("script");
    s.src = CDN_URL;
    s.async = true;
    s.dataset.threeLoader = "true";
    s.addEventListener("load", onLoad);
    s.addEventListener("error", () => reject(new Error("Failed to load three.js from CDN")));
    document.head.appendChild(s);
  });
  return _promise;
}
