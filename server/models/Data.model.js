const { Schema, model } = require('mongoose');

/*****************************************************************************
 *                                                                           *
 *                                                                           *
 *       DISTANCE STATUS:                                                    *
 *       0 -> safe zone,  1 -> caution zone                                  *
 *       2 -> alarm zone, 3 -> danger zone                                   *
 *                                                                           *
 *                                                                           *
 *       OBJECT TYPE:      |  OVERALL STATUS:                                *
 *       0 -> automobile   |  0 -> SAFE                                      *
 *       1 -> employee     |  1 -> CAUTION                                   *
 *       2 -> unknown      |  2 -> ALARM                                     *
 *                         |  3 -> DANGER                                    *
 *                                                                           *
 *       LOCATION STATUS:                                                    *
 *       0 -> closest to zone 1                                              *
 *       1 -> closest to zone 2                                              *
 *                                                                           *
 *                                                                           *
 *                                                                           *
 *                                                                           *
 *****************************************************************************/

const DataSchema = new Schema(
  {
    objectID: { type: String, required: true },
    type: { type: Number, required: true },
    safetyDistance: { type: Number, required: true },
    distanceStatus: { type: Number, required: true, default: 0 },
    gps: { type: Object, default: { longitude: 0.0, latitude: 0.0 } },
    locationStatus: { type: Number, default: 10 },
    overallStatus: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Data = model('Data', DataSchema);

module.exports = Data;
