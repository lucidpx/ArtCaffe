/**
 * OpenStreetMap + Leaflet sa custom „dropped pin“ markerom (logo Art caffe).
 * Koordinate: ul. Vojvode Mišića 31, Paraćin — podesiti po potrebi u konstantama ispod.
 */
(function () {
  var LAT = 43.858611;
  var LNG = 21.408333;
  var ZOOM = 17;

  function markerHtml() {
    return (
      '<div class="artcaffe-map-pin" aria-hidden="true">' +
      '<div class="artcaffe-map-pin__head">' +
      '<img src="/images/map-pin-logo.png" alt="" width="40" height="40" loading="lazy" decoding="async" />' +
      "</div>" +
      '<div class="artcaffe-map-pin__stem"></div>' +
      "</div>"
    );
  }

  function initMap(el) {
    if (typeof L === "undefined" || !el) return;

    var map = L.map(el, {
      scrollWheelZoom: false,
      attributionControl: false,
    }).setView([LAT, LNG], ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 19,
    }).addTo(map);

    var icon = L.divIcon({
      className: "artcaffe-div-icon",
      html: markerHtml(),
      iconSize: [52, 62],
      iconAnchor: [26, 62],
      popupAnchor: [0, -62],
    });

    L.marker([LAT, LNG], { icon: icon })
      .addTo(map)
      .bindPopup("<strong>Art caffe</strong><br />Vojvode Mišića 31, Paraćin");

    setTimeout(function () {
      map.invalidateSize();
    }, 100);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-artcaffe-map]").forEach(initMap);
  });
})();
