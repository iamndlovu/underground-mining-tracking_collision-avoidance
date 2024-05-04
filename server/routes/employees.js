const router = require('express').Router();
let Employee = require('../models/Employee.model');

router.route('/').get(async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get((req, res) => {
  Employee.findById(req.params.id)
    .then((employee) => {
      if (employee) res.json(employee);
      else {
        res.status(400).json('Error: Employee not found');
      }
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
  const { fullName, uid, gender, age, grade } = req.body;

  const newEmployee = new Employee({ fullName, uid, gender, age, grade });

  newEmployee
    .save()
    .then(() => res.json(newEmployee))
    .catch((err) => {
      console.error(`Failed to save new Employee with error: ${err}`);
      res.status(400).json(`Error ${err}`);
    });
});

router.route('/:id').delete((req, res) => {
  Employee.findByIdAndDelete(req.params.id)
    .then(() => res.json('Employee deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/update/:id').post((req, res) => {
  Employee.findById(req.params.id)
    .then((employee) => {
      employee.make = req.body.make || employee.make;
      employee.uid = req.body.uid || employee.uid;
      employee.driver = req.body.driver || employee.driver;

      employee
        .save()
        .then(() => res.json('Employee updated'))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
