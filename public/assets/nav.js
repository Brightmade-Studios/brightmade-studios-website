// Menu button for phones. Without JavaScript the links simply stay in view.
document.documentElement.classList.add("js");
document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!button || !nav) return;
  function set(open) {
    nav.classList.toggle("open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }
  button.addEventListener("click", function () { set(!nav.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
});
