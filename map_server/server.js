const express = require('express');
const app = express();
const port = 8080;
const MongoClient = require('mongodb').MongoClient;


// Set up CORS headers to allow requests from any domain
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('public'));

app.get('/map.js', function(req, res) {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(__dirname + '/map.js');
  });

const uri = '<MONGODB_URI>';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let userInformation;

async function connectToMongoDBAtlas() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error(error);
  }
}

async function findUsersWithinPolygon(polygon) {
    try {
      const db = client.db('Locations');
      const collection = db.collection('Users');
  
      const users = await collection.find({
        location: {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: [polygon],
            },
          },
        },
      }, { projection: { name: 1, 'location.coordinates': 1 } }).toArray();
  
       userInformation = users.map(user => {
        return {
          name: user.name,
          latitude: user.location.coordinates[1],
          longitude: user.location.coordinates[0],
        };
      });
      console.log(userInformation);
    } catch (error) {
      console.error(error);
    }
  }
  
  const polygon = [
    // <COORDINATES_OF_GEOLOCATED_AREA>
];

  connectToMongoDBAtlas()
  findUsersWithinPolygon(polygon)


// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



// Serve the JSON data
app.get("/data", async (req, res) => {
  try {
    await findUsersWithinPolygon(polygon);
    res.send(userInformation);
  } catch (error) {
    console.error(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Geolocation application is listening at http://localhost:${port}`);
});


function validateInput() {
  const nameInput = document.getElementById('nameInput');
  const submitButton = document.getElementById('submitButton');
  const errorText = document.getElementById('errorText');

  if (nameInput.checkValidity()) {
    submitButton.removeAttribute('disabled');
    errorText.style.display = 'none';
  } else {
    submitButton.setAttribute('disabled', true);
    errorText.style.display = 'block';
  }
}