// Share Questly card (/questly-refer): share, copy or print the referral link.
// An optional first name goes into the shared link as ?ref=Name. The printed QR code always says ?ref=qr.
(function () {
  var BASE = "https://brightmadestudios.com/questly";
  var shown = document.getElementById("refer-link");
  var name = document.getElementById("refer-name");
  var share = document.getElementById("refer-share");
  var copy = document.getElementById("refer-copy");

  function link() {
    var who = name.value.trim();
    return BASE + "?ref=" + encodeURIComponent(who || "qr") + "#get";
  }
  function update() { shown.textContent = link().replace("https://", "").replace("#get", ""); }
  name.addEventListener("input", update);

  if (navigator.share) {
    share.hidden = false;
    share.addEventListener("click", function () {
      navigator.share({ title: "Questly", text: "Questly is a chores and rewards app made for your family. This link gets you 10% off.", url: link() }).catch(function () {});
    });
  }

  copy.addEventListener("click", function () {
    var done = function () { copy.textContent = "Copied"; setTimeout(function () { copy.textContent = "Copy the link"; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(link()).then(done, function () { copy.textContent = "Copy failed"; });
    else copy.textContent = "Copy failed";
  });

  document.getElementById("refer-print").addEventListener("click", function () { window.print(); });
})();
