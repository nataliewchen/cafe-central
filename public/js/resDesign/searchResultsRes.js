const mapSwitch = document.querySelector('#mapViewSwitch');
const mapContainer = document.querySelector('#mapContainer');
const results = document.querySelector('#results');

let trigger = true; // only change layout once when passing breakpoint

if (!mapSwitch.checked && window.innerWidth < 576) {
  mapContainer.classList.add('hide-map');
}

mapSwitch.addEventListener('change', () => {
  if (mapSwitch.checked) { // show map
    results.classList.add('d-none');
    mapContainer.classList.remove('hide-map');
  } else { // hide map
    results.classList.remove('d-none');
    mapContainer.classList.add('hide-map');
  }
})


const showAll = () => {
  results.classList.remove('d-none');
  mapContainer.classList.remove('hide-map');
}



window.addEventListener('resize', () => {
  if (window.innerWidth > 576) {
    showAll();
    trigger = false;
  } else if (window.innerWidth < 576) {
    if (!trigger) {
      mapSwitch.checked = false;
      mapContainer.classList.add('hide-map');
      trigger = true;
    }
  }
})