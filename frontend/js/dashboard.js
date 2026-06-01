const dashboardMap = L.map("dashboard-map", {
  zoomControl: false,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false
}).setView([-4.9708, -39.0154], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(dashboardMap);

L.marker([-4.9708, -39.0154])
  .addTo(dashboardMap)
  .bindPopup("Região central de Quixadá");