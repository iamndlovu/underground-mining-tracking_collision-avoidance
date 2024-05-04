const router = require('express').Router();
let Automobile = require('../models/Automobile.model');

router.route('/').get(async (req, res) => {
  try {
    const automobiles = await Automobile.find().sort({ createdAt: -1 });
    res.json(automobiles);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get((req, res) => {
  Automobile.findById(req.params.id)
    .then((automobile) => {
      if (automobile) res.json(automobile);
      else {
        res.status(400).json('Error: automobile not found');
      }
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
  const { make, uid, driver } = req.body;

  const newAutomoble = new Automobile({ make, uid, driver });

  newAutomoble
    .save()
    .then(() => res.json(newAutomoble))
    .catch((err) => {
      console.error(`Failed to save new automobile with error: ${err}`);
      res.status(400).json(`Error ${err}`);
    });
});

router.route('/:id').delete((req, res) => {
  Automobile.findByIdAndDelete(req.params.id)
    .then(() => res.json('Automobile deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/update/:id').post((req, res) => {
  Automobile.findById(req.params.id)
    .then((automobile) => {
      automobile.make = req.body.make || automobile.make;
      automobile.uid = req.body.uid || automobile.uid;
      automobile.driver = req.body.driver || automobile.driver;

      automobile
        .save()
        .then(() => res.json('Automobile updated'))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
