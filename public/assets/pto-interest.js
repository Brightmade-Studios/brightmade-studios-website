// /pto-app?interest=<id> (a link in our emails) opens the "want us to reach out?" box; ?thanks=1 shows the thank you.
(function () {
  var q = new URLSearchParams(location.search), box = document.getElementById("interest-splash");
  var t = q.get("interest"), thanks = q.get("thanks") === "1";
  if (!box || !(thanks || (t && /^[A-Za-z0-9._-]+$/.test(t)))) return;
  box.hidden = false;
  box.querySelectorAll("[data-state]").forEach(function (el) { el.hidden = el.dataset.state === (thanks ? "ask" : "thanks"); });
  if (!thanks) box.querySelector("form").action = "https://brightmate-worker.brightmadestudios.workers.dev/i/" + t + "?to=" + encodeURIComponent(location.origin + location.pathname);
  box.scrollIntoView({ block: "start" });
})();
