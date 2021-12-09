mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: cafeCoordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(cafeCoordinates)
    .addTo(map);

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');