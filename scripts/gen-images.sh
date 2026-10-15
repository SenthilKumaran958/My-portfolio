#!/bin/bash
# Generate all atmospheric images for the portfolio
# Run in background; writes to public/images/

cd /home/z/my-project
mkdir -p public/images
LOG=public/images/gen.log
echo "START $(date)" >> "$LOG"

gen() {
  local name="$1"; local prompt="$2"; local size="$3"
  if [ -f "public/images/$name" ]; then
    echo "SKIP $name (exists)" >> "$LOG"
    return 0
  fi
  echo "GEN $name ($size)" >> "$LOG"
  z-ai image -p "$prompt" -o "public/images/$name" -s "$size" >> "$LOG" 2>&1 || echo "FAIL $name" >> "$LOG"
}

gen "hero.jpg" \
  "Cinematic dark fantasy landscape, distant jagged mountains shrouded in volumetric fog, ancient ruined temple silhouette, pale moonlight breaking through clouds, deep blacks and charcoal, subtle moonlight blue and faint violet accents, atmospheric depth, epic wide establishing shot, photorealistic game environment, highly detailed, muted silver highlights, moody and mysterious, no text" \
  "1344x768"

gen "shadow-blade-cover.jpg" \
  "Key art for a 2D dark fantasy action platformer game, hooded lone warrior with glowing blade standing on a cliff edge overlooking a moonlit ruined valley, dramatic rim lighting, deep charcoal blacks, silver and faint violet moonlight, hand-painted cinematic game poster style, atmospheric fog, highly detailed, no text, no logo" \
  "1344x768"

gen "shadow-blade-1.jpg" \
  "2D side-scrolling pixel art platformer gameplay screenshot, agile cloaked character mid-leap over a glowing spike hazard in a torchlit stone cavern, parallax background, dynamic torch glow, dark charcoal palette with warm orange accents, crisp pixel art, no UI, no text" \
  "1344x768"

gen "shadow-blade-2.jpg" \
  "2D side-scrolling pixel art platformer combat screenshot, cloaked character clashing blades with a shadowy enemy in a moonlit ruined arena, sparks and motion lines, dramatic lighting, deep blacks with silver moonlight and subtle violet, crisp pixel art, no UI, no text" \
  "1344x768"

gen "shadow-blade-3.jpg" \
  "2D side-scrolling pixel art platformer level screenshot, ancient overgrown temple interior with stone platforms, hanging vines, glowing checkpoints, distant moonlit doorway, atmospheric fog, muted palette with moonlight blue accents, environmental storytelling, no UI, no text" \
  "1344x768"

gen "env-indian-kingdom.jpg" \
  "Environment art of an ancient Indian kingdom, grand stone temple with intricate carvings and towering gopuram, golden sunset light, lush surroundings, photorealistic 3D render, atmospheric haze, cinematic composition, highly detailed, muted warm tones, no text" \
  "1344x768"

gen "env-temple-ruins.jpg" \
  "Environment art of forgotten temple ruins deep in a mysterious misty forest, moss-covered stone pillars, soft moonlight filtering through canopy, volumetric fog, muted silver and green tones, photorealistic 3D render, atmospheric, cinematic, no text" \
  "1344x768"

gen "env-dark-fantasy.jpg" \
  "Dark fantasy landscape environment art, jagged black mountains, distant crumbling fortress, brooding storm clouds, faint moonlight, deep charcoal and slate tones with subtle violet, cinematic, photorealistic 3D render, atmospheric fog, no text" \
  "1344x768"

gen "env-moonlit.jpg" \
  "Moonlit environment art, calm dark lake reflecting a full moon, ancient stone structure on the shore, silvery blue light, mist over water, still and atmospheric, photorealistic 3D render, cinematic, no text" \
  "1344x768"

gen "env-unreal5.jpg" \
  "Unreal Engine 5 environment experiment, photorealistic rocky mountain pass with volumetric god rays, lush mossy rocks, Lumen global illumination, Nanite detail, cinematic depth of field, muted natural palette with cool moonlight accents, no text, no UI" \
  "1344x768"

gen "env-blender.jpg" \
  "Blender 3D environment scene, stylized atmospheric ruined shrine on a cliff, soft volumetric lighting, muted silver and deep charcoal palette with subtle violet sky, cinematic composition, high quality render, no text" \
  "1344x768"

gen "level-blockout.jpg" \
  "Game level greybox blockout screenshot, simple white and grey geometric boxes forming platforms, stairs, pits and pathways of a 2.5D level, clean orthogonal layout, gameplay flow visible, minimalist, no text" \
  "1344x768"

gen "level-finished.jpg" \
  "Finished game level environment matching a greybox blockout, detailed ancient stone ruins with platforms and stairs, torches, fog, moonlight, atmospheric, cinematic 3D render, no text, no UI" \
  "1344x768"

echo "DONE $(date)" >> "$LOG"
