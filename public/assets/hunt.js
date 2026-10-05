// Custom Orders page: pointer tilt for the phones and a scroll-in for each story section.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
  if (reduce) return;

  // Whole stage tilts toward the pointer, so the three phones shift in depth against each other.
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

  // Each story phone leans toward the pointer too, with a light sheen across the glass.
  document.querySelectorAll(".tilt").forEach(function (p) {
    p.addEventListener("pointermove", function (ev) {
      var r = p.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      p.style.setProperty("--ry", (x * 26).toFixed(1) + "deg");
      p.style.setProperty("--rx", (-y * 18).toFixed(1) + "deg");
      p.style.setProperty("--shine", (x * 80).toFixed(0) + "%");
    });
    p.addEventListener("pointerleave", function () {
      p.style.setProperty("--ry", "0deg");
      p.style.setProperty("--rx", "0deg");
      p.style.setProperty("--shine", "-40%");
    });
  });
})();
