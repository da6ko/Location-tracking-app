mapboxgl.accessToken = '<MAPBOXGL_TOKEN>';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [],
  zoom: 18
});


const markers = [];
let intervalId = null;
let lastOpenedPopup = null;



function addMarkers(data) {
  data.forEach((marker) => {
    const el = document.createElement('div');
    el.className = 'marker';
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.name);
    const newMarker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([marker.latitude, marker.longitude])
      .setPopup(popup)
      .addTo(map);

    popup.on('open', () => {
      lastOpenedPopup = popup;
    });

    markers.push(newMarker);
  });

  if (lastOpenedPopup) {
    lastOpenedPopup.addTo(map);
  }
}


function removeMarkers() {
  markers.forEach((marker) => {
    marker.remove();
  });
  markers.length = 0;
}

function fetchDataAndAddMarkers() {
  fetch('<SERVER_URL>/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      removeMarkers();
      addMarkers(data);
    })
    .catch(error => console.log(error));
}

function search() {
  const searchInput = document.getElementById('searchInput').value;
  
  // Close all popups
  if (lastOpenedPopup) {
    lastOpenedPopup.remove();
    lastOpenedPopup = null;
  }

  fetch('<SERVER_URL>/data')
    .then(response => response.json())
    .then(data => {
      removeMarkers();
      console.log(data);
      const foundData = data.find(item => item.name.toLowerCase() === searchInput.toLowerCase());
      const searchResult = document.getElementById('searchResult');
        const capitalizedSearchInput = searchInput.replace(/^(.)|\s+(.)/g, ($1) => $1.toUpperCase());
      if (foundData) {

        searchResult.textContent = `${capitalizedSearchInput} е на училище.`;

        // Create a new marker for the searched person
        const el = document.createElement('div');
        el.className = 'marker';
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(foundData.name);
        const newMarker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([foundData.latitude, foundData.longitude])
          .setPopup(popup)
          .addTo(map);

        // Store the last opened popup when clicked
        popup.on('open', () => {
          lastOpenedPopup = popup;
        });

        markers.push(newMarker); 
        lastOpenedPopup = popup; 

        map.flyTo({ center: [foundData.latitude, foundData.longitude], zoom: 18 });
      } else {
        searchResult.textContent = `${capitalizedSearchInput} не се намира в училищната зона.`;
      }
    })
    .catch(error => console.log(error));
    stopInterval();
}
// Add event listener to input box
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('click', closePopups);

// Close all popups
function closePopups() {
  if (lastOpenedPopup) {
    lastOpenedPopup.remove();
    lastOpenedPopup = null;
  }
}


function startInterval() {
  submitButton
  intervalId = setInterval(fetchDataAndAddMarkers, 5000);
}

function stopInterval() {
  clearInterval(intervalId);
}

fetchDataAndAddMarkers();
startInterval();

//Validate the input and change css values
function validateInput() {
  const nameInput = document.getElementById('searchInput');
  const submitButton = document.getElementById('submitButton');
  const errorText = document.getElementById('errorText');

  if (nameInput.checkValidity()) {
    submitButton.removeAttribute('disabled');
    submitButton.style.backgroundColor = "#2eb086";
    errorText.style.display = 'none';
  } else {
    submitButton.setAttribute('disabled', true);
    submitButton.style.backgroundColor = '#E74646'; 
    errorText.style.display = 'block';
  }
}

