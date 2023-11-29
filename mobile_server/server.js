const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const port = 8080;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Configure Express to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const uri = '<MONGODB_URI>';
const dbName = 'Locations';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDBAtlas() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error(error);
  }
}
connectToMongoDBAtlas();

app.post('/saveData', (req, res) => {
  console.log("Saving data:");
  const data = req.body;

  console.log('Received data:', data);

  const db = client.db(dbName);
  const collection = db.collection('Users');

  collection.insertOne(data, function(err, result) {
    if (err) {
      console.error('Error saving data to MongoDB:', err);
      res.status(500).json({ error: 'Failed to save the data' });
    } else {
      console.log('Data saved successfully');
      res.json({ success: true });
    }
  });
});


app.post('/deleteData', (req, res) => {
  console.log("Deleting data:");
  const query = req.body;

  console.log('Received query:', query);

  const db = client.db(dbName);
  const collection = db.collection('Users');


  collection.deleteOne(query, function(err, result) {
    if (err) {
      console.error('Error deleting data from MongoDB:', err);
      res.status(500).json({ error: 'Failed to delete the data' });
    } else {
      console.log('Data deleted successfully');
      res.json({ success: true });
    }
  });
});


app.listen(8080, () => {
  console.log(`Geolocation application is listening at ${port}`);
});
