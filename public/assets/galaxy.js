// Draws the twinkling starfield behind every page, with a shooting star
// about every 20 seconds. Colors come from theme.css.
(function () {
  var canvas = document.querySelector(".galaxy-stars");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var rgb = getComputedStyle(document.documentElement).getPropertyValue("--star").trim() || "255, 255, 255";
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [];
  var w, h, dpr;
  var meteor = null;
  var nextMeteor = 4000; // first one shortly after the page opens

  function launchMeteor(t) {
    // Starts near the top and streaks down and across, left to right or right to left.
    var dir = Math.random() < 0.5 ? 1 : -1;
    var angle = (20 + Math.random() * 20) * Math.PI / 180;
    var speed = Math.max(w, h) * (0.9 + Math.random() * 0.4); // px per second
    meteor = {
      x: dir === 1 ? Math.random() * w * 0.6 : w * 0.4 + Math.random() * w * 0.6,
      y: Math.random() * h * 0.35,
      vx: Math.cos(angle) * speed * dir,
      vy: Math.sin(angle) * speed,
      len: 120 + Math.random() * 80,
      start: t,
      life: 1100 + Math.random() * 500
    };
    nextMeteor = t + 17000 + Math.random() * 6000;
  }

  function drawMeteor(t) {
    var age = t - meteor.start;
    if (age > meteor.life) { meteor = null; return; }
    var p = age / meteor.life;
    var fade = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
    var x = meteor.x + meteor.vx * age / 1000;
    var y = meteor.y + meteor.vy * age / 1000;
    var mag = Math.sqrt(meteor.vx * meteor.vx + meteor.vy * meteor.vy);
    var tx = x - meteor.vx / mag * meteor.len;
    var ty = y - meteor.vy / mag * meteor.len;
    var grad = ctx.createLinearGradient(tx, ty, x, y);
    grad.addColorStop(0, "rgba(" + rgb + ",0)");
    grad.addColorStop(1, "rgba(" + rgb + "," + (0.9 * fade).toFixed(3) + ")");
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(" + rgb + "," + (0.8 * fade).toFixed(3) + ")";
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(" + rgb + "," + fade.toFixed(3) + ")";
    ctx.fill();
  }

  function seed() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round((w * h) / 2600);
    stars = [];
    for (var i = 0; i < count; i++) {
      var big = Math.random() < 0.06;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: big ? 1.1 + Math.random() * 0.9 : 0.3 + Math.random() * 0.7,
        base: 0.35 + Math.random() * 0.6,
        speed: 0.4 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        glow: big
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = still ? s.base : s.base * (0.55 + 0.45 * Math.sin(t / 1000 * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + rgb + "," + a.toFixed(3) + ")";
      if (s.glow) { ctx.shadowBlur = 8; ctx.shadowColor = "rgba(" + rgb + ",0.8)"; } else { ctx.shadowBlur = 0; }
      ctx.fill();
    }
    if (still) return;
    if (!meteor && t >= nextMeteor) launchMeteor(t);
    if (meteor) drawMeteor(t);
    requestAnimationFrame(draw);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { seed(); if (still) draw(0); }, 150);
  });
  seed();
  requestAnimationFrame(draw);
})();
