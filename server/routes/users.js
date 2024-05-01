const router = require('express').Router();
let User = require('../models/User.model');

router.route('/').get(async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) res.json(user);
      else {
        res.status(400).json('Error: user not found');
      }
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
  const { fullName, username, email, password, level } = req.body;

  let user = {
    fullName,
    username,
    email,
    password,
    level,
  };

  const newUser = new User(user);

  newUser
    .save()
    .then(() => res.json(newUser))
    .catch((err) => {
      console.error(`Failed to save new user with error: ${err}`);
      res.status(400).json(`Error ${err}`);
    });
});

router.route('/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/update/:id').post((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;

      user
        .save()
        .then(() => res.json('User updated'))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
