var $$ = Dom7;
var app = new Framework7({
  root: '#app', 
  id: 'bg.tugab.ski.locationtracker', 
  name: 'Следене на локация', 
  theme: 'auto', 
  data: function () {
    return {};
  },
  methods: {},
  routes: routes,
});
var mainView = app.views.create('.view-main', {
  url: '/',
});

var leftView = app.views.create('.view-left', {
  url: '/',
});
$$(document).on('deviceready', function () {

  $$(document).on('resume', function (e) {
    app.dialog.alert('Приложението е на фокус.');
  });

  document.addEventListener('backbutton', onBackButton, false);
});
var gpsId = null;
var firstTime = true;
const PROXIMITY_RADIUS = 15;
const MAP_ZOOM = 17;
var currentLocation;
function startGps() {
  if (navigator.geolocation) {
    var options = { enableHighAccuracy: true, timeout: 4000, maximumAge: 30000 };
    gpsId = navigator.geolocation.getCurrentPosition(onSuccessGps, onErrorGps, options);
    $$('.gps-data').html('Изчакване за връзка с GPS приемника ...');
  } else {
    $$('.gps-error').html('Невъзможно е получаването на позицията!');
  }
}
function onSuccessGps(position) {
  var lon = position.coords.longitude;
  var lat = position.coords.latitude;
  currentLocation = {
    type: 'Point',
    coordinates: [lat, lon],
  };
  var accuracy = position.coords.accuracy.toFixed(2);

  $$('.gps-data').html(`Географска дължина: ${lon}<br/>
					      Географска ширина: ${lat}<br/>
						  Точност: ${accuracy} m`);
  sendLocation(currentLocation);
}
function onErrorGps(error) {
  let info = error.message;
  $$('.gps-error').html(`GPS грешка: ${info}<br/>
				Проверете дали е резрешено получаване на местоположението!`);
  stopGps();
}
function stopGps() {
  if (gpsId) {
    navigator.geolocation.clearWatch(gpsId);
    gpsId = null;
  }
}
function sendLocation(currentLocation) {
  var name = $$('#nameInput').val();
  console.log(name);
  console.log(JSON.stringify(currentLocation));

  fetch('<SERVER_URL>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      location: currentLocation,
    }),
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
      console.log(name, currentLocation); 
    });
}
function getLocation() {
  startGps();
  $$('#getLocation').prop('disabled', true);
  setInterval(startGps, 5000);
}
function deleteData() {
  var name = $$('#nameInput').val();

  fetch('<SERVER_URL>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name
    })
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to delete data');
      }
    })
    .then(function(data) {
      console.log('Data deleted successfully:', data);
    })
    .catch(function(error) {
      console.error('Error deleting data:', error);
    });
}

function onBackButton() {
  deleteData();
  navigator.app.exitApp(); 
}
var isLocationRunning = false;
function checkInputValue() {
  var nameInput = $$('#nameInput');
  var getLocationButton = $$('#getLocation');
  var regex = /^[A-Za-zА-Яа-я\s]+$/;

  if (nameInput.val().length >= 4 && regex.test(nameInput.val())) {
    getLocationButton.prop('disabled', false);
  } else {
    getLocationButton.prop('disabled', true);
  }
}
$$('#nameInput').on('input', function () {
  checkInputValue();
});
checkInputValue();
