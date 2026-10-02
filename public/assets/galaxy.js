// Draws the twinkling starfield behind every page. Colors come from theme.css.
(function () {
  var canvas = document.querySelector(".galaxy-stars");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var rgb = getComputedStyle(document.documentElement).getPropertyValue("--star").trim() || "255, 255, 255";
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [];
  var w, h, dpr;

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
    if (!still) requestAnimationFrame(draw);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { seed(); if (still) draw(0); }, 150);
  });
  seed();
  requestAnimationFrame(draw);
})();
