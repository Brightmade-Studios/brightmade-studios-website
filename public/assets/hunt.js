// Custom Orders page: hero stage tilt, plus the pinned-phone scroll story.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pinned phone: the screen follows whichever step is at the middle of the viewport,
  // and the phone turns gently as each step scrolls past.
  var phone = document.querySelector(".scrolly-phone");
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step-card"));
  var shots = phone ? phone.querySelectorAll("img[data-shot]") : [];
  var current = null;

  function show(step) {
    if (step === current) return;
    current = step;
    steps.forEach(function (s) { s.classList.toggle("active", s === step); });
    var name = step.getAttribute("data-shot");
    Array.prototype.forEach.call(shots, function (img) {
      img.classList.toggle("active", img.getAttribute("data-shot") === name);
    });
  }

  function update() {
    var mid = window.innerHeight * 0.5;
    var found = steps[0];
    steps.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      if (r.top <= mid) found = s;
      if (!reduce && r.top <= mid && r.bottom > mid) {
        var t = (mid - r.top) / r.height;
        var dir = i % 2 === 0 ? 1 : -1;
        phone.style.setProperty("--ry", (dir * (t - 0.5) * -34).toFixed(1) + "deg");
        phone.style.setProperty("--rx", (5 - Math.abs(t - 0.5) * 8).toFixed(1) + "deg");
      }
    });
    show(found);

    // Small screens: fade each step's text out as it passes under the pinned phone.
    var visual = document.querySelector(".scrolly-visual");
    var small = window.matchMedia("(max-width: 820px)").matches;
    var bottom = small && visual ? visual.getBoundingClientRect().bottom : 0;
    steps.forEach(function (s) {
      var copy = s.querySelector(".step-copy");
      if (!copy) return;
      if (small) copy.style.setProperty("--cut", (bottom - copy.getBoundingClientRect().top - 6).toFixed(0) + "px");
      else copy.style.removeProperty("--cut");
    });
  }

  if (phone && steps.length) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  if (reduce) return;

  // Hero stage tilts toward the pointer, so the three phones shift in depth against each other.
  var stage = document.querySelector(".stage");
  if (stage) {
    var inner = stage.querySelector(".stage-inner");
    stage.addEventListener("pointermove", function (ev) {
      var r = stage.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      inner.style.setProperty("--sy", (x * 22).toFixed(1) + "deg");
      inner.style.setProperty("--sx", (-y * 14).toFixed(1) + "deg");
    });
    stage.addEventListener("pointerleave", function () {
      inner.style.setProperty("--sy", "0deg");
      inner.style.setProperty("--sx", "0deg");
    });
  }
})();
