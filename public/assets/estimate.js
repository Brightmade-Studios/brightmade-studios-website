// Price estimate on /pricing. The numbers here must match the price cards and rules on the page.
(function () {
  var RATE = { personal: 100, corporate: 150 };  // per screen, per hour
  var SETUP = 50;                                // per screen, once per event
  var form = document.getElementById("estimate");
  if (!form) return;

  var out = {
    total: document.getElementById("est-total"),
    screens: document.getElementById("est-screens"),
    hourly: document.getElementById("est-hourly"),
    time: document.getElementById("est-time"),
    setup: document.getElementById("est-setup"),
    note: document.getElementById("est-note"),
  };
  var money = function (n) { return "$" + n.toLocaleString("en-US"); };

  function update() {
    var screens = parseInt(form.elements.screens.value, 10);
    var hours = parseFloat(form.elements.hours.value);
    var corporate = form.elements.kind.value === "corporate";
    var hourly = screens * RATE[corporate ? "corporate" : "personal"];
    var setup = screens * SETUP;
    out.total.textContent = money(hourly * hours + setup);
    out.screens.textContent = screens + (screens === 1 ? " screen" : " screens");
    out.hourly.textContent = money(hourly) + " an hour";
    out.time.textContent = money(hourly * hours) + " for " + hours + " hours";
    out.setup.textContent = money(setup);
    out.note.textContent = corporate
      ? "Plus a one time logo and theme fee, which we quote once we know what you need."
      : "Travel beyond our free range is extra, and we always confirm before it is added.";
  }
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
})();
