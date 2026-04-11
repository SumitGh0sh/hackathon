/**
 * SaathiSeva — Telegram-style support widget (HTML/CSS/JS only).
 * Simulates chat UI; "Start Chat" opens https://t.me/SAATHISEVA_bot in the same tab.
 */
(function () {
  "use strict";

  var TELEGRAM_URL = "https://t.me/SAATHISEVA_bot";
  var WIDGET_ID = "saathiseva-telegram-widget";

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function nowTimeLabel() {
    var d = new Date();
    return pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }

  function createSvgTelegram(size) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    var p = document.createElementNS(ns, "path");
    p.setAttribute(
      "d",
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.23.14.33-.01.06.01.24 0 .38z"
    );
    svg.appendChild(p);
    return svg;
  }

  function createSvgClose() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    [["M18 6L6 18"], ["M6 6l12 12"]].forEach(function (d) {
      var line = document.createElementNS(ns, "path");
      line.setAttribute("d", d[0]);
      svg.appendChild(line);
    });
    return svg;
  }

  function buildWidget() {
    if (document.getElementById(WIDGET_ID)) return;

    var root = document.createElement("div");
    root.id = WIDGET_ID;
    root.className = "tg-widget";
    root.setAttribute("role", "complementary");
    root.setAttribute("aria-label", "Telegram chat widget");

    var backdrop = document.createElement("div");
    backdrop.className = "tg-widget__backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    var panel = document.createElement("div");
    panel.className = "tg-widget__panel";
    panel.id = "tg-widget-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "tg-widget-title");
    panel.setAttribute("aria-hidden", "true");

    var header = document.createElement("div");
    header.className = "tg-widget__header";

    var brand = document.createElement("div");
    brand.className = "tg-widget__header-brand";

    var logoWrap = document.createElement("div");
    logoWrap.className = "tg-widget__header-logo";
    logoWrap.appendChild(createSvgTelegram(22));

    var headText = document.createElement("div");
    headText.className = "tg-widget__header-text";
    var h2 = document.createElement("h2");
    h2.id = "tg-widget-title";
    h2.textContent = "Telegram";
    var sub = document.createElement("p");
    sub.textContent = "SaathiSeva — official bot";
    headText.appendChild(h2);
    headText.appendChild(sub);

    brand.appendChild(logoWrap);
    brand.appendChild(headText);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "tg-widget__close";
    closeBtn.setAttribute("aria-label", "Close chat");
    closeBtn.appendChild(createSvgClose());

    header.appendChild(brand);
    header.appendChild(closeBtn);

    var body = document.createElement("div");
    body.className = "tg-widget__body";

    var row1 = document.createElement("div");
    row1.className = "tg-widget__row";
    var av = document.createElement("div");
    av.className = "tg-widget__avatar";
    av.textContent = "S";
    var bubble = document.createElement("div");
    bubble.className = "tg-widget__bubble";
    bubble.innerHTML =
      '<span>Chat with us on <strong>Telegram</strong> for quick help with schemes, forms, and documents.</span>';
    var time = document.createElement("time");
    time.textContent = nowTimeLabel();
    bubble.appendChild(time);
    row1.appendChild(av);
    row1.appendChild(bubble);

    var row2 = document.createElement("div");
    row2.className = "tg-widget__row";
    var av2 = document.createElement("div");
    av2.className = "tg-widget__avatar";
    av2.textContent = "S";
    var bubble2 = document.createElement("div");
    bubble2.className = "tg-widget__bubble";
    bubble2.innerHTML = "<span>Tap <strong>Start Chat</strong> below — we open Telegram in this tab (same window).</span>";
    var time2 = document.createElement("time");
    time2.textContent = nowTimeLabel();
    bubble2.appendChild(time2);
    row2.appendChild(av2);
    row2.appendChild(bubble2);

    var hint = document.createElement("p");
    hint.className = "tg-widget__hint";
    hint.textContent =
      "This is a website preview. Telegram cannot be embedded in an iframe; you continue in Telegram after starting.";

    body.appendChild(row1);
    body.appendChild(row2);
    body.appendChild(hint);

    var footer = document.createElement("div");
    footer.className = "tg-widget__footer";
    var startLink = document.createElement("a");
    startLink.className = "tg-widget__start";
    startLink.href = TELEGRAM_URL;
    startLink.textContent = "Start Chat on Telegram";
    startLink.setAttribute("rel", "noopener noreferrer");
    startLink.setAttribute("role", "button");
    footer.appendChild(startLink);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "tg-widget__toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "tg-widget-panel");
    toggle.setAttribute("aria-label", "Open Telegram chat");
    toggle.appendChild(createSvgTelegram(28));
    var badge = document.createElement("span");
    badge.className = "tg-widget__toggle-badge";
    badge.textContent = "1";
    toggle.appendChild(badge);

    root.appendChild(backdrop);
    root.appendChild(panel);
    root.appendChild(toggle);
    document.body.appendChild(root);

    var open = false;

    function setOpen(v) {
      open = v;
      panel.classList.toggle("tg-widget__panel--open", v);
      backdrop.classList.toggle("tg-widget__backdrop--visible", v);
      toggle.setAttribute("aria-expanded", v ? "true" : "false");
      panel.setAttribute("aria-hidden", v ? "false" : "true");
      if (v) closeBtn.focus();
    }

    function togglePanel() {
      setOpen(!open);
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!open);
    });

    closeBtn.addEventListener("click", function () {
      setOpen(false);
      toggle.focus();
    });

    backdrop.addEventListener("click", function () {
      setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
