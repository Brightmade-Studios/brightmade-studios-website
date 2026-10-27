// Price estimate on /pricing. The numbers here must match the price cards and rules on the page.
(function () {
  var STATION = 100;       // per station, per hour
  var BOOTH_ALONE = 200;   // 360 Booth on its own, per hour
  var BOOTH_BUNDLED = 150; // 360 Booth with any other station, per hour
  var SETUP = 50;          // per station (the 360 Booth counts), once per event
  var form = document.getElementById("estimate");
  if (!form) return;

  var out = {
    total: document.getElementById("est-total"),
    stations: document.getElementById("est-stations"),
    hourly: document.getElementById("est-hourly"),
    time: document.getElementById("est-time"),
    setup: document.getElementById("est-setup"),
    note: document.getElementById("est-note"),
  };
  var money = function (n) { return "$" + n.toLocaleString("en-US"); };

  function update() {
    var stations = parseInt(form.elements.stations.value, 10);
    var booth = form.elements.booth.checked;
    var hours = parseFloat(form.elements.hours.value);
    var count = stations + (booth ? 1 : 0);
    var hourly = stations * STATION + (booth ? (stations > 0 ? BOOTH_BUNDLED : BOOTH_ALONE) : 0);
    var setup = count * SETUP;
    var bonus = count >= 2 && hours === 4; // the 5th hour is free when 2 or more stations book 4 hours
    var guestHours = bonus ? 5 : hours;
    out.total.textContent = count === 0 ? "$0" : money(hourly * hours + setup);
    out.stations.textContent = count === 0 ? "None yet" : stations === 0 ? "360 Booth only" : stations + (stations === 1 ? " station" : " stations") + (booth ? " plus the 360 Booth" : "");
    out.hourly.textContent = money(hourly) + " an hour";
    out.time.textContent = money(hourly * hours) + " for " + guestHours + " hours" + (bonus ? " (5th hour free)" : "");
    out.setup.textContent = money(setup);
    out.note.textContent = count === 0
      ? "Pick at least one station or the 360 Booth."
      : bonus
        ? "Travel beyond our free range is extra, and we always confirm before it is added."
        : count >= 2
          ? "Book 4 hours and the 5th hour is free."
          : "Travel beyond our free range is extra, and we always confirm before it is added.";
  }
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
})();
