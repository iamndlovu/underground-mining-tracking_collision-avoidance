const router = require('express').Router();
let Obstacle = require('../models/Obstacle.model');

router.route('/').get(async (req, res) => {
  try {
    const objects = await Obstacle.find().sort({ createdAt: -1 });
    res.json(objects);
  } catch (err) {
    console.error(`Error while fetching objects: ${err}`);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const object = await Obstacle.findById(req.params.id);
    if (object) res.json(object);
    else {
      console.log(`Object with id ${req.params.id} not found.`);
      res.status(404).json(`Error: Object with id ${req.params.id} not found.`);
    }
  } catch (err) {
    console.error(`Error while fetching object: ${err}`);
    res.status(400).json('Error: ' + err);
  }
});

// data_rank 	ID 	Safety Distance 	Distance Status 	Location Latitude 	Location Longitude 	Distance From Zone1 	Distance From Zone2 	Distance From Zone3 	Location Status 	Overall Status 	readings_date

router.route('/add').post(async (req, res) => {
  const {
    objectID,
    safetyDistance,
    distanceStatus,
    gps,
    locationStatus,
    overallStatus,
  } = req.body;

  let object = {
    objectID,
    safetyDistance,
    distanceStatus,
    overallStatus,
  };

  if (gps) object.gps = gps;
  if (locationStatus) object.locationStatus = locationStatus;

  try {
    const newObject = new Obstacle(object);
    const response = await newObject.save();
    res.json(response);
  } catch (err) {
    console.error(`Failed to create new OBJECT document with error: ${err}`);
    res.status(400).json(`Error ${err}`);
  }
});

router.route('/:id').delete((req, res) => {
  Obstacle.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
