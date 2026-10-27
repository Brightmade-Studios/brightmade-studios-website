// "Get Questly" form on /questly: sends to the mail Worker (docs/contact-form.md), which emails the Brightmade inbox.
// Arriving from the referral QR code (/questly?ref=...) ticks "Someone referred us" and shows the 10% price.
(function () {
  var WORKER = "https://brightmade-portal.brightmadestudios.workers.dev/contact";
  var form = document.getElementById("get-form");
  if (!form) return;
  var status = document.getElementById("gf-status");
  var button = form.querySelector("button");
  var referred = document.getElementById("gf-referred");
  var referrerRow = document.getElementById("gf-referrer-row");
  var banner = document.getElementById("get-referred");

  function showReferral() {
    referrerRow.hidden = !referred.checked;
    banner.hidden = !referred.checked;
  }
  referred.addEventListener("change", showReferral);

  var params = new URLSearchParams(location.search);
  if (params.has("ref")) {
    referred.checked = true;
    var from = params.get("ref");
    // "qr" is the printed card; anything else is a name a family put in their own link.
    if (from && from !== "qr") document.getElementById("gf-referrer").value = from.slice(0, 100);
  }
  showReferral();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = String(value).trim(); });
    var digits = (data.phone || "").replace(/\D/g, "");
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || digits.length < 7) {
      status.textContent = "Please add your name, a valid email and a phone number we can reach you on.";
      return;
    }

    // The Worker takes name, email and message, so the rest is written into the message.
    var lines = [
      referred.checked ? "Questly order request, REFERRAL (10% off, $135 launch price)" : "Questly order request ($150 launch price)",
      "",
      "Phone: " + data.phone,
    ];
    if (referred.checked) lines.push("Referred by: " + (data.referrer || "not given") + (params.has("ref") ? " (arrived from a referral link)" : ""));
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
