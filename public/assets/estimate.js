// Price estimate on /pricing. The numbers here must match the price cards on the page.
(function () {
  var RATE = { personal: 100, corporate: 150 };
  var BUNDLE_RATE = 250;   // all three screens, non-corporate, per hour
  var SETUP = 50;          // per screen, once per event
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
    var stations = form.querySelectorAll('input[name="station"]:checked').length;
    var hours = parseFloat(form.elements.hours.value);
    var corporate = form.elements.kind.value === "corporate";
    if (!stations) {
      out.total.textContent = "$0";
      out.note.textContent = "Pick at least one station to see an estimate.";
      out.screens.textContent = out.hourly.textContent = out.time.textContent = out.setup.textContent = "-";
      return;
    }
    var bundle = stations === 3 && !corporate;
    var hourly = bundle ? BUNDLE_RATE : stations * RATE[corporate ? "corporate" : "personal"];
    var setup = stations * SETUP;
    out.total.textContent = money(hourly * hours + setup);
    out.screens.textContent = stations + (stations === 1 ? " screen" : " screens") + (bundle ? " (Full Experience)" : "");
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
