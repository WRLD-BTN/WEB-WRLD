/* techcircle.js — Rotating tech circuit background */

(function () {
  const canvas = document.getElementById('techCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const ACCENT = '#00c8ff';
  const ACCENT_SOFT = 'rgba(0, 200, 255, 0.38)';
  const ACCENT_GLOW = 'rgba(0, 224, 255, 0.9)';
  const DETAIL = 'rgba(137, 225, 255, 0.68)';

  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    active: false
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });

  window.addEventListener('mouseout', (event) => {
    if (event.relatedTarget) return;
    pointer.active = false;
  });

  window.addEventListener('blur', () => {
    pointer.active = false;
  });

  const rings = [
    { r: 140, speed:  0.0016, opacity: 0.24, dash: [8, 10], lineW: 0.9 },
    { r: 220, speed: -0.0010, opacity: 0.18, dash: [14, 18], lineW: 0.7 },
    { r: 310, speed:  0.0012, opacity: 0.14, dash: [5, 22], lineW: 0.55 },
    { r: 400, speed: -0.0008, opacity: 0.11, dash: [9, 32], lineW: 0.5 },
    { r: 500, speed:  0.0006, opacity: 0.08, dash: [18, 42], lineW: 0.45 }
  ];

  const nodes = [
    { ring: 1, label: 'HTML5', angle: 0.0, dotR: 5 },
    { ring: 1, label: 'CSS3', angle: 2.1, dotR: 5 },
    { ring: 1, label: 'JS', angle: 4.2, dotR: 5 },
    { ring: 2, label: 'React', angle: 0.5, dotR: 4 },
    { ring: 2, label: 'Node', angle: 2.6, dotR: 4 },
    { ring: 2, label: 'MySQL', angle: 4.8, dotR: 4 },
    { ring: 3, label: 'Figma', angle: 1.0, dotR: 4 },
    { ring: 3, label: 'WP', angle: 3.0, dotR: 4 },
    { ring: 3, label: 'Print', angle: 5.3, dotR: 4 },
    { ring: 4, label: 'Adobe', angle: 0.8, dotR: 3 },
    { ring: 4, label: 'SEO', angle: 3.5, dotR: 3 }
  ];

  const spokes = [
    { ring: 0, angle: 0.0, speed: 0.0024 },
    { ring: 0, angle: 2.1, speed: 0.0024 },
    { ring: 0, angle: 4.2, speed: 0.0024 },
    { ring: 2, angle: 1.5, speed: -0.0016 },
    { ring: 2, angle: 3.6, speed: -0.0016 },
    { ring: 2, angle: 5.7, speed: -0.0016 }
  ];

  const traces = [
    { ring: 0, angle: 0.24, sweep: 0.5, innerOffset: -16, outerOffset: 22, branch: 0.12 },
    { ring: 0, angle: 2.55, sweep: 0.42, innerOffset: -26, outerOffset: 20, branch: -0.13 },
    { ring: 1, angle: 1.1, sweep: 0.48, innerOffset: -32, outerOffset: 18, branch: 0.16 },
    { ring: 1, angle: 3.75, sweep: 0.55, innerOffset: -24, outerOffset: 24, branch: -0.16 },
    { ring: 2, angle: 0.68, sweep: 0.44, innerOffset: -22, outerOffset: 24, branch: 0.11 },
    { ring: 2, angle: 2.85, sweep: 0.5, innerOffset: -28, outerOffset: 28, branch: -0.11 },
    { ring: 3, angle: 1.72, sweep: 0.46, innerOffset: -30, outerOffset: 26, branch: 0.09 },
    { ring: 3, angle: 4.25, sweep: 0.4, innerOffset: -18, outerOffset: 22, branch: -0.12 },
    { ring: 4, angle: 0.92, sweep: 0.38, innerOffset: -22, outerOffset: 20, branch: 0.08 },
    { ring: 4, angle: 3.9, sweep: 0.34, innerOffset: -16, outerOffset: 18, branch: -0.09 }
  ];

  let t = 0;

  function cursorGlow(x, y, radius = 160) {
    if (!pointer.active) return 0;
    const dx = pointer.x - x;
    const dy = pointer.y - y;
    const distance = Math.sqrt((dx * dx) + (dy * dy));
    return Math.max(0, 1 - (distance / radius));
  }

  function polarPoint(cx, cy, radius, angle) {
    return {
      x: cx + (Math.cos(angle) * radius),
      y: cy + (Math.sin(angle) * radius)
    };
  }

  function strokeWithGlow(drawPath, alpha, width, hoverBoost) {
    ctx.save();
    ctx.globalAlpha = alpha + (hoverBoost * 0.22);
    ctx.lineWidth = width + (hoverBoost * 0.45);
    ctx.strokeStyle = ACCENT;
    ctx.shadowColor = ACCENT_GLOW;
    ctx.shadowBlur = 8 + (hoverBoost * 18);
    drawPath();
    ctx.stroke();
    ctx.restore();
  }

  function drawRing(cx, cy, ring) {
    ctx.save();
    ctx.strokeStyle = ACCENT_SOFT;
    ctx.globalAlpha = ring.opacity;
    ctx.lineWidth = ring.lineW;
    ctx.setLineDash(ring.dash);
    ctx.lineDashOffset = -t * ring.speed * 420;
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawTrace(cx, cy, trace) {
    const ring = rings[trace.ring];
    const rotation = t * ring.speed;
    const startAngle = trace.angle + rotation;
    const endAngle = startAngle + trace.sweep;
    const start = polarPoint(cx, cy, ring.r + trace.innerOffset, startAngle);
    const corner = polarPoint(cx, cy, ring.r, startAngle);
    const outer = polarPoint(cx, cy, ring.r + trace.outerOffset, endAngle);
    const branch = polarPoint(cx, cy, ring.r + trace.outerOffset + 18, endAngle + trace.branch);
    const hover = Math.max(
      cursorGlow(start.x, start.y, 170),
      cursorGlow(corner.x, corner.y, 170),
      cursorGlow(outer.x, outer.y, 170),
      cursorGlow(branch.x, branch.y, 170)
    );

    strokeWithGlow(() => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(corner.x, corner.y);
      ctx.arc(cx, cy, ring.r, startAngle, endAngle);
      ctx.lineTo(outer.x, outer.y);
      ctx.lineTo(branch.x, branch.y);
    }, 0.11 + ring.opacity, 0.8, hover);

    ctx.save();
    ctx.globalAlpha = 0.24 + (hover * 0.3);
    ctx.fillStyle = DETAIL;
    ctx.shadowColor = ACCENT_GLOW;
    ctx.shadowBlur = 6 + (hover * 16);
    [start, outer, branch].forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1.8 + (hover * 0.9), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawNode(cx, cy, x, y, label, dotR, alpha) {
    const hover = cursorGlow(x, y, 180);
    const glowRadius = dotR * (3.2 + hover * 2.2);

    ctx.save();
    ctx.globalAlpha = alpha + (hover * 0.22);

    const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
    glow.addColorStop(0, ACCENT_GLOW);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = ACCENT;
    ctx.shadowColor = ACCENT_GLOW;
    ctx.shadowBlur = 10 + (hover * 18);
    ctx.beginPath();
    ctx.arc(x, y, dotR + (hover * 0.8), 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = hover > 0.2 ? '#f2fdff' : DETAIL;
    ctx.font = "500 10px 'Exo 2', sans-serif";
    ctx.textAlign = 'center';

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.max(1, Math.sqrt((dx * dx) + (dy * dy)));
    const nx = dx / dist;
    const ny = dy / dist;
    ctx.fillText(label, x + (nx * 14), y + (ny * 14) + 3);

    ctx.restore();
  }

  function drawSpoke(cx, cy, r, angle, alpha) {
    const target = polarPoint(cx, cy, r, angle);
    const hover = cursorGlow(target.x, target.y, 190);

    strokeWithGlow(() => {
      ctx.setLineDash([4, 7]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(target.x, target.y);
    }, alpha, 0.45, hover);
  }

  function drawCrosshair(cx, cy) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = ACCENT_SOFT;
    ctx.lineWidth = 0.6;
    ctx.setLineDash([2, 8]);
    ctx.beginPath();
    ctx.moveTo(cx - 22, cy);
    ctx.lineTo(cx + 22, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 22);
    ctx.lineTo(cx, cy + 22);
    ctx.stroke();
    ctx.restore();
  }

  function drawBackgroundGlow(cx, cy) {
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(window.innerWidth, window.innerHeight) * 0.52);
    halo.addColorStop(0, 'rgba(0, 130, 220, 0.09)');
    halo.addColorStop(0.55, 'rgba(0, 90, 170, 0.05)');
    halo.addColorStop(1, 'rgba(4, 11, 24, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function drawCenterDot(cx, cy) {
    ctx.save();
    ctx.globalAlpha = 0.42;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
    glow.addColorStop(0, ACCENT_GLOW);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.92;
    ctx.fillStyle = '#d8fbff';
    ctx.shadowColor = ACCENT_GLOW;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    drawBackgroundGlow(cx, cy);
    drawCrosshair(cx, cy);

    rings.forEach((ring) => drawRing(cx, cy, ring));
    traces.forEach((trace) => drawTrace(cx, cy, trace));

    spokes.forEach((spoke) => {
      const angle = spoke.angle + (t * spoke.speed);
      drawSpoke(cx, cy, rings[spoke.ring].r, angle, 0.11);
    });

    nodes.forEach((node) => {
      const ring = rings[node.ring];
      const angle = node.angle + (t * ring.speed);
      const point = polarPoint(cx, cy, ring.r, angle);
      drawNode(cx, cy, point.x, point.y, node.label, node.dotR, ring.opacity * 2.3);
    });

    drawCenterDot(cx, cy);

    t += 1;
    requestAnimationFrame(draw);
  }

  draw();
})();
