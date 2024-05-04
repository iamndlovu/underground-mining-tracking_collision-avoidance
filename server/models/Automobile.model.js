const { Schema, model } = require('mongoose');

const AutomobileSchema = new Schema(
  {
    make: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    driver: { type: String, required: true },
  },
  { timestamps: true }
);

const Automobile = model('Automobile', AutomobileSchema);

module.exports = Automobile;
