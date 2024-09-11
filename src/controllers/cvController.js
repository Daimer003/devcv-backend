const express = require('express');
const CV = require('../models/cv');
const router = express.Router();

// Función para crear un CV
const createCV = async (req, res) => {
    const { name, email, skills, experience } = req.body;
  
    try {
      const newCV = new CV({ name, email, skills, experience });
      await newCV.save();
      res.status(201).json(newCV);
    } catch (err) {
      res.status(400).json({ message: 'Error al crear CV', error: err.message });
    }
};

// Función para obtener todos los CVs
const getAllCVs = (req, res) => {
    // Aquí va la lógica para obtener todos los CVs
    res.status(200).json({ message: 'Lista de CVs' });
};

// Exportar las funciones del controlador
module.exports = {
    createCV,
    getAllCVs
};
 