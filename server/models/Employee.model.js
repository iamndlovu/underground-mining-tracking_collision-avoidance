const { Schema, model } = require('mongoose');

const EmployeeSchema = new Schema(
  {
    fullName: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
  },
  { timestamps: true }
);

const Employee = model('Employee', EmployeeSchema);

module.exports = Employee;
