const { Schema, model } = require('mongoose');

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

const ObstacleSchema = new Schema(
  {
    objectID: { type: String, required: true },
    safetyDistance: { type: Number, required: true },
    distanceStatus: { type: Number, required: true, default: 0 },
    gps: { type: Object, default: { longitude: 0.0, latitude: 0.0 } },
    locationStatus: { type: String },
    overallStatus: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Obstacle = model('Obstacle', ObstacleSchema);

module.exports = Obstacle;
