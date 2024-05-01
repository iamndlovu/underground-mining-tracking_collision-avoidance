const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const user = require('./routes/users');

/*****************************************************************************
 *                                                                           *
 *                                                                           *
 *       DISTANCE STATUS:                                                    *
 *       0 -> safe zone,  1 -> caution zone                                  *
 *       2 -> alarm zone, 3 -> danger zone                                   *
 *                                                                           *
 *                                                                           *
 *****************************************************************************/
// data_rank 	ID 	Safety Distance 	Distance Status 	Location Latitude 	Location Longitude 	Distance From Zone1 	Distance From Zone2 	Distance From Zone3 	Location Status 	Overall Status 	readings_date
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
