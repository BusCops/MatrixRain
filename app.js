/* ===================================================================
   MATRIX RAIN BACKGROUND  -  edit the CONFIG block below, nothing else
   =================================================================== */
const CONFIG = {
  // ---- general ----
  speed: 1,                 // global speed multiplier: 0.5 = half, 1 = normal, 2 = double
  density: 1,               // global drop-count multiplier: 0.5 = half as many, 2 = twice as many
  bgColor: '#000000',       // background color
  trailFade: 0.32,          // 0.05 = long smeared glow trails ... 1 = no smear (crisp)
  trailLength: 1,           // global trail length multiplier: 0.5 = short, 2 = long

  // ---- colors ----
  color: '#AFFF33',         // main rain color (trail)
  headColor: '#EFFFD0',     // color of the bright leading character

  // ---- characters / font ----
  chars: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリギジビピウゥクスツヌフムユュルグズブプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789Z:.=*+-<>|',
  font: '"MS Gothic","Noto Sans Mono CJK JP","Hiragino Kaku Gothic Pro",monospace',
  mutation: 0.35,           // how often trail characters change (0 = never, 1 = constantly)

  // ---- canvas placement ----
  autoStyleCanvas: true,    // true = JS makes the canvas a fixed full-screen layer behind your page
  opacity: 1,               // opacity of the whole effect (0 - 1), handy to dim it behind text

  // ---- depth layers (far -> near). Add, remove or edit freely. ----
  layers: [
    // fontSize: glyph size px | speed: [min,max] rows/sec | trail: [min,max] glyphs
    // brightness: 0-1 | glow: head glow px | density: 0-1 share of columns with a drop
    { fontSize: 12, speed: [5, 9],   trail: [14, 30], brightness: 0.35, glow: 0,  density: 0.55 },
    { fontSize: 18, speed: [9, 15],  trail: [12, 28], brightness: 0.70, glow: 0,  density: 0.45 },
    { fontSize: 28, speed: [15, 26], trail: [10, 24], brightness: 1.00, glow: 14, density: 0.35 }
  ]
};
/* =================================================================== */

(() => {
  let canvas = document.querySelector('canvas');
  if (!canvas) { canvas = document.createElement('canvas'); document.body.prepend(canvas); }
  const ctx = canvas.getContext('2d');

  if (CONFIG.autoStyleCanvas) {
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100%', height: '100%',
      zIndex: '-1', pointerEvents: 'none', opacity: CONFIG.opacity
    });
  }

  const hexToRgb = h => {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
  };
  const bg = hexToRgb(CONFIG.bgColor);
  const main = hexToRgb(CONFIG.color);
  const head = hexToRgb(CONFIG.headColor);
  const neck = main.map((v, i) => (v + head[i]) / 2 | 0); // 2nd glyph: halfway between

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = reduceMotion ? 0.35 : 1;
  const chars = CONFIG.chars;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rndChar = () => chars[(Math.random() * chars.length) | 0];

  let W = 0, H = 0;
  const layers = CONFIG.layers.map(l => ({ ...l, streams: [] }));

  function makeStream(layer, col, rows, scatter) {
    const len = Math.max(3, Math.round(rnd(layer.trail[0], layer.trail[1]) * CONFIG.trailLength));
    return {
      col, len,
      y: scatter ? rnd(-len, rows + len) : -rnd(0, rows * 0.6) - len,
      speed: rnd(layer.speed[0], layer.speed[1]),
      chars: Array.from({ length: len }, rndChar),
      lastRow: -9999
    };
  }

  function initStreams() {
    layers.forEach(layer => {
      const cols = Math.ceil(W / layer.fontSize);
      const rows = Math.ceil(H / layer.fontSize);
      const chance = Math.min(1, layer.density * CONFIG.density);
      layer.streams = [];
      for (let c = 0; c < cols; c++) {
        if (Math.random() < chance) layer.streams.push(makeStream(layer, c, rows, true));
      }
    });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = CONFIG.bgColor;
    ctx.fillRect(0, 0, W, H);
    initStreams();
  }

  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(${bg[0]},${bg[1]},${bg[2]},${CONFIG.trailFade})`;
    ctx.fillRect(0, 0, W, H);

    for (const layer of layers) {
      const fs = layer.fontSize;
      const rows = Math.ceil(H / fs);
      ctx.font = `${fs}px ${CONFIG.font}`;

      for (const s of layer.streams) {
        s.y += s.speed * CONFIG.speed * motion * dt;
        const headRow = Math.floor(s.y);

        if (headRow !== s.lastRow) {
          s.chars.unshift(rndChar());
          s.chars.length = s.len;
          s.lastRow = headRow;
        }
        if (Math.random() < CONFIG.mutation) s.chars[1 + ((Math.random() * (s.len - 1)) | 0)] = rndChar();

        if (headRow - s.len > rows) { Object.assign(s, makeStream(layer, s.col, rows, false)); continue; }

        const x = s.col * fs;
        for (let i = 0; i < s.len; i++) {
          const row = headRow - i;
          if (row < 0 || row > rows) continue;
          const a = Math.pow(1 - i / s.len, 1.7) * layer.brightness;
          if (a < 0.02) continue;
          const c = i === 0 ? head : i === 1 ? neck : main;
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
          const y = row * fs + fs;
          if (i === 0 && layer.glow) {
            ctx.shadowColor = CONFIG.color;
            ctx.shadowBlur = layer.glow;
            ctx.fillText(s.chars[i], x, y);
            ctx.shadowBlur = 0;
          } else {
            ctx.fillText(s.chars[i], x, y);
          }
        }
      }
    }
  }

  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { last = performance.now(); });
  resize();
  requestAnimationFrame(frame);
})();