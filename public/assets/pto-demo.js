// Interactive demo of the School PTO App on /pto-app. Everything here is sample
// content for an imaginary school: no accounts, no network calls, no tracking.
(function () {
  var root = document.getElementById("pto-demo");
  if (!root) return;

  // ---------- Sample content (dates are relative to today so it never looks stale)
  function day(offset) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offset); return d; }
  var EVENTS = [
    { id: "fair", icon: "📚", d: day(1), time: "3:00 PM", en: "Fall Book Fair", es: "Feria del libro de otoño",
      place: { en: "School library", es: "Biblioteca de la escuela" },
      body: { en: "Browse new books all week. Every purchase earns free books for our classrooms. Volunteers needed for the Friday shift!", es: "Vea libros nuevos toda la semana. Cada compra regala libros a nuestros salones. ¡Se necesitan voluntarios para el turno del viernes!" } },
    { id: "movie", icon: "🎬", d: day(4), time: "6:30 PM", en: "Family Movie Night", es: "Noche de cine familiar",
      place: { en: "School gym", es: "Gimnasio de la escuela" },
      body: { en: "Bring a blanket! Popcorn and drinks are sold by the PTO, and every dollar goes to field trips.", es: "¡Traiga una cobija! La PTO vende palomitas y bebidas, y cada dólar va para excursiones." } },
    { id: "meeting", icon: "🗣️", d: day(7), time: "7:00 PM", en: "PTO General Meeting", es: "Reunión general de la PTO",
      place: { en: "Cafeteria and online", es: "Cafetería y en línea" },
      body: { en: "Everyone is welcome. We will vote on the spring fundraiser and plan teacher appreciation week.", es: "Todos son bienvenidos. Votaremos sobre la recaudación de primavera y planearemos la semana de agradecimiento a maestros." } },
    { id: "run", icon: "🏃", d: day(12), time: "9:00 AM", en: "Fun Run", es: "Carrera divertida",
      place: { en: "School field", es: "Campo de la escuela" },
      body: { en: "Our biggest fundraiser of the year. Sign up to cheer, hand out water or run a lap with your kids.", es: "Nuestra mayor recaudación del año. Inscríbase para animar, repartir agua o correr una vuelta con sus hijos." } },
  ];
  var SPIRIT = [
    { id: "pizza", icon: "🍕", d: day(3), time: "4:00 to 8:00 PM", name: "Tony's Pizza Kitchen", give: 20 },
    { id: "taco", icon: "🌮", d: day(10), time: "5:00 to 9:00 PM", name: "Taco Fiesta", give: 15 },
    { id: "cafe", icon: "🥞", d: day(17), time: "7:00 to 11:00 AM", name: "Sunny Side Café", give: 25 },
  ];
  var MINUTES = [
    { id: "oct", d: day(-21), en: "October General Meeting", es: "Reunión general de octubre",
      items: { en: ["Fall Festival raised $3,240 for classroom supplies", "New playground shade sails approved", "Holiday shop volunteers start signing up next week"],
               es: ["El Festival de otoño recaudó $3,240 para útiles", "Se aprobaron toldos nuevos para el patio", "La inscripción de voluntarios para la tienda navideña empieza la próxima semana"] } },
    { id: "sep", d: day(-49), en: "September General Meeting", es: "Reunión general de septiembre",
      items: { en: ["Welcomed 18 new families to the PTO", "Budget for the year approved", "Spirit night calendar set through December"],
               es: ["Dimos la bienvenida a 18 familias nuevas", "Se aprobó el presupuesto del año", "Calendario de noches de espíritu listo hasta diciembre"] } },
  ];
  var STAFF = [
    { id: "a", initials: "MR", name: "Ms. Rivera", role: { en: "2nd grade", es: "2.º grado" }, fav: { en: ["Iced vanilla latte", "Sour gummy worms", "Anything purple", "Target gift cards"], es: ["Latte helado de vainilla", "Gomitas ácidas", "Todo lo morado", "Tarjetas de regalo de Target"] } },
    { id: "b", initials: "JT", name: "Mr. Thompson", role: { en: "PE teacher", es: "Educación física" }, fav: { en: ["Black coffee", "Trail mix", "Green", "Sports store gift cards"], es: ["Café negro", "Mezcla de frutos secos", "Verde", "Tarjetas de tiendas deportivas"] } },
    { id: "c", initials: "AK", name: "Mrs. Kim", role: { en: "Librarian", es: "Bibliotecaria" }, fav: { en: ["Chai tea", "Dark chocolate", "Teal", "Bookstore gift cards"], es: ["Té chai", "Chocolate amargo", "Turquesa", "Tarjetas de librería"] } },
  ];

  // ---------- Words
  var T = {
    en: {
      school: "Your School PTO", district: "Your School District", home: "Home", messages: "Messages", spirit: "Spirit", minutes: "Minutes", staff: "Staff", more: "More",
      notifyTitle: "Never miss a thing", notifyBody: "Turn on alerts for events and news.", notifyOn: "Alerts on", notifyOff: "Turn on",
      calendar: "Calendar", portal: "Parent portal", lunch: "Lunch menu", social: "Our page",
      important: "Important", announcement: "Announcement", upcoming: "Upcoming events", details: "Details",
      addCal: "Add to my calendar", added: "Added to your calendar", volunteer: "I can volunteer", thanks: "Thanks! The PTO will reach out.",
      msgTitle: "Important message", msgBody: "Picture Day is moved to next Tuesday. Order forms go home in backpacks, or order right here in the app.",
      latestAlert: "Latest alert", alertBody: "Book Fair starts tomorrow at 3:00 PM in the library!",
      spiritIntro: "Eat out and the restaurant gives back to our school.", gives: "gives back", flyer: "View flyer", show: "Show this flyer at the register",
      minutesIntro: "Notes from every PTO meeting, ready to read.", highlights: "Highlights",
      staffIntro: "Get to know our teachers and staff, and what they love.", drink: "Drink", snack: "Snack", color: "Color", gift: "Gift card",
      merch: "Spirit wear", merchBody: "Shirts, hoodies and more from your school store.", shop: "Shop now", opens: "Opens your school's store",
      langLabel: "Language", parent: "Parent view", board: "Board view",
      boardTitle: "PTO board", boardIntro: "This is how your board posts. No tech skills needed.",
      newPost: "New announcement", postTitle: "Title", postBody: "Message", sendPush: "Also send a push notification",
      sampleTitle: "Book Fair starts tomorrow!", sampleBody: "Come to the library from 3:00 PM. Volunteers welcome!",
      publish: "Post and notify families", sent: "Posted! Every family just got a notification.", autoEs: "Spanish version written for you automatically",
      today: "Today", tomorrow: "Tomorrow", now: "now", close: "Close", back: "Back",
    },
    es: {
      school: "PTO de tu escuela", district: "Distrito escolar", home: "Inicio", messages: "Mensajes", spirit: "Noches", minutes: "Actas", staff: "Personal", more: "Más",
      notifyTitle: "No se pierda nada", notifyBody: "Active alertas de eventos y noticias.", notifyOn: "Alertas activas", notifyOff: "Activar",
      calendar: "Calendario", portal: "Portal de padres", lunch: "Menú", social: "Nuestra página",
      important: "Importante", announcement: "Anuncio", upcoming: "Próximos eventos", details: "Detalles",
      addCal: "Agregar a mi calendario", added: "Agregado a su calendario", volunteer: "Puedo ser voluntario", thanks: "¡Gracias! La PTO se comunicará con usted.",
      msgTitle: "Mensaje importante", msgBody: "El Día de fotos se mueve al próximo martes. Los formularios van en las mochilas, o pida aquí en la app.",
      latestAlert: "Última alerta", alertBody: "¡La Feria del libro empieza mañana a las 3:00 PM en la biblioteca!",
      spiritIntro: "Coma fuera y el restaurante dona a nuestra escuela.", gives: "se dona", flyer: "Ver volante", show: "Muestre este volante en la caja",
      minutesIntro: "Notas de cada reunión de la PTO, listas para leer.", highlights: "Lo más importante",
      staffIntro: "Conozca a nuestros maestros y personal, y lo que les encanta.", drink: "Bebida", snack: "Botana", color: "Color", gift: "Tarjeta",
      merch: "Ropa escolar", merchBody: "Camisetas, sudaderas y más de la tienda escolar.", shop: "Comprar", opens: "Abre la tienda de su escuela",
      langLabel: "Idioma", parent: "Vista de padres", board: "Vista de la mesa",
      boardTitle: "Mesa directiva", boardIntro: "Así publica su mesa directiva. Sin conocimientos técnicos.",
      newPost: "Nuevo anuncio", postTitle: "Título", postBody: "Mensaje", sendPush: "Enviar también una notificación",
      sampleTitle: "¡La Feria del libro empieza mañana!", sampleBody: "Vengan a la biblioteca desde las 3:00 PM. ¡Voluntarios bienvenidos!",
      publish: "Publicar y avisar a las familias", sent: "¡Publicado! Todas las familias recibieron una notificación.", autoEs: "Versión en inglés escrita automáticamente",
      today: "Hoy", tomorrow: "Mañana", now: "ahora", close: "Cerrar", back: "Volver",
    },
  };

  var state = { lang: "en", tab: "home", view: "parent", sheet: null, alerts: false, added: {}, volunteered: {}, posted: false, toast: "" };
  var t = function (k) { return T[state.lang][k]; };
  var L = function (o) { return typeof o === "string" ? o : o[state.lang]; };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(d, opts) { return d.toLocaleDateString(state.lang === "es" ? "es-US" : "en-US", opts); }
  function rel(d) {
    var diff = Math.round((d - day(0)) / 864e5);
    if (diff === 0) return t("today");
    if (diff === 1) return t("tomorrow");
    return fmt(d, { weekday: "short", month: "short", day: "numeric" });
  }

  // Small line icons for the dock, drawn in the current text color
  var ICONS = {
    home: '<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    messages: '<path d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>',
    spirit: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
    minutes: '<path d="M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h6M9.5 15.5h6"/>',
    staff: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    more: '<path d="M5 7h14M5 12h14M5 17h14"/>',
  };
  function icon(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>"; }

  // ---------- Screens
  function header() {
    return '<div class="d-glass d-header"><span class="d-logo" aria-hidden="true">🔔</span><div class="d-brand"><b>' + t("school") + "</b><small>" + t("district") + "</small></div>" +
      '<button class="d-lang" data-act="lang" aria-label="' + t("langLabel") + '"><span' + (state.lang === "en" ? ' class="on"' : "") + ">EN</span><span" + (state.lang === "es" ? ' class="on"' : "") + ">ES</span></button></div>";
  }
  function eventRow(e) {
    return '<button class="d-glass d-row" data-act="event" data-id="' + e.id + '"><span class="d-date"><small>' + esc(fmt(e.d, { month: "short" })) + "</small><b>" + e.d.getDate() + "</b></span>" +
      '<span class="d-row-copy"><b>' + e.icon + " " + esc(L(e)) + "</b><small>" + esc(rel(e.d)) + " • " + e.time + "</small></span>" + (state.added[e.id] ? '<span class="d-check" aria-label="' + t("added") + '">✓</span>' : '<span class="d-chev" aria-hidden="true">›</span>') + "</button>";
  }
  var screens = {
    home: function () {
      var hero = EVENTS[0];
      return '<div class="d-glass d-notify"><div><b>🔔 ' + t("notifyTitle") + "</b><small>" + t("notifyBody") + "</small></div>" +
        '<button class="d-toggle' + (state.alerts ? " on" : "") + '" data-act="alerts" role="switch" aria-checked="' + state.alerts + '"><span>' + (state.alerts ? t("notifyOn") : t("notifyOff")) + "</span></button></div>" +
        '<div class="d-links">' + [["calendar", "📅", "purple"], ["portal", "🎓", "gold"], ["lunch", "🍎", "purple"], ["social", "👍", "blue"]].map(function (l) {
          return '<button class="d-glass d-link" data-act="toast" data-msg="' + esc(t(l[0])) + '"><span class="d-ic ' + l[2] + '">' + l[1] + "</span><small>" + t(l[0]) + "</small></button>";
        }).join("") + "</div>" +
        '<button class="d-glass strong d-hero" data-act="event" data-id="' + hero.id + '"><span class="d-hero-top"><small>' + t("announcement") + '</small><em>' + t("important") + "</em></span><b>" + hero.icon + " " + esc(L(hero)) + "</b><small>" + esc(rel(hero.d)) + " • " + hero.time + " • " + esc(L(hero.place)) + "</small></button>" +
        '<h4 class="d-h">' + t("upcoming") + "</h4>" + EVENTS.slice(1).map(eventRow).join("");
    },
    messages: function () {
      return '<div class="d-glass strong d-card"><span class="d-hero-top"><small>' + t("msgTitle") + "</small><em>" + t("important") + "</em></span><p>📸 " + t("msgBody") + "</p></div>" +
        '<h4 class="d-h">' + t("latestAlert") + '</h4><div class="d-glass d-card d-alert"><span class="d-logo sm" aria-hidden="true">🔔</span><div><b>' + t("school") + " <small>• 2h</small></b><p>" + t("alertBody") + "</p></div></div>" +
        '<h4 class="d-h">' + t("upcoming") + "</h4>" + EVENTS.map(eventRow).join("");
    },
    spirit: function () {
      return '<p class="d-intro">' + t("spiritIntro") + "</p>" + SPIRIT.map(function (s) {
        return '<div class="d-glass d-card d-spirit"><span class="d-big" aria-hidden="true">' + s.icon + '</span><div><b>' + esc(s.name) + "</b><small>" + esc(rel(s.d)) + " • " + s.time + '</small><span class="d-give">' + s.give + "% " + t("gives") + '</span></div><button class="d-pill gold" data-act="flyer" data-id="' + s.id + '">' + t("flyer") + "</button></div>";
      }).join("");
    },
    minutes: function () {
      return '<p class="d-intro">' + t("minutesIntro") + "</p>" + MINUTES.map(function (m) {
        return '<button class="d-glass d-row" data-act="minutes" data-id="' + m.id + '"><span class="d-ic purple" aria-hidden="true">📝</span><span class="d-row-copy"><b>' + esc(L(m)) + "</b><small>" + esc(fmt(m.d, { month: "long", day: "numeric", year: "numeric" })) + '</small></span><span class="d-chev" aria-hidden="true">›</span></button>';
      }).join("");
    },
    staff: function () {
      return '<p class="d-intro">' + t("staffIntro") + '</p><div class="d-staff">' + STAFF.map(function (s) {
        return '<button class="d-glass d-person" data-act="staff" data-id="' + s.id + '"><span class="d-avatar">' + s.initials + "</span><b>" + esc(s.name) + "</b><small>" + esc(L(s.role)) + "</small></button>";
      }).join("") + "</div>";
    },
    more: function () {
      return '<div class="d-glass strong d-card d-merch"><span class="d-big" aria-hidden="true">👕</span><b>' + t("merch") + "</b><p>" + t("merchBody") + '</p><button class="d-pill" data-act="toast" data-msg="' + esc(t("opens")) + '">' + t("shop") + "</button></div>" +
        '<div class="d-glass d-card"><b>' + t("langLabel") + '</b><div class="d-seg"><button data-act="setlang" data-id="en" class="' + (state.lang === "en" ? "on" : "") + '">English</button><button data-act="setlang" data-id="es" class="' + (state.lang === "es" ? "on" : "") + '">Español</button></div></div>' +
        '<button class="d-glass d-row" data-act="board"><span class="d-ic gold" aria-hidden="true">🛠️</span><span class="d-row-copy"><b>' + t("board") + "</b><small>" + t("boardIntro") + '</small></span><span class="d-chev" aria-hidden="true">›</span></button>';
    },
  };

  function boardScreen() {
    return '<div class="d-board-head"><button class="d-back" data-act="parent">‹ ' + t("back") + "</button><b>🛠️ " + t("boardTitle") + "</b></div>" +
      '<p class="d-intro">' + t("boardIntro") + '</p><div class="d-glass strong d-card d-form"><b>' + t("newPost") + "</b>" +
      "<label>" + t("postTitle") + '<span class="d-input">' + t("sampleTitle") + "</span></label><label>" + t("postBody") + '<span class="d-input tall">' + t("sampleBody") + "</span></label>" +
      '<span class="d-check-row"><span class="d-tick">✓</span>' + t("sendPush") + '</span><span class="d-check-row"><span class="d-tick">✓</span>🌎 ' + t("autoEs") + "</span>" +
      (state.posted ? '<p class="d-sent">✅ ' + t("sent") + "</p>" : '<button class="d-pill wide" data-act="publish">📣 ' + t("publish") + "</button>") + "</div>";
  }

  function sheet() {
    var s = state.sheet; if (!s) return "";
    var inner = "";
    if (s.type === "event") {
      var e = EVENTS.filter(function (x) { return x.id === s.id; })[0];
      inner = '<span class="d-big" aria-hidden="true">' + e.icon + "</span><h5>" + esc(L(e)) + "</h5><small>" + esc(fmt(e.d, { weekday: "long", month: "long", day: "numeric" })) + " • " + e.time + "<br>📍 " + esc(L(e.place)) + "</small><p>" + esc(L(e.body)) + "</p>" +
        (state.added[e.id] ? '<p class="d-sent">✅ ' + t("added") + "</p>" : '<button class="d-pill wide" data-act="add" data-id="' + e.id + '">📅 ' + t("addCal") + "</button>") +
        (state.volunteered[e.id] ? '<p class="d-sent">💜 ' + t("thanks") + "</p>" : '<button class="d-pill wide gold" data-act="vol" data-id="' + e.id + '">🙋 ' + t("volunteer") + "</button>");
    } else if (s.type === "flyer") {
      var f = SPIRIT.filter(function (x) { return x.id === s.id; })[0];
      inner = '<div class="d-flyer"><span class="d-big" aria-hidden="true">' + f.icon + "</span><small>" + t("school") + "</small><h5>" + esc(f.name) + "</h5><b>" + esc(fmt(f.d, { weekday: "long", month: "long", day: "numeric" })) + "</b><small>" + f.time + '</small><span class="d-give big">' + f.give + "% " + t("gives") + "</span></div><p>" + t("show") + "</p>";
    } else if (s.type === "minutes") {
      var m = MINUTES.filter(function (x) { return x.id === s.id; })[0];
      inner = '<span class="d-big" aria-hidden="true">📝</span><h5>' + esc(L(m)) + "</h5><small>" + esc(fmt(m.d, { month: "long", day: "numeric", year: "numeric" })) + '</small><b class="d-sub">' + t("highlights") + '</b><ul class="d-list">' + L(m.items).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
    } else if (s.type === "staff") {
      var p = STAFF.filter(function (x) { return x.id === s.id; })[0];
      var labels = [["☕", t("drink")], ["🍬", t("snack")], ["🎨", t("color")], ["🎁", t("gift")]];
      inner = '<span class="d-avatar big">' + p.initials + "</span><h5>" + esc(p.name) + "</h5><small>" + esc(L(p.role)) + '</small><div class="d-favs">' + L(p.fav).map(function (v, i) { return '<span><small>' + labels[i][0] + " " + labels[i][1] + "</small><b>" + esc(v) + "</b></span>"; }).join("") + "</div>";
    }
    return '<div class="d-scrim" data-act="close"></div><div class="d-sheet" role="dialog" aria-modal="true"><span class="d-grab" aria-hidden="true"></span>' + inner + '<button class="d-close" data-act="close" aria-label="' + t("close") + '">×</button></div>';
  }

  function render() {
    var body = state.view === "board" ? boardScreen() : screens[state.tab]();
    var tabs = ["home", "messages", "spirit", "minutes", "staff", "more"];
    root.innerHTML =
      '<div class="d-screen" lang="' + state.lang + '">' +
        '<div class="d-status"><b>9:41</b><span aria-hidden="true">●●● ▮</span></div>' +
        '<div class="d-top">' + header() + "</div>" +
        '<div class="d-body">' + body + "</div>" +
        (state.view === "board" ? "" : '<nav class="d-dock" aria-label="App tabs">' + tabs.map(function (k) {
          return '<button data-act="tab" data-id="' + k + '" class="' + (state.tab === k ? "on" : "") + '" aria-label="' + t(k) + '"' + (state.tab === k ? ' aria-current="page"' : "") + ">" + icon(k) + "<small>" + t(k) + "</small></button>";
        }).join("") + "</nav>") +
        sheet() +
        (state.toast ? '<div class="d-toast" role="status">' + esc(state.toast) + "</div>" : "") +
        '<div class="d-banner" role="status" aria-live="polite"></div>' +
      "</div>";
  }

  // ---------- Notification banner (drops from the top like a real push)
  var bannerTimer;
  function push(text) {
    var b = root.querySelector(".d-banner");
    b.innerHTML = '<span class="d-logo sm" aria-hidden="true">🔔</span><span><b>' + t("school") + " <small>" + t("now") + "</small></b><span>" + esc(text) + "</span></span>";
    b.classList.remove("show"); void b.offsetWidth; b.classList.add("show");
    b.onclick = function () { state.view = "parent"; state.tab = "home"; state.sheet = { type: "event", id: "fair" }; render(); };
    clearTimeout(bannerTimer); bannerTimer = setTimeout(function () { b.classList.remove("show"); }, 4200);
  }
  var toastTimer;
  function toast(msg) { state.toast = msg; render(); clearTimeout(toastTimer); toastTimer = setTimeout(function () { state.toast = ""; render(); }, 1800); }

  // ---------- Interaction
  function act(a, id, el) {
    if (a === "tab") { state.tab = id; state.sheet = null; render(); root.querySelector(".d-body").scrollTop = 0; }
    else if (a === "lang") { state.lang = state.lang === "en" ? "es" : "en"; render(); }
    else if (a === "setlang") { state.lang = id; render(); }
    else if (a === "event" || a === "flyer" || a === "minutes" || a === "staff") { state.sheet = { type: a, id: id || "fair" }; render(); }
    else if (a === "close") { state.sheet = null; render(); }
    else if (a === "add") { state.added[id] = true; render(); }
    else if (a === "vol") { state.volunteered[id] = true; render(); }
    else if (a === "alerts") { state.alerts = !state.alerts; render(); if (state.alerts) setTimeout(function () { push(t("alertBody")); }, 700); }
    else if (a === "toast") { toast(el.getAttribute("data-msg")); }
    else if (a === "board") { state.view = "board"; state.sheet = null; state.posted = false; render(); }
    else if (a === "parent") { state.view = "parent"; render(); }
    else if (a === "publish") { state.posted = true; render(); setTimeout(function () { push(t("sampleTitle")); }, 600); }
    else if (a === "notify") { state.sheet = null; render(); push(t("alertBody")); }
  }
  root.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-act]"); if (!el || !root.contains(el)) return;
    act(el.getAttribute("data-act"), el.getAttribute("data-id"), el);
  });
  // The buttons beside the phone drive it too
  document.querySelectorAll("[data-demo]").forEach(function (b) {
    b.addEventListener("click", function () {
      var a = b.getAttribute("data-demo");
      if (a === "notify") act("notify");
      else if (a === "lang") act("lang");
      else if (a === "board") act("board");
      else if (a === "event") { state.view = "parent"; state.tab = "home"; act("event", "fair"); }
      if (window.innerWidth < 1000) root.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  render();
  // The first time the phone scrolls into view, a notification drops in on its own
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); setTimeout(function () { push(t("alertBody")); }, 1200); }
    }, { threshold: 0.6 });
    io.observe(root);
  }
})();
