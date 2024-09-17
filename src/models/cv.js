const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: { type: [String], required: true },
  experience: { type: String, required: true },
  pdf: { type: Buffer } // Campo para almacenar el PDF
});

const CV = mongoose.model('CV', cvSchema);

module.exports = CV;