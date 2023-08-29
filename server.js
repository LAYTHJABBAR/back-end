const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
// Read data from the JSON file
const rawData = fs.readFileSync('database.json');
const data = JSON.parse(rawData);

// Create
app.post('/create', (req, res) => {
  const { latitude, longitude, filename } = req.body.data;

  // Check for duplicate lat-long pair
  const isDuplicate = data.some(item => item.latitude === latitude && item.longitude === longitude);
  if (isDuplicate) {
    return res.status(400).send('Duplicate lat-long pair');
  }
  data.push({ id: uuidv4(), latitude, longitude, filename });

  // Write data back to the JSON file
  const newData = JSON.stringify(data, null, 2);
  fs.writeFileSync('database.json', newData);

  res.status(201).send('Data created successfully.');
});

// Read all data
app.get('/read', (req, res) => {
  res.json(data);
});

// Update by lat-long pair
app.put('/update', (req, res) => {
  const { lat, long, name } = req.body;

  const index = data.findIndex(item => item.lat === lat && item.long === long);
  if (index === -1) {
    return res.status(404).send('Data not found');
  }

  data[index].name = name;

  // Write data back to the JSON file
  const newData = JSON.stringify(data, null, 2);
  fs.writeFileSync('database.json', newData);

  res.status(200).send('Data updated successfully.');
});

// Delete by lat-long pair
app.delete('/delete', (req, res) => {
  const { lat, long } = req.body;

  const index = data.findIndex(item => item.lat === lat && item.long === long);
  if (index === -1) {
    return res.status(404).send('Data not found');
  }

  data.splice(index, 1);

  // Write data back to the JSON file
  const newData = JSON.stringify(data, null, 2);
  fs.writeFileSync('database.json', newData);

  res.status(200).send('Data deleted successfully.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
