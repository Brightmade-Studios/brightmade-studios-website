// "Ask us to text you" form: sends the number and the consent to the mail Worker, which emails the Brightmade inbox.
(function () {
  var WORKER = "https://brightmate-worker.brightmadestudios.workers.dev/contact";
  var form = document.getElementById("sms-form");
  if (!form) return;
  var status = document.getElementById("sf-status");
  var button = form.querySelector("button");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = String(value).trim(); });
    var digits = (data.phone || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.charAt(0) === "1") digits = digits.slice(1);
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || digits.length !== 10 || data.message.length < 10) {
      status.textContent = "Please add your name, a valid email, a 10 digit mobile number and a few words about what you need.";
      return;
    }
    if (!form.elements.consent.checked) {
      status.textContent = "Please check the box to agree to receive text messages.";
      return;
    }
    button.disabled = true;
    button.textContent = "Sending";
    var consent = "TEXT MESSAGE CONSENT: agreed on " + new Date().toISOString() + " at brightmadestudios.com/text. Mobile number: " + digits + ".";
    var payload = { name: data.name, email: data.email, message: consent + "\n\n" + data.message, budget: "Text me at " + digits, company: data.company || "" };
    fetch(WORKER, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (!res.ok) throw new Error(body.error || "");
          form.hidden = true;
          var done = document.getElementById("sf-done");
          done.hidden = false;
          done.setAttribute("tabindex", "-1");
          done.focus();
        });
      })
      .catch(function (err) {
        status.textContent = err.message || "That did not go through. Please try again, or text (636) 201-2999.";
        button.disabled = false;
        button.textContent = "Send";
      });
  });
})();
