/**
 * Portfolio content for Senthil Kumaran.
 *
 * This file is the single source of truth for all editable content:
 * personal info, links, featured project, environment art, level design,
 * skills, about, and development journal.
 *
 * Replace placeholder image paths in /public/images and any placeholder
 * links (marked with PLACEHOLDER) with your real assets and URLs.
 */

export const profile = {
  name: "Senthil Kumaran",
  role: "Game Developer | Environment Artist",
  tagline: "An independent game creator building worlds worth exploring.",
  heroTitle: ["BUILD WORLDS.", "CREATE EXPERIENCES."],
  heroSubtitle:
    "I'm a game developer and aspiring environment artist focused on gameplay systems, atmospheric worlds, and immersive interactive experiences.",
  heroImage: "/images/hero.jpg",
  // Personal links (replace email/resume with your own when ready)
  links: {
    github: "https://github.com/SenthilKumaran958",
    itch: "https://god-arts.itch.io/shadow-blade",
    linkedin: "https://www.linkedin.com/in/senthil-kumaran-a4744a3a9",
    email: "senthil.kumaran@example.com", // PLACEHOLDER — replace with your email
    resume: "#", // PLACEHOLDER — add a /resume.pdf in /public when ready
    resumeAvailable: false,
  },
} as const;

export const featuredProject = {
  slug: "shadow-blade",
  title: "Shadow Blade",
  subtitle: "An original 2D action-platformer",
  engine: "Godot 4.7",
  language: "GDScript",
  genre: "2D Action-Platformer",
  status: "Completed",
  cover: "/images/shadow-blade-cover.jpg",
  overview:
    "Shadow Blade is an original 2D action-platformer I built in Godot 4.7 using GDScript. It follows a lone wanderer moving through ruined, moonlit temples and forgotten caverns. The focus is on tight platforming, deliberate combat, and environmental storytelling — letting the world itself communicate what happened before the player arrived.",
  // Real links — Play is live on itch.io. Source and gameplay video coming soon.
  links: {
    play: { href: "https://god-arts.itch.io/shadow-blade", label: "Play Game", available: true },
    source: { href: "https://github.com/SenthilKumaran958", label: "View Source Code", available: false }, // repo-specific link coming soon
    gameplay: { href: "#", label: "Watch Gameplay", available: false }, // video coming soon
  },
  screenshots: [
    {
      src: "/images/shadow-blade-1.jpg",
      alt: "Shadow Blade — cloaked character leaping over a glowing spike hazard in a torchlit cavern",
      caption: "Platforming — timed jumps over hazards in a torchlit cavern.",
    },
    {
      src: "/images/shadow-blade-2.jpg",
      alt: "Shadow Blade — close-quarters blade combat with a shadow enemy in a moonlit arena",
      caption: "Combat — committed attacks, telegraphed enemies, and readable tells.",
    },
    {
      src: "/images/shadow-blade-3.jpg",
      alt: "Shadow Blade — ancient overgrown temple interior with stone platforms and a distant moonlit doorway",
      caption: "Level design — an overgrown temple with layered parallax and a guiding light source.",
    },
  ],
  breakdowns: [
    {
      title: "Player Movement & Platforming",
      body: "Movement is built around a state machine: idle, run, jump, fall, attack, dash, and hurt. Acceleration, friction, and coyote time are tuned so platforming feels responsive but grounded. Jump height is variable — releasing the button shortens the jump — so players can clear tight gaps and feather landings on narrow platforms.",
    },
    {
      title: "Combat & Enemy Interactions",
      body: "Combat is deliberately committed. Attacks have windup, active, and recovery frames, so positioning matters. Enemies use simple, readable state machines with clear telegraph animations before striking, so the player can react rather than guess. Hit-stun and knockback are tuned to keep encounters readable.",
    },
    {
      title: "Level Design & Environmental Storytelling",
      body: "Levels are designed to teach without text. Hazards, broken architecture, and bodies of fallen travelers are placed to hint at what happened in each place. Sightlines guide the player toward the next objective while reward paths branch off for explorers.",
    },
    {
      title: "Checkpoints, Collectibles, Hazards & Progression",
      body: "Glowing shrines act as checkpoints. Collectibles reward exploration with lore fragments and small permanent upgrades. Hazards — spikes, falling platforms, collapsing floors — escalate across acts to introduce new verbs one at a time before combining them.",
    },
    {
      title: "Development Challenges & Solutions",
      body: "Early on, collision caused the player to stick to one-way platforms and slide on slopes unpredictably. I solved this by separating horizontal and vertical collision resolution, tagging one-way platforms so they only collide when falling onto them, and using raycasts for slope detection. A second recurring issue was input feeling inconsistent at low framerates — fixed by moving physics to _physics_process and using delta consistently.",
    },
    {
      title: "My Contributions, Tools & Technologies",
      body: "Shadow Blade is a solo project: design, programming, level layout, and visual direction are all mine. Built in Godot 4.7 with GDScript, version-controlled with Git and GitHub, with gameplay iteration tracked through a dev journal. Art and audio assets are a mix of my own work and placeholder references being replaced as the project matures.",
    },
  ],
} as const;

export type EnvCategory = {
  id: string;
  label: string;
  description: string;
};

export const environmentCategories: EnvCategory[] = [
  {
    id: "ancient-india",
    label: "Ancient Indian Kingdoms & Historical Architecture",
    description:
      "Studies of historical Indian architecture — temples, gopurams, and carved stone — reimagined as game-ready environments.",
  },
  {
    id: "forgotten-ruins",
    label: "Forgotten Temples, Ruins & Mysterious Forests",
    description:
      "Overgrown sanctuaries and ruined structures reclaimed by nature, focused on mood, fog, and light.",
  },
  {
    id: "dark-fantasy",
    label: "Dark Fantasy Landscapes",
    description:
      "Brooding vistas, distant fortresses, and jagged terrain — atmosphere-first world-building.",
  },
  {
    id: "moonlit",
    label: "Moonlit Environments & Atmospheric Scenes",
    description:
      "Quiet, silvery scenes built around stillness, reflection, and moonlight.",
  },
  {
    id: "unreal5",
    label: "Unreal Engine 5 Experiments",
    description:
      "Learning real-time workflows — Lumen lighting, Nanite detail, and cinematic composition in UE5.",
  },
  {
    id: "blender",
    label: "Blender Environment Modeling & Scene Creation",
    description:
      "Scene assembly, lighting, and rendering practice built in Blender.",
  },
];

export type Artwork = {
  id: string;
  title: string;
  category: string;
  image: string;
  // Distinct: experiment | concept | blockout | finished
  kind: "Experiment" | "Concept" | "Blockout" | "Finished Environment";
  description: string;
  software: string[];
  goals: string;
  breakdown: string[];
};

export const artworks: Artwork[] = [
  {
    id: "indian-kingdom",
    title: "The Sunlit Gopuram",
    category: "ancient-india",
    image: "/images/env-indian-kingdom.jpg",
    kind: "Experiment",
    description:
      "A study of a southern Indian temple gateway at golden hour, exploring silhouette, scale, and intricate carved stone.",
    software: ["Blender", "Reference Study"],
    goals:
      "Practice architectural composition and conveying scale through lighting and atmosphere — not a claim of finished production art.",
    breakdown: [
      "Reference gathered from historical temple photography for silhouette and proportions.",
      "Blockout focused on the tower silhouette and the main sightline toward the entrance.",
      "Lighting test to study how golden-hour rim light reads against intricate geometry.",
    ],
  },
  {
    id: "temple-ruins",
    title: "Reclaimed Sanctuary",
    category: "forgotten-ruins",
    image: "/images/env-temple-ruins.jpg",
    kind: "Concept",
    description:
      "Forgotten temple ruins overtaken by a misty forest, exploring mood, depth, and the feeling of discovery.",
    software: ["Blender", "Concept Study"],
    goals:
      "Use volumetric fog and canopy light to create a sense of place — a concept study, not a finished environment I personally modeled in full.",
    breakdown: [
      "Established the camera and a focal pillar first, then arranged debris to lead the eye.",
      "Fog density tuned so the background reads as depth rather than a flat plane.",
      "Color graded toward muted silver and green to keep the mood subdued.",
    ],
  },
  {
    id: "dark-fantasy",
    title: "Where the Fortress Sits",
    category: "dark-fantasy",
    image: "/images/env-dark-fantasy.jpg",
    kind: "Concept",
    description:
      "A brooding dark fantasy vista with a distant, crumbling fortress and storm-lit mountains.",
    software: ["Blender", "Concept Study"],
    goals:
      "Atmosphere-first composition — conveying threat and grandeur through scale and weather rather than detail.",
    breakdown: [
      "Three-layer depth: foreground rocks, midground ridge, distant fortress.",
      "Storm cloud lighting used to silhouette the fortress against a faint moonlight break.",
      "Palette limited to charcoal, slate, and a single subtle violet accent.",
    ],
  },
  {
    id: "moonlit-lake",
    title: "Still Water, Full Moon",
    category: "moonlit",
    image: "/images/env-moonlit.jpg",
    kind: "Experiment",
    description:
      "A quiet moonlit lake scene focused on reflection, stillness, and silvery light.",
    software: ["Blender"],
    goals:
      "Study reflection and cool-tone lighting in a calm, low-contrast scene.",
    breakdown: [
      "Reflection plane tuned for subtle ripple rather than mirror-perfect duplication.",
      "Single dominant light (the moon) with a soft fill from the sky.",
      "Atmospheric mist placed low across the water for depth.",
    ],
  },
  {
    id: "unreal5-pass",
    title: "Mountain Pass Study",
    category: "unreal5",
    image: "/images/env-unreal5.jpg",
    kind: "Experiment",
    description:
      "An early Unreal Engine 5 study exploring Lumen global illumination and volumetric god rays in a mountain pass.",
    software: ["Unreal Engine 5", "Lumen", "Nanite (learning)"],
    goals:
      "Learning UE5's real-time lighting workflow — an active experiment, not a production environment.",
    breakdown: [
      "Blocked terrain with modular rock assets and a single dominant light direction.",
      "Lumen set up for soft bounced light; god rays added via volumetric fog.",
      "Iterating on exposure and contrast to match a cinematic reference frame.",
    ],
  },
  {
    id: "blender-shrine",
    title: "Cliffside Shrine",
    category: "blender",
    image: "/images/env-blender.jpg",
    kind: "Experiment",
    description:
      "A stylized ruined shrine on a cliff, assembled and rendered in Blender to study composition and volumetric lighting.",
    software: ["Blender", "Cycles"],
    goals:
      "Practice scene assembly, lighting, and a cohesive muted palette in a single render pass.",
    breakdown: [
      "Blocked the shrine silhouette against the sky for a clear focal point.",
      "Soft volumetric lighting tuned so the shrine reads as the brightest element.",
      "Palette kept to deep charcoal, silver, and a faint violet sky.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Unreal Engine Environments — dedicated UE5 showcase                  */
/* ------------------------------------------------------------------ */

export type UEProjectKind = "Experiment" | "Work in Progress" | "Completed";

export type UEProject = {
  id: string;
  title: string;
  kind: UEProjectKind;
  // One of: ancient-india | dark-fantasy | lighting | terrain | blockout-to-final
  space:
    | "ancient-india"
    | "dark-fantasy"
    | "lighting"
    | "terrain"
    | "blockout-to-final";
  image: string;
  shortDescription: string;
  longDescription: string;
  workflow: string[];
  software: string[];
  // Whether real renders/screenshots/video have been supplied yet
  hasRealAssets: boolean;
};

export const ueSpaces = [
  {
    id: "ancient-india",
    label: "Ancient Indian Kingdoms & Temples",
    description:
      "Environment pieces exploring historical Indian temple architecture, gopurams, and carved stonework as real-time UE5 scenes.",
  },
  {
    id: "dark-fantasy",
    label: "Dark Fantasy Fortresses & Ruined Landscapes",
    description:
      "Brooding fortresses, ruined landscapes, and atmospheric dark-fantasy world-building.",
  },
  {
    id: "lighting",
    label: "Real-Time Lighting & Atmosphere",
    description:
      "Lumen GI experiments, virtual shadow maps, volumetric fog, and time-of-day studies.",
  },
  {
    id: "terrain",
    label: "Terrain Creation & Composition",
    description:
      "Landscape sculpting, foliage, material blending, and environmental composition.",
  },
  {
    id: "blockout-to-final",
    label: "Blockout-to-Final Development",
    description:
      "Showing the same environment from greybox blockout through to a finished, lit scene.",
  },
] as const;

export const ueProjects: UEProject[] = [
  {
    id: "ue-temple-gopuram",
    title: "Gopuram at Dawn",
    kind: "Work in Progress",
    space: "ancient-india",
    image: "/images/env-indian-kingdom.jpg",
    shortDescription:
      "A towering South Indian temple gateway studied in Unreal Engine 5, exploring silhouette, scale, and golden-hour Lumen lighting.",
    longDescription:
      "An in-progress environment study of a South Indian temple gopuram. The goal is to capture the monumental scale and intricate carved-stone silhouette under warm dawn light, using Lumen global illumination for soft bounced light in the deep niches. Currently a blockout with placeholder textures — final carved detail and material work is ongoing.",
    workflow: [
      "Reference gathered from historical temple photography for proportions and silhouette.",
      "Blockout in UE5 with modular stone pieces to test scale and the main sightline.",
      "Lumen + directional light tuned for golden-hour bounced light (in progress).",
      "Next: high-poly carved detail in Blender, Nanite-friendly import, final materials.",
    ],
    software: ["Unreal Engine 5", "Blender (planned)", "Lumen"],
    hasRealAssets: false,
  },
  {
    id: "ue-fortress-ruin",
    title: "Where the Fortress Sits",
    kind: "Experiment",
    space: "dark-fantasy",
    image: "/images/env-dark-fantasy.jpg",
    shortDescription:
      "A dark-fantasy ruined fortress on a storm-lit ridge — atmosphere-first composition with Lumen and volumetric fog.",
    longDescription:
      "A dark-fantasy environment experiment: a distant, crumbling fortress silhouetted against a brooding sky. The focus is mood and atmosphere over fine detail — using Lumen, volumetric fog, and a single dominant light break to tell a story of a long-abandoned stronghold. An experiment, not a finished environment.",
    workflow: [
      "Established three-layer depth (foreground rocks, midground ridge, distant fortress).",
      "Volumetric fog tuned so the fortress reads as a silhouette against a faint moonlight break.",
      "Palette limited to charcoal, slate, and a single subtle violet accent.",
      "Lumen GI used for soft ambient fill in shadowed areas.",
    ],
    software: ["Unreal Engine 5", "Lumen", "Volumetric Fog"],
    hasRealAssets: false,
  },
  {
    id: "ue-lumen-study",
    title: "Lumen Lighting Study",
    kind: "Experiment",
    space: "lighting",
    image: "/images/env-moonlit.jpg",
    shortDescription:
      "A focused study of Lumen global illumination and virtual shadow maps in a simple moonlit interior.",
    longDescription:
      "A lighting experiment in a simple interior scene, isolating Lumen GI and virtual shadow maps. The goal is to understand how Lumen bounces cool moonlight through an open archway and how virtual shadows resolve contact detail on stone. An active learning exercise, not a finished piece.",
    workflow: [
      "Built a single-room blockout with one arched opening as the only light source.",
      "Lumen enabled; emissive moon disc as the key light, no manual fill.",
      "Virtual shadow maps tuned for contact shadow quality on near stone.",
      "Documented bounce intensity vs. perceived mood for future scenes.",
    ],
    software: ["Unreal Engine 5", "Lumen", "Virtual Shadow Maps"],
    hasRealAssets: false,
  },
  {
    id: "ue-terrain-pass",
    title: "Mountain Pass — Terrain Study",
    kind: "Work in Progress",
    space: "terrain",
    image: "/images/env-unreal5.jpg",
    shortDescription:
      "A UE5 landscape terrain study exploring sculpting, material blending, and foliage on a rocky mountain pass.",
    longDescription:
      "A terrain-focused environment in progress: a rocky mountain pass sculpted with the UE5 landscape tool, with layered materials (rock, grass, dirt) blended by height and slope, and sparse foliage. Currently testing material blending; foliage and final lighting are ongoing.",
    workflow: [
      "Landscape sculpted with erosion-style noise for natural ridges and gullies.",
      "Landscape material blends three layers (rock / dirt / grass) by slope and height.",
      "Foliage tool tested with a few grass and rock meshes (placeholder assets).",
      "Next: custom foliage models in Blender, distance fog tuning, final Lumen pass.",
    ],
    software: ["Unreal Engine 5", "Landscape Tools", "Material Editor"],
    hasRealAssets: false,
  },
  {
    id: "ue-blockout-to-final",
    title: "Blockout to Final — Temple Interior",
    kind: "Work in Progress",
    space: "blockout-to-final",
    image: "/images/env-temple-ruins.jpg",
    shortDescription:
      "Showing the same temple interior from greybox blockout through to a lit, detailed scene — documenting the full process.",
    longDescription:
      "A process-focused project: the same temple interior shown at the blockout stage and at the (in-progress) final stage. The goal is to demonstrate the full blockout-to-final workflow — proving out gameplay paths, scale, and sightlines first, then layering art, lighting, and atmosphere without changing the underlying layout. Final art is still in progress.",
    workflow: [
      "Blockout: modular pieces set the layout, camera, and sightline first.",
      "Greybox playthrough to confirm the path feels good before any art is made.",
      "Art pass: replacing greybox with carved stone meshes from Blender (in progress).",
      "Lighting + atmosphere pass with Lumen and volumetric fog (planned).",
    ],
    software: ["Unreal Engine 5", "Blender", "Lumen"],
    hasRealAssets: false,
  },
];

export const levelDesign = {
  intro:
    "I design playable spaces before I decorate them. Every level starts as a greybox where I test movement, pacing, and readability — only then do I layer environment art, lighting, and storytelling on top.",
  blockoutImage: "/images/level-blockout.jpg",
  finishedImage: "/images/level-finished.jpg",
  principles: [
    {
      title: "Greybox / Blockout Layout",
      body: "Levels begin as plain geometry. I map out the shape, scale, and connection of spaces first, so the player's path and the camera's framing are testable before any art is made.",
    },
    {
      title: "Gameplay Paths & Navigation",
      body: "I define a primary golden path with clear sightlines, then add optional branches that reward exploration with collectibles or shortcuts back to the main route.",
    },
    {
      title: "Platforming Challenges",
      body: "Gaps, moving platforms, and hazards are introduced one at a time in safe rooms before being combined. Difficulty ramps by mixing verbs the player has already proven they understand.",
    },
    {
      title: "Environmental Storytelling",
      body: "Placement of ruins, light, and debris communicates history without text. A collapsed bridge tells the player where not to go; a distant light tells them where to aim.",
    },
    {
      title: "Lighting & Composition",
      body: "Light guides the eye. I use a single dominant light direction per scene and reserve the brightest values for the objective or the reward, so composition does the wayfinding work.",
    },
    {
      title: "Before & After",
      body: "The same blockout shown finished: the greybox test confirmed the path felt good, then art and light were layered on without changing the underlying gameplay geometry.",
    },
  ],
};

export type SkillGroup = {
  id: string;
  title: string;
  // level: "Production-ready" | "Actively learning"
  level: "Production-ready" | "Actively learning";
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "game-dev",
    title: "Game Development",
    level: "Production-ready",
    items: [
      "Godot 4.7",
      "GDScript",
      "Gameplay mechanics",
      "2D platforming",
      "Collision systems",
      "UI",
      "Debugging",
    ],
  },
  {
    id: "game-design",
    title: "Game Design",
    level: "Production-ready",
    items: [
      "Level design",
      "Game progression",
      "Player feedback",
      "Environmental storytelling",
    ],
  },
  {
    id: "env-art",
    title: "Environment Art",
    level: "Actively learning",
    items: [
      "Blender",
      "Environment modeling",
      "Composition",
      "Lighting",
      "Materials",
      "Unreal Engine environment workflows",
    ],
  },
  {
    id: "workflow",
    title: "Creative Workflow",
    level: "Production-ready",
    items: ["Git", "GitHub", "Prototyping", "Iteration", "Dev documentation"],
  },
];

export const about = {
  intro:
    "I'm a self-driven game developer who learns by building real projects. I picked up Godot and GDScript by making a complete game — Shadow Blade — rather than studying tutorials in isolation. Along the way I became drawn to the visual side: composition, lighting, and the way an environment can tell a story before a single line of dialogue is written.",
  middle:
    "My process is iterative and honest. I prototype fast, find the parts that don't work, and rebuild them. I document what I tried and what I learned, so each project leaves me with sharper instincts than the last. Right now I'm extending into environment art with Blender and Unreal Engine 5, learning the real-time workflows professional studios use.",
  direction:
    "My long-term direction is to contribute to professional game development — especially gameplay programming, level design, and environment creation. I'm not there yet, and I won't pretend to be. What I can show is real, working projects and a clear record of how I made them.",
};

export type JournalEntry = {
  id: string;
  title: string;
  date: string;
  tag: "Gameplay" | "Bug" | "Level Design" | "Environment" | "Reflection";
  problem: string;
  process: string;
  result: string;
  code?: { language: string; snippet: string };
};

export const journal: JournalEntry[] = [
  {
    id: "coyote-time",
    title: "Adding Coyote Time to Platforming",
    date: "2024-11-02",
    tag: "Gameplay",
    problem:
      "Players reported jumps feeling unfair when they pressed jump a frame after leaving a ledge — the character simply fell.",
    process:
      "I added a short grace timer after leaving the ground during which a jump input still counts as a grounded jump. The timer resets on landing. I exposed the window as a constant so I could tune it in one place.",
    result:
      "Platforming felt noticeably more forgiving without becoming floaty. The same pattern now also powers a small jump-buffer when landing mid-press.",
    code: {
      language: "gdscript",
      snippet: `var coyote_timer := 0.0
const COYOTE_TIME := 0.10

func _physics_process(delta):
    if is_on_floor():
        coyote_timer = COYOTE_TIME
    else:
        coyote_timer = max(coyote_timer - delta, 0.0)

    if Input.is_action_just_pressed("jump") and coyote_timer > 0.0:
        velocity.y = JUMP_VELOCITY
        coyote_timer = 0.0`,
    },
  },
  {
    id: "one-way-platforms",
    title: "Fixing Sticky One-Way Platforms",
    date: "2024-12-08",
    tag: "Bug",
    problem:
      "The player stuck to the underside of one-way platforms and sometimes slid along them when they shouldn't.",
    process:
      "The root cause was resolving horizontal and vertical collisions in a single pass. I separated them: move_x first, then move_and_slide for vertical only. One-way platforms are tagged so they only collide when the player is falling and their previous position was above the platform.",
    result:
      "One-way platforms now behave predictably — pass through from below, land from above, and drop through with the down+jump input.",
    code: {
      language: "gdscript",
      snippet: `# Resolve horizontal first, then vertical
velocity.x = move_dir * SPEED
move_and_slide()

# one-way: only collide when falling onto the top
if velocity.y >= 0 and was_above_platform_last_frame:
    # let the CollisionShape2D's one_way collector handle it
    pass`,
    },
  },
  {
    id: "temple-pacing",
    title: "Designing the First Temple's Pacing",
    date: "2025-01-15",
    tag: "Level Design",
    problem:
      "The first temple level felt cluttered — every room introduced something new, so players never got comfortable.",
    process:
      "I rebuilt the level around a 'teach, test, twist' rhythm. Room 1 teaches a mechanic safely. Room 2 tests it on its own. Room 3 twists it by combining it with a previously learned verb. I cut two hazards that didn't fit this rhythm even though I liked them visually.",
    result:
      "Completion time stayed similar, but deaths in the level dropped and playtesters stopped asking what they were supposed to do.",
  },
  {
    id: "fog-density",
    title: "Tuning Fog in a Ruins Scene",
    date: "2025-02-20",
    tag: "Environment",
    problem:
      "My temple ruins render looked flat — the background read as a wall instead of distant ruins.",
    process:
      "I increased fog density gradually with distance from the camera and added a faint atmospheric perspective tint to distant objects. I also placed a single shaft of light through a broken roof so the foreground had local contrast.",
    result:
      "The scene gained real depth. Distant ruins now sit behind a haze that reads as air rather than geometry.",
  },
  {
    id: "iteration-lesson",
    title: "What I Learned From Rewriting Combat Twice",
    date: "2025-03-10",
    tag: "Reflection",
    problem:
      "My first combat system was too complex — three attack types, combos, and a parry. It was hard to tune and no fun to play.",
    process:
      "I cut it down to a single committed attack with clear windup, active, and recovery frames, and let enemy telegraphs carry the depth. The second rewrite kept the feel I wanted with a fraction of the code.",
    result:
      "Combat became readable and tunable. The lesson: add verbs before adding states to a single verb. Complexity should come from combination, not from a giant state graph.",
  },
];
