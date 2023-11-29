function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var name = document.getElementById("nameInput").value;
      saveData(name, position.coords.latitude, position.coords.longitude);
    }, function(error) {
      console.log("Error retrieving location");
    });
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}

function saveData(name, latitude, longitude) {
  var location = {
    type: "Point",
    coordinates: [latitude, longitude]
  };

  // Make a POST request to your server-side endpoint to save the data to MongoDB
  fetch('<SERVER_URL>/saveData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      location: location
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      console.log(name, latitude, longitude);
      var message = "The location of " + data.name + " was saved in the database: " + latitude + " " + longitude;
      console.log(message);
    })
    .catch(function(error) {
      console.error(error);
    });
}

function deleteData() {
  var name = document.getElementById("nameInput").value;
  // Make a POST request to your server-side endpoint to delete the data from MongoDB
  fetch('<SERVER_URL>/deleteData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      var message = "Data for " + name + " was deleted from the database";
      console.log(message);
    })
    .catch(function(error) {
      console.error(error);
    });
}