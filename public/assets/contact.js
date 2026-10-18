// Contact form: sends to the mail Worker (docs/contact-form.md), which emails the Brightmade inbox.
// The Worker takes name, email and message, so the topic, date and guest count are written into the message.
(function () {
  var WORKER = "https://brightmade-portal.brightmadestudios.workers.dev/contact";
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("cf-status");
  var button = form.querySelector("button");
  var interest = document.getElementById("cf-interest");
  var eventFields = document.getElementById("cf-event-fields");

  // /contact?topic=app opens the form on the custom app choice
  var topic = new URLSearchParams(location.search).get("topic");
  if (topic === "app") interest.value = "Custom app or website";

  function showEventFields() { eventFields.hidden = interest.value !== "Event experience"; }
  interest.addEventListener("change", showEventFields);
  showEventFields();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = String(value).trim(); });
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length < 10) {
      status.textContent = "Please add your name, a valid email and a few words about what you have in mind.";
      return;
    }
    var lines = ["Topic: " + data.interest];
    if (data.interest === "Event experience") {
      lines.push("Event date: " + (data.eventdate || "not given"));
      lines.push("Guests: " + (data.guests || "not given"));
    }
    lines.push("", data.message);

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
