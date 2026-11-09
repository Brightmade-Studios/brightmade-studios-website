// "Get the app for your school" form on /pto-app: sends to the mail Worker (docs/contact-form.md), which emails the Brightmade inbox.
(function () {
  var WORKER = "https://brightmade-portal.brightmadestudios.workers.dev/contact";
  var form = document.getElementById("get-form");
  if (!form) return;
  var status = document.getElementById("gf-status");
  var button = form.querySelector("button");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = String(value).trim(); });
    var digits = (data.phone || "").replace(/\D/g, "");
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || digits.length < 7 || !data.school) {
      status.textContent = "Please add your name, a valid email, a phone number we can reach you on and your school.";
      return;
    }

    // The Worker takes name, email and message, so the rest is written into the message.
    var lines = [
      "PTO app request ($150 first year launch price, then $250 a year)",
      "",
      "School: " + data.school,
      "Phone: " + data.phone,
    ];
    if (data.note) lines.push("", "Note: " + data.note);

    button.disabled = true;
    button.textContent = "Sending";
    fetch(WORKER, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, message: lines.join("\n"), company: data.company }),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (!res.ok) throw new Error(body.error || "");
          form.hidden = true;
          var done = document.getElementById("gf-done");
          done.hidden = false;
          done.setAttribute("tabindex", "-1");
          done.focus();
        });
      })
      .catch(function (err) {
        status.textContent = err.message || "That did not go through. Please try again, or email contact@brightmadestudios.com.";
        button.disabled = false;
        button.textContent = "Send";
      });
  });
})();
