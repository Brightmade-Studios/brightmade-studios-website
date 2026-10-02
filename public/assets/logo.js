// Plays the logo intro once the B and star images have loaded; tap the logo to replay.
(function () {
  var logo = document.getElementById("logo");
  if (!logo) return;
  function play() {
    document.body.classList.remove("play");
    logo.classList.remove("play");
    void logo.getBoundingClientRect();
    logo.classList.add("play");
    document.body.classList.add("play");
  }
  var srcs = ["/assets/logo/b_only.webp", "/assets/logo/star_only.webp"];
  Promise.all(srcs.map(function (s) {
    return new Promise(function (r) { var i = new Image(); i.onload = i.onerror = r; i.src = s; });
  })).then(function () { document.body.classList.remove("wait"); play(); });
  setTimeout(function () { document.body.classList.remove("wait"); }, 3000);
  logo.addEventListener("click", play);
})();
