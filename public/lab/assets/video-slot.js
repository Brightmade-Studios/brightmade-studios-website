// Swaps the poster placeholder for the real video as soon as the file exists.
// Drop experience.mp4 (and experience-poster.jpg) into /lab/assets/video/ and nothing else needs editing.
(function () {
  var slots = document.querySelectorAll(".video-slot[data-video]");
  Array.prototype.forEach.call(slots, function (slot) {
    var src = slot.getAttribute("data-video");
    var poster = slot.getAttribute("data-poster");
    fetch(src, { method: "HEAD" }).then(function (res) {
      var type = res.headers.get("content-type") || "";
      if (!res.ok || type.indexOf("video") !== 0) return;
      var frame = slot.querySelector(".video-frame");
      var video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("poster", poster);
      video.setAttribute("aria-label", slot.getAttribute("data-label") || "Preview video");
      var source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      video.appendChild(source);
      frame.innerHTML = "";
      frame.appendChild(video);
    }).catch(function () {});
  });
})();
