// Contact form: sends to the mail Worker (docs/contact-form.md), which emails the Brightmade inbox.
(function () {
  var WORKER = "https://brightmade-portal.brightmadestudios.workers.dev/contact";
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("cf-status");
  var button = form.querySelector("button");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = String(value).trim(); });
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length < 10) {
      status.textContent = "Please add your name, a valid email and a few words about what you want built.";
      return;
    }
    button.disabled = true;
    button.textContent = "Sending";
    fetch(WORKER, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (!res.ok) throw new Error(body.error || "");
          form.hidden = true;
          var done = document.getElementById("cf-done");
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
