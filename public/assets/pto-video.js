// The ad on /pto-app: starts with sound only when someone presses play, then shows the normal video controls.
(function () {
  var video = document.getElementById("pto-video");
  if (!video) return;
  var reel = video.closest(".pto-reel");
  function play() {
    reel.classList.add("playing");
    video.controls = true;
    video.muted = false;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
    if (window.innerWidth < 1000) reel.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  document.querySelectorAll("[data-play]").forEach(function (b) { b.addEventListener("click", play); });
  video.addEventListener("ended", function () { reel.classList.remove("playing"); video.controls = false; video.load(); });
})();
