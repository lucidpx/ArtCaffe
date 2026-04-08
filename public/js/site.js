(function () {
  "use strict";

  var THEME_KEY = "artcaffe-theme";

  function normalizedPath() {
    var p = window.location.pathname || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    if (p === "/index.html" || p === "") p = "/";
    return p;
  }

  function linkMatchesPath(href, path) {
    if (!href) return false;
    if (href === "/") return path === "/" || path === "/index.html";
    return path === href;
  }

  function initNavActive() {
    var path = normalizedPath();
    document.querySelectorAll("a[data-nav]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (linkMatchesPath(href, path)) a.classList.add("nav-active");
    });
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initTheme() {
    var root = document.documentElement;
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      root.classList.toggle("dark", stored === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    }

    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        root.classList.toggle("dark");
        localStorage.setItem(THEME_KEY, root.classList.contains("dark") ? "dark" : "light");
      });
    }
  }

  function initMobileNav() {
    var open = document.getElementById("nav-open");
    var panel = document.getElementById("mobile-nav");
    if (!open || !panel) return;

    function setOpen(on) {
      panel.hidden = !on;
      panel.classList.toggle("hidden", !on);
      open.setAttribute("aria-expanded", on ? "true" : "false");
    }

    open.addEventListener("click", function () {
      setOpen(panel.hidden);
    });

    panel.querySelectorAll("a[data-nav]").forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initParallax() {
    if (prefersReducedMotion()) return;

    var root = document.getElementById("parallax-root");
    if (!root) return;

    var layers = root.querySelectorAll("[data-parallax-speed]");
    if (!layers.length) return;

    var ticking = false;
    var maxShift = 80;

    function update() {
      ticking = false;
      var rect = root.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var progress = 1 - (rect.top + rect.height * 0.35) / (vh + rect.height);
      progress = Math.max(0, Math.min(1, progress));

      layers.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax-speed") || "0");
        var shift = (progress - 0.5) * 2 * maxShift * speed;
        el.style.transform = "translate3d(0, " + shift.toFixed(2) + "px, 0)";
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  function formatPrice(n) {
    if (typeof n !== "number" || isNaN(n)) return "";
    try {
      return new Intl.NumberFormat("sr-Latn-RS", {
        style: "currency",
        currency: "RSD",
        maximumFractionDigits: 0,
      }).format(n);
    } catch (e) {
      return n + " RSD";
    }
  }

  function groupByCategory(items) {
    var map = {};
    items.forEach(function (item) {
      var c = item.category || "Ostalo";
      if (!map[c]) map[c] = [];
      map[c].push(item);
    });
    return map;
  }

  function renderMenuInto(container, options) {
    if (!container) return;
    var compact = options && options.compact;

    container.innerHTML =
      '<p class="text-ink-muted text-sm animate-pulse">Učitavam meni…</p>';

    fetch("/api/menu", { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error("Mreža");
        return r.json();
      })
      .then(function (data) {
        var items = data.items || [];
        if (!items.length) {
          container.innerHTML =
            '<p class="text-ink-muted">Meni će uskoro biti dostupan. Proverite ponovo kasnije.</p>';
          return;
        }

        var byCat = groupByCategory(items);
        var cats = Object.keys(byCat).sort();
        var html = "";

        cats.forEach(function (cat) {
          html +=
            '<div class="' +
            (compact ? "mb-6" : "mb-10") +
            '"><h3 class="mb-4 border-b border-line pb-2 font-display text-2xl text-accent md:text-3xl">' +
            escapeHtml(cat) +
            "</h3><ul class=\"space-y-4\">";

          byCat[cat].forEach(function (it) {
            html +=
              '<li class="flex flex-col gap-2 border-b border-line/60 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">' +
              '<div><p class="font-semibold text-ink">' +
              escapeHtml(it.name || "") +
              "</p>" +
              (it.description
                ? '<p class="mt-1 text-sm text-ink-muted">' + escapeHtml(it.description) + "</p>"
                : "") +
              "</div>" +
              '<span class="menu-price" translate="no">' +
              formatPrice(Number(it.price)) +
              "</span></li>";
          });

          html += "</ul></div>";
        });

        container.innerHTML = html;
      })
      .catch(function () {
        container.innerHTML =
          '<p class="text-ink-muted">Trenutno nije moguće učitati meni. Osvežite stranicu ili nas posetite uskoro.</p>';
      });
  }

  function escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initMenu() {
    var full = document.getElementById("menu-root");
    if (full) renderMenuInto(full, { compact: false });

    var preview = document.getElementById("menu-preview");
    if (preview) renderMenuInto(preview, { compact: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNavActive();
    initYear();
    initMobileNav();
    initParallax();
    initMenu();
  });
})();
