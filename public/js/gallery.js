(function () {
  "use strict";

  var BASE = "/gallery/";

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function attrEscape(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  function buildItem(item, index) {
    var cap = item.caption ? '<p class="mt-2 text-center text-sm text-ink-muted">' + escapeHtml(item.caption) + "</p>" : "";
    var id = "gallery-item-" + index;

    if (item.type === "video") {
      var poster = item.poster ? ' poster="' + attrEscape(BASE + item.poster) + '"' : "";
      var ext = (item.src || "").split(".").pop().toLowerCase();
      var mime = ext === "webm" ? "video/webm" : "video/mp4";
      return (
        '<figure class="group flex flex-col">' +
        '<div class="overflow-hidden rounded-2xl border border-line bg-surface-muted/30 ring-1 ring-black/5 dark:ring-white/10">' +
        '<video class="aspect-video w-full object-cover" controls playsinline preload="metadata"' +
        poster +
        ">" +
        '<source src="' +
        attrEscape(BASE + item.src) +
        '" type="' +
        mime +
        '" />' +
        "Vaš pregledač ne prikazuje video." +
        "</video>" +
        "</div>" +
        cap +
        "</figure>"
      );
    }

    var src = BASE + (item.src || "");
    var alt = escapeHtml(item.alt || "Galerija Art caffe");
    return (
      '<figure class="flex flex-col">' +
      '<button type="button" class="gallery-zoom block w-full overflow-hidden rounded-2xl border border-line bg-surface-muted/30 ring-1 ring-black/5 transition hover:ring-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:ring-white/10" data-gallery-index="' +
      index +
      '" aria-haspopup="dialog" aria-expanded="false" aria-controls="gallery-lightbox" id="' +
      id +
      '-trigger">' +
      '<img src="' +
      attrEscape(src) +
      '" alt="' +
      alt +
      '" class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" width="800" height="600" />' +
      "</button>" +
      cap +
      "</figure>"
    );
  }

  function openLightbox(items, index) {
    var item = items[index];
    if (!item || item.type === "video") return;

    var modal = document.getElementById("gallery-lightbox");
    var img = document.getElementById("gallery-lightbox-img");
    if (!modal || !img) return;

    img.src = BASE + item.src;
    img.alt = item.alt || "Art caffe — galerija";

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
    img.focus({ preventScroll: true });
  }

  function closeLightbox() {
    var modal = document.getElementById("gallery-lightbox");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    var img = document.getElementById("gallery-lightbox-img");
    if (img) img.removeAttribute("src");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("gallery-root");
    if (!root) return;

    fetch("/gallery-manifest.json", { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error("manifest");
        return r.json();
      })
      .then(function (data) {
        var items = data.items || [];
        if (!items.length) {
          root.innerHTML =
            '<div class="card mx-auto max-w-xl text-center text-ink-muted">' +
            "<p>Još uvek nema objavljenih fotografija ili video zapisa.</p>" +
            "<p class=\"mt-3 text-sm\">Kada budete spremni, dodajte fajlove u folder <code class=\"rounded bg-surface-muted px-1 py-0.5 text-xs\">public/gallery/</code> i upišite ih u <code class=\"rounded bg-surface-muted px-1 py-0.5 text-xs\">gallery-manifest.json</code>, zatim ponovo pokrenite build.</p>" +
            "</div>";
          return;
        }

        var html =
          '<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">' +
          items.map(buildItem).join("") +
          "</div>";
        root.innerHTML = html;

        root.querySelectorAll(".gallery-zoom").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var i = parseInt(btn.getAttribute("data-gallery-index"), 10);
            openLightbox(items, i);
          });
        });
      })
      .catch(function () {
        root.innerHTML =
          '<p class="text-center text-ink-muted">Nije moguće učitati galeriju. Proverite da li postoji fajl gallery-manifest.json.</p>';
      });

    var modal = document.getElementById("gallery-lightbox");
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-close-lightbox]")) closeLightbox();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  });
})();
