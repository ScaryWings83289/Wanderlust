mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/scarywings83289/ckhvqicdx07ig19o10602md7b", // stylesheet location
  center: tour.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(tour.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${tour.title}</h5><p style="margin-bottom: 0px">${tour.location}</p>`
    )
  )
  .addTo(map);
