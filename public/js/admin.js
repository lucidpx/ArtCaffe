(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function show(el, on) {
    if (!el) return;
    el.classList.toggle("hidden", !on);
  }

  function fmt(n) {
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

  var editingId = null;

  function resetForm() {
    editingId = null;
    $("field-id").value = "";
    $("field-name").value = "";
    $("field-category").value = "";
    $("field-price").value = "";
    $("field-description").value = "";
    $("form-title").textContent = "Nova stavka";
    $("form-submit").textContent = "Sačuvaj stavku";
    show($("form-cancel"), false);
  }

  function fillForm(item) {
    editingId = item.id;
    $("field-id").value = item.id;
    $("field-name").value = item.name || "";
    $("field-category").value = item.category || "";
    $("field-price").value = String(item.price != null ? item.price : "");
    $("field-description").value = item.description || "";
    $("form-title").textContent = "Izmena stavke";
    $("form-submit").textContent = "Ažuriraj stavku";
    show($("form-cancel"), true);
    $("item-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showDash(on) {
    show($("login-section"), !on);
    show($("dash-section"), on);
    show($("admin-logout"), on);
  }

  function setLoginError(msg) {
    var el = $("login-error");
    if (!msg) {
      show(el, false);
      return;
    }
    el.textContent = msg;
    show(el, true);
  }

  function setDashError(msg) {
    var el = $("dash-error");
    if (!msg) {
      show(el, false);
      return;
    }
    el.textContent = msg;
    show(el, true);
  }

  function setFormMsg(msg, ok) {
    var el = $("form-msg");
    if (!msg) {
      show(el, false);
      return;
    }
    el.textContent = msg;
    el.className = "mt-4 text-sm " + (ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400");
    show(el, true);
  }

  async function loadItems() {
    setDashError("");
    var tbody = $("items-tbody");
    tbody.innerHTML =
      '<tr><td colspan="4" class="py-6 text-ink-muted">Učitavam…</td></tr>';
    try {
      var r = await fetch("/api/admin/menu", { credentials: "include" });
      if (r.status === 401) {
        showDash(false);
        setLoginError("Sesija je istekla. Prijavite se ponovo.");
        return;
      }
      if (!r.ok) throw new Error("Greška");
      var data = await r.json();
      var items = data.items || [];
      if (!items.length) {
        tbody.innerHTML =
          '<tr><td colspan="4" class="py-6 text-ink-muted">Nema stavki. Dodajte prvu ispod.</td></tr>';
        return;
      }
      tbody.innerHTML = "";
      items.forEach(function (it) {
        var tr = document.createElement("tr");
        tr.className = "border-b border-line/60";
        tr.innerHTML =
          "<td class=\"py-3 pr-4 font-medium text-ink\">" +
          escapeHtml(it.name) +
          "</td><td class=\"py-3 pr-4 text-ink-muted\">" +
          escapeHtml(it.category) +
          "</td><td class=\"py-3 pr-4 text-accent-warm\">" +
          fmt(Number(it.price)) +
          "</td><td class=\"py-3 text-right whitespace-nowrap\"><button type=\"button\" class=\"btn-ghost mr-2 px-3 py-1 text-xs\" data-edit=\"" +
          escapeAttr(it.id) +
          "\">Izmeni</button><button type=\"button\" class=\"btn-ghost px-3 py-1 text-xs text-red-600 dark:text-red-400\" data-del=\"" +
          escapeAttr(it.id) +
          "\">Obriši</button></td>";
        tbody.appendChild(tr);
      });

      tbody.querySelectorAll("[data-edit]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-edit");
          var item = items.find(function (x) {
            return x.id === id;
          });
          if (item) fillForm(item);
        });
      });
      tbody.querySelectorAll("[data-del]").forEach(function (btn) {
        btn.addEventListener("click", async function () {
          var id = btn.getAttribute("data-del");
          if (!id || !confirm("Da li ste sigurni da želite da obrišete ovu stavku?")) return;
          var dr = await fetch("/api/admin/menu?id=" + encodeURIComponent(id), {
            method: "DELETE",
            credentials: "include",
          });
          if (dr.status === 401) {
            showDash(false);
            return;
          }
          if (!dr.ok) {
            setDashError("Brisanje nije uspelo.");
            return;
          }
          resetForm();
          loadItems();
        });
      });
    } catch (e) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="py-6 text-red-600 dark:text-red-400">Ne mogu da učitam meni.</td></tr>';
    }
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  async function trySession() {
    try {
      var r = await fetch("/api/admin/menu", { credentials: "include" });
      if (r.ok) {
        showDash(true);
        resetForm();
        loadItems();
        return true;
      }
    } catch (e) {
      /* ignore */
    }
    return false;
  }

  document.addEventListener("DOMContentLoaded", function () {
    trySession();

    $("login-form").addEventListener("submit", async function (ev) {
      ev.preventDefault();
      setLoginError("");
      var password = $("admin-password").value;
      try {
        var r = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ password: password }),
        });
        var data = await r.json().catch(function () {
          return {};
        });
        if (!r.ok) {
          setLoginError(data.error || "Prijava nije uspela.");
          return;
        }
        $("admin-password").value = "";
        showDash(true);
        resetForm();
        loadItems();
      } catch (e) {
        setLoginError("Mrežna greška.");
      }
    });

    $("admin-logout").addEventListener("click", async function () {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
      showDash(false);
      resetForm();
    });

    $("form-cancel").addEventListener("click", function () {
      resetForm();
      setFormMsg("");
    });

    $("item-form").addEventListener("submit", async function (ev) {
      ev.preventDefault();
      setFormMsg("");
      var payload = {
        name: $("field-name").value.trim(),
        category: $("field-category").value.trim(),
        price: Number($("field-price").value),
        description: $("field-description").value.trim(),
      };
      if (editingId) payload.id = editingId;

      var url = "/api/admin/menu";
      var method = editingId ? "PUT" : "POST";
      try {
        var r = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        var data = await r.json().catch(function () {
          return {};
        });
        if (r.status === 401) {
          showDash(false);
          return;
        }
        if (!r.ok) {
          setFormMsg(data.error || "Čuvanje nije uspelo.", false);
          return;
        }
        setFormMsg("Sačuvano.", true);
        resetForm();
        loadItems();
      } catch (e) {
        setFormMsg("Mrežna greška.", false);
      }
    });
  });
})();
