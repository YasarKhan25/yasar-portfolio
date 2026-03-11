export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const STATS = [
  { v: '6+',  l: 'Games Built',  i: '🎮' },
  { v: '30%', l: 'Perf Boost',   i: '⚡' },
  { v: '50+', l: 'Bugs Fixed',   i: '🐛' },
  { v: '2+',  l: 'Yrs Exp',      i: '🚀' },
]

export const SKILLS = {
  'Game Dev': [
    { n: 'Unity Engine',          p: 95 },
    { n: 'Gameplay Programming',  p: 88 },
    { n: 'Enemy AI Systems',      p: 88 },
    { n: 'Physics & Animation',   p: 85 },
    { n: 'Unreal Engine',         p: 55 },
  ],
  'QA & Testing': [
    { n: 'Bug Tracking',          p: 92 },
    { n: 'Performance Profiling', p: 87 },
    { n: 'Test Case Creation',    p: 85 },
    { n: 'Gameplay Balancing',    p: 82 },
    { n: 'Regression Testing',    p: 80 },
  ],
  Languages: [
    { n: 'C#',          p: 90 },
    { n: 'C++',         p: 72 },
    { n: 'Python',      p: 68 },
    { n: 'JavaScript',  p: 70 },
    { n: 'Java',        p: 65 },
  ],
  Tools: [
    { n: 'Git & GitHub',        p: 87 },
    { n: 'Visual Studio',       p: 88 },
    { n: 'Unity Profiler',      p: 84 },
    { n: 'Blender',             p: 55 },
    { n: 'Figma',               p: 62 },
  ],
}

export const PROJECTS = [
  {
    id: 'tank', title: 'Pixel Blasters', sub: '3D Tank Battle',
    genre: 'Action · Third-Person Shooter', cat: 'action', featured: true,
    engine: 'Unity 2022.3', platform: 'PC / WebGL',
    tags: ['C#', 'Enemy AI', 'FSM', 'Object Pool'],
    desc: 'Full 3D tank battle featuring enemy AI finite state machines, object-pooled projectiles, wave progression, and dynamic difficulty scaling.',
    mechanics: ['Enemy FSM (5 States)', 'Object-Pooled Bullets', 'Wave Spawning', 'Particle Hit FX', 'HUD / Ammo System', 'Dynamic Difficulty'],
    breakdown: 'Enemy AI uses a 5-state FSM: Idle→Patrol→Detect→Chase→Attack. Each transition fires Unity Events so artists hook SFX/VFX without touching AI code. Bullets use an object pool (zero GC). Patrol waypoints are Scriptable Objects — designers configure AI with no code access needed.',
    github: 'https://github.com/YasarKhan25',
    info: 'WASD = Move  ·  Mouse = Aim  ·  Click = Fire  ·  Auto-reloads',
  },
  {
    id: 'fps', title: 'NightFire Arena', sub: 'Top-Down FPS Shooter',
    genre: 'Action · Arena Shooter', cat: 'action', featured: true,
    engine: 'Unity 2022.3', platform: 'PC / WebGL',
    tags: ['C#', 'Combat', 'Waves', 'Particle FX'],
    desc: 'Top-down arena shooter with tight gunplay, enemy wave escalation, ammo economy, and particle-heavy combat feedback.',
    mechanics: ['Pursuit AI + Fire Range', 'Ammo Economy', 'Auto-Reload', 'Wave Escalation', 'Health + Game Over', 'Particle Decals'],
    breakdown: 'Enemy AI uses a 2-state machine: Pursue (dist > attackRange) → Attack. Fire cooldown is randomized per enemy to prevent synchronized volleys — a trick that makes combat feel organic instead of scripted.',
    github: 'https://github.com/YasarKhan25/FPS-Shooter-Unity',
    info: 'WASD = Move  ·  Mouse = Aim  ·  Click = Fire',
  },
  {
    id: 'ski', title: 'Downhill Rush', sub: 'Skiing Arcade Game',
    genre: 'Arcade · Sports', cat: 'runner', featured: false,
    engine: 'Unity 2022.3', platform: 'PC / Mobile',
    tags: ['C#', 'Physics', 'Procedural', 'Momentum'],
    desc: 'Physics-based downhill skiing with procedurally spawning obstacles, momentum simulation, and escalating speed.',
    mechanics: ['Momentum Physics', 'Procedural Obstacles', 'Speed Escalation', 'Lives System', 'Parallax Trees', 'Score Tracker'],
    breakdown: 'Custom physics model — not CharacterController. Horizontal velocity uses exponential decay for natural deceleration. Trees use 2 parallax layers for depth at near-zero GPU cost. Obstacle density follows an asymptotic curve.',
    github: 'https://github.com/YasarKhan25',
    info: '← → Steer  ·  ↑ Brake  ·  Dodge obstacles!',
  },
  {
    id: 'runner', title: 'NeonDash 3D', sub: 'Endless Lane Runner',
    genre: 'Endless Runner · Casual', cat: 'runner', featured: false,
    engine: 'Unity 2022.3', platform: 'PC / Mobile',
    tags: ['C#', 'Procedural', 'Mobile-Ready', 'Input'],
    desc: 'Fast-paced 3D lane runner with jump, slide, and lane-switch mechanics. Procedurally generated barriers and collectible coins.',
    mechanics: ['3-Lane Proc Gen', 'Jump Buffering', 'Slide Collision', 'Coin Collect +10', 'Speed Curve', 'Touch Input'],
    breakdown: 'Spawner uses pool of 3 barrier prefabs with weighted randomness — same lane never spawns 3× in a row. Speed uses asymptotic curve (maxSpeed - k/t) so it escalates without becoming impossible.',
    github: 'https://github.com/YasarKhan25/Endless-Runner-3D',
    info: '← → Lane  ·  Space = Jump  ·  ↓ = Slide',
  },
  {
    id: 'puzzle', title: 'Cube Shift', sub: '3D Puzzle Adventure',
    genre: 'Puzzle · Sokoban-style', cat: 'puzzle', featured: false,
    engine: 'Unity 2022.3', platform: 'PC / WebGL',
    tags: ['C#', 'OOP', 'Scriptable Objects', 'State Machine'],
    desc: 'Multi-level Sokoban-style puzzle using fully modular state machine level logic and Scriptable Object level data.',
    mechanics: ['Sokoban Push Logic', 'SO Level Data', 'Win Condition Check', 'Move Counter', '3-Level Progression', 'Grid Collision'],
    breakdown: 'Each level is a Scriptable Object — wall positions, box positions, targets. LevelManager reads this at runtime. Adding level 10 = create one asset, zero code changes. Clean separation of data and logic.',
    github: 'https://github.com/YasarKhan25/3D-Puzzle-Adventure',
    info: 'WASD = Move  ·  Push box to green target  ·  Click = Next Level',
  },
  {
    id: 'racing', title: 'Neon Velocity', sub: 'Street Racing 3D',
    genre: 'Racing · Arcade', cat: 'racing', featured: false,
    engine: 'Unity 2022.3', platform: 'PC / WebGL',
    tags: ['C#', 'Vehicle Physics', 'AI Opponents', 'Nitro'],
    desc: 'Arcade racing with custom vehicle physics, 4 AI opponents, drift mechanics, and a nitro boost bar.',
    mechanics: ['Custom Vehicle Physics', 'Drift Force Simulation', 'Nitro + Drain Bar', '4 AI Opponents', 'Lap Counter', 'Collision Damage'],
    breakdown: 'Drift = additional lateral force proportional to (throttle × turn input). Nitro uses resource bar with recharge rate so players cannot spam it. AI opponents use pursuit movement with randomized speed variance for natural racing feel.',
    github: 'https://github.com/YasarKhan25/Street-Racing-3D',
    info: '← → Steer  ·  ↑ Gas  ·  ↓ Brake  ·  Space = Nitro',
  },
]

export const SYSTEMS = [
  {
    icon: '🤖', title: 'Enemy AI Behaviour', tech: 'FSM · NavMesh · C#',
    desc: 'Modular FSM: Idle→Patrol→Detect→Chase→Attack→Dead. Each transition fires Unity Events for SFX/VFX decoupling. Patrol waypoints are Scriptable Objects — designers configure AI with zero code access.',
    code: `// State transition logic
if (distToPlayer < detectionRange)
    ChangeState(AIState.Chase);
else if (state == Chase
    && dist > loseTrackRange)
    ChangeState(AIState.Patrol);`,
  },
  {
    icon: '🏃', title: 'Player Movement System', tech: 'CharacterController · Physics',
    desc: 'Rigidbody controller with coyote time, jump buffering, and acceleration curves. Fully frame-rate independent with Time.deltaTime throughout. Responsive at 60fps on all platforms.',
    code: `// Coyote time implementation
if (isGrounded) coyoteTimer = coyoteTime;
else coyoteTimer -= Time.deltaTime;

bool CanJump() =>
    coyoteTimer > 0 || isGrounded;`,
  },
  {
    icon: '💬', title: 'Dialogue System', tech: 'Scriptable Objects · Coroutines',
    desc: 'Data-driven dialogue with SO nodes: speaker data, text, portrait, branching choices. Typewriter effect via coroutine. Supports quest event hooks, auto-advance, and skippable lines.',
    code: `IEnumerator TypeLine(string line) {
    dialogueText.text = "";
    foreach (char c in line) {
        dialogueText.text += c;
        yield return new WaitForSeconds(
            typeSpeed);
    }
}`,
  },
  {
    icon: '🎒', title: 'Inventory System', tech: 'Scriptable Objects · Events',
    desc: 'Grid-based inventory with drag-and-drop. ItemData SOs define stackable items, icons, stats. UI listens to InventoryChangedEvent — zero coupling between backend logic and UI layer.',
    code: `[CreateAssetMenu]
public class InventoryEvent
    : ScriptableObject {
    public Action<ItemData> OnItemAdded;
    public void Raise(ItemData item)
        => OnItemAdded?.Invoke(item);
}`,
  },
  {
    icon: '🎯', title: 'Quest Logic System', tech: 'Scriptable Objects · Observer',
    desc: 'QuestData SOs define objectives, rewards, prerequisites. Composable objectives: kill X enemies, reach location, collect items. Broadcasts state changes via events with zero scene coupling.',
    code: `void OnEnemyKilled(EnemyType type) {
    if (objective.type == type) {
        objective.count++;
        if (objective.IsComplete())
            CompleteQuest();
    }
}`,
  },
  {
    icon: '🖥️', title: 'UI System Architecture', tech: 'Canvas · MVC · Events',
    desc: 'MVC-patterned UI: Model = SO data, View = Canvas components, Controller = UIManager. Health bars and ammo displays subscribe to events and update reactively — zero Update() polling.',
    code: `void Start() {
    playerHealth.OnValueChanged
        += UpdateHealthBar;
}
void UpdateHealthBar(float val) {
    healthFill.fillAmount =
        val / maxHP;
}`,
  },
]

export const EXPERIENCE = [
  {
    period: 'June 2024 – Dec 2024', color: 'var(--c1)',
    role: 'Game Developer', company: 'Huntdown Gaming Solutions', location: 'Bengaluru',
    bullets: [
      'Developed and integrated gameplay mechanics for 2D/3D modules, improving player interaction flow by 25%.',
      'Optimized scripts and physics calculations, reducing frame drops and improving runtime performance by 30%.',
      'Identified and resolved 50+ bugs using structured debugging and Unity Profiler.',
      'Collaborated in Agile sprints with designers and artists to ship features within deadlines.',
      'Refactored legacy scripts to improve readability and reduce technical debt.',
    ],
  },
  {
    period: '2022 – Present', color: 'var(--c2)',
    role: 'Freelance Unity Developer', company: 'Self-Employed', location: 'Remote',
    bullets: [
      'Shipped multiple 2D/3D Unity games for international clients.',
      'Handled full game lifecycle: mechanics programming, UI systems, Scriptable Objects, QA, and deployment.',
    ],
  },
  {
    period: '2021 – 2024', color: 'var(--c3)',
    role: 'BE — Computer Science', company: 'SA Engineering College', location: 'Chennai',
    bullets: ['Data structures, algorithms, OOP, software engineering with focus on Unity & C#.'],
  },
  {
    period: '2018 – 2021', color: '#22d3ee',
    role: 'Diploma — Computer Science', company: 'Panimalar Polytechnic College', location: 'Chennai',
    bullets: ['Foundation in CS, programming fundamentals, and software development.'],
  },
]

export const CERTS = [
  { icon: '🏢', name: 'Accenture Nordics', sub: 'Software Engineering Simulation' },
  { icon: '🎮', name: 'Electronic Arts',   sub: 'Software Engineering Simulation' },
  { icon: '☁️', name: 'AWS',               sub: 'Solutions Architecture Simulation' },
  { icon: '🏦', name: 'J.P. Morgan',       sub: 'Software Engineering Simulation' },
]

export const DEVLOGS = [
  {
    tag: 'AI Systems', title: 'How I Built a Modular Enemy AI System',
    excerpt: 'FSM architecture — patrol, detection, chase, attack states with event-driven decoupling so designers configure AI without code.',
    body: `The key insight was using a Finite State Machine rather than nested if-else chains.

I created an abstract AIState class with Enter(), Update(), Exit() methods. Each concrete state only knows its own logic.

Decoupling FX from AI using Unity Events meant our artist could add hit animations without touching AI code.

State flow: Idle → Patrol → Detect → Chase → Attack → Dead

Result: Enemy AI that designers tune via Scriptable Objects, artists enhance with zero code access, and programmers can unit-test in isolation.`,
  },
  {
    tag: 'QA · Profiler', title: 'Debugging a Frame-Rate Spike in Production',
    excerpt: 'A runtime bug caused 45ms frame spikes every 3 seconds. Walk-through of using Unity Profiler to find and eliminate it.',
    body: `Symptom: consistent 45ms frame spike every ~3 seconds in a live build.

Step 1: Unity Profiler — spike was in CPU, not GPU.

Step 2: Profiler hierarchy showed EnemySpawner.Update() taking 28ms during spikes. It called GetComponentsInChildren<Enemy>() every 3 seconds.

Step 3: GetComponentsInChildren() allocates a new array every call — GC pressure caused collection spikes.

Fix: Cache enemy count in a simple int counter, incremented/decremented via UnityEvents.

Result: GC allocations dropped to zero. Runtime performance improved by 30%.`,
  },
  {
    tag: 'Physics · Feel', title: 'Designing Responsive Player Movement',
    excerpt: "The difference between 'floaty' and 'responsive' comes down to: acceleration curves, coyote time, and input buffering.",
    body: `Three causes of "floaty" movement: instant velocity changes, no forgiveness window, missed jump inputs.

Acceleration Curves: Mathf.MoveTowards() with configured acceleration. Snappy start, smooth momentum.

Coyote Time: 0.1-0.15s window after leaving a ledge to still jump. A coyoteTimer float counts down after losing ground contact.

Input Buffering: Cache last jump press time — if pressed 0.1s before landing, fire the jump on landing.

These three things transformed the controller from "sliding on ice" to "this feels like a real game."`,
  },
  {
    tag: 'Architecture', title: 'Why I Use Scriptable Objects for Everything',
    excerpt: 'SOs beyond data: Event Channels, Runtime Sets, Config Managers — eliminating singletons and making systems testable.',
    body: `The Event Bus pattern with Scriptable Objects replaced all static singleton EventManagers.

Each GameEvent ScriptableObject is raised by systems that care, subscribed to in OnEnable() by systems that listen.

Result:
- Zero singletons
- Systems testable in isolation
- Designers wire events in the Inspector
- No initialization order bugs

Runtime Sets = ScriptableObject containing List<T>. Enemies register in OnEnable(). O(1) access to all living enemies, zero scene coupling.`,
  },
  {
    tag: 'Optimization', title: 'Object Pooling: Eliminating GC Spikes from Bullets',
    excerpt: 'Instantiating 200 bullets/second destroyed framerate. A generic Pool<T> reduced GC allocations to near zero.',
    body: `At peak combat: 15 bullets/second instantiated, destroyed 0.5s later. Constant GC pressure.

Generic Pool<T> pre-instantiates a configurable count. Get() activates, Release() deactivates and returns.

Key detail: pools expand gracefully. If all 40 instances are active, instantiate one more and track it.

Pool warmup happens in Awake() so there are zero allocation spikes during gameplay.

Result: GC near-zero during combat. FPS went from variable 45-60 to locked 60.`,
  },
  {
    tag: 'QA · Balancing', title: 'Data-Driven Gameplay Balancing Without Hardcoding',
    excerpt: 'Hardcoded enemy values = nightmare. Rebuilt config with Scriptable Objects + CSV import for zero-code balance iteration.',
    body: `Hardcoded enemy health meant balancing required code changes + QA + new builds. Unacceptable for a live game.

Solution: EnemyData Scriptable Objects define all parameters. EnemyController reads from assigned SO — zero hardcoded values.

Added a CSV import Editor tool. Designer exports Excel, imports, all EnemyData assets update automatically.

Balance iteration time: 30 minutes (code + build) → 2 minutes (CSV import + playtest).

Best code you write might be editor tooling no player ever sees.`,
  },
]

export const REPOS = [
  { name: 'Pixel-Blasters-Tank',  lang: 'C# · Unity', stars: 12, forks: 3, desc: '3D tank battle with enemy AI FSM, projectile pooling, wave system, dynamic difficulty.' },
  { name: 'FPS-Shooter-Unity',    lang: 'C# · Unity', stars: 8,  forks: 2, desc: 'Top-down arena shooter with recoil, ammo management, wave spawning, particle FX.' },
  { name: 'Endless-Runner-3D',    lang: 'C# · Unity', stars: 6,  forks: 1, desc: 'Procedurally generated lane-runner with coin collection, jump/slide, escalating speed.' },
  { name: '3D-Puzzle-Adventure',  lang: 'C# · Unity', stars: 5,  forks: 1, desc: 'Sokoban-style puzzle with Scriptable Object level data and state machine logic.' },
  { name: 'Street-Racing-3D',     lang: 'C# · Unity', stars: 9,  forks: 2, desc: 'Arcade racer with custom vehicle physics, nitro, AI opponents, and drift mechanics.' },
  { name: 'Unity-GameSystems-Kit',lang: 'C# · Unity', stars: 17, forks: 4, desc: 'Reusable library: Inventory, Dialogue, Quest, Object Pool, Event Bus — plug & play.' },
]
