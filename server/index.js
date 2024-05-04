const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const user = require('./routes/users');
const data = require('./routes/data');
const automobile = require('./routes/automobiles');
const employee = require('./routes/employees');

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//mongoose
mongoose
  .connect(
    'mongodb://127.0.0.1:27017/underground-mining-tracking-and-collision-avoidance'
  )
  .then(() => console.log('MOngoDB database connected'));

app.get('/', (req, res) =>
  res.json('Hello from Underground Mining Tracking Server!')
);

app.post('/secreteID', (req, res) => {
  const superUserID = 'admin';
  const { id } = req.body;
  res.json(id == superUserID);
});

app.use('/users', user);
app.use('/data', data);
app.use('/automobiles', automobile);
app.use('/employees', employee);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
