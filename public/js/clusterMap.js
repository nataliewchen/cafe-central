mapboxgl.accessToken = mapboxToken;

if (cafes.features) {
  const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10'
  });

  map.fitBounds(mapboxBounds, { padding: 50 });

  map.on('load', () => {

      // adding geojson cafe data as the source for the map
      map.addSource('cafes', {
          type: 'geojson',
          data: cafes
      });

      cafes.features.forEach((cafe, i) => {
          const coordinates = cafe.geometry.coordinates;

          // create the html elements for the pin
          const link = document.createElement('a');
          link.href = `/cafes/${cafe.id}`;
          const pin = document.createElement('div');
          pin.classList.add('pin');
          pin.id = `pin${i}`;
          const pinText = document.createElement('div');
          pinText.innerText = i+1;
          pinText.classList.add('pin-text');
          pin.appendChild(pinText);
          link.appendChild(pin);

          const options = {
              className: 'popup',
              closeButton: false,
              closeOnClick: false,
              offset: 25
          };

          let popupText = `<h5>${cafe.name}</h5>`;
          popupText += `${cafe.stars}${cafe.reviewLen}`;
          const popup = new mapboxgl.Popup(options)
          .setHTML(popupText)
          .setLngLat(coordinates);

          pin.addEventListener('mouseenter', () => {
              popup.addTo(map);
          });

          pin.addEventListener('mouseleave', () => {
              popup.remove();
          });
          

          new mapboxgl.Marker(link)
          .setLngLat(coordinates)
          .addTo(map);
      })

      
  });


  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-left');

  const cafeCards = document.querySelectorAll('.cafe-card');
  cafeCards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      document.querySelector(`#pin${i}`).parentElement.classList.add('highlight');
    });
    card.addEventListener('mouseleave', () => {
      document.querySelector(`#pin${i}`).parentElement.classList.remove('highlight');
    });
  })
}