const CV = require('../models/cv');
const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');
const { Readable } = require('stream');
// Función para crear un CV
const createCV = async (req, res) => {
  try {
    const { name, email, skills, experience } = req.body;

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Usar un stream de memoria para capturar el PDF en un buffer
    let buffers = [];
    const stream = new Readable({
      read() {}
    });

    // Cuando el PDF es escrito, lo añadimos al array de buffers
    doc.on('data', (chunk) => buffers.push(chunk));

    // Cuando el PDF termina, lo convertimos a buffer y guardamos
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Crear el nuevo CV con el PDF en formato buffer
      const newCV = new CV({
        name,
        email,
        skills,
        experience,
        pdf: pdfBuffer // Guardar el PDF como buffer
      });

      // Guardar el CV en la base de datos
      await newCV.save();

      // Responder con éxito y la URL para descargar el PDF
      res.status(201).json({ message: 'CV creado y PDF guardado', downloadUrl: `/download/${name}` });
    });

    // Añadir contenido al PDF
    doc.fontSize(20).text('Curriculum Vitae', { align: 'center' });
    doc.fontSize(16).text(`Nombre: ${name}`, { align: 'left' });
    doc.text(`Email: ${email}`);
    doc.text('Experiencia:', { underline: true });
    doc.fontSize(12).text(experience);

    // Finalizar el documento PDF
    doc.end();
  } catch (err) {
    res.status(400).json({ message: 'Error al crear el CV', error: err.message });
  }
};
// Función para obtener todos los CVs
const getAllCVs = async (req, res) => {
  try {
    const cvs = await CV.find(); // Obtiene todos los documentos de la colección 'cvs'
    res.status(200).json(cvs); // Devuelve los CV en formato JSON
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los CV', error: error.message });
  }
};

// Ruta para descargar el PDF
const downloadPDF = async (req, res) => {
  try {
    const { name } = req.params; // Obtener el nombre del CV de los parámetros de la URL
    const cv = await CV.findOne({ name }); // Buscar el CV en la base de datos por nombre

    if (!cv || !cv.pdf) {
      return res.status(404).json({ message: 'CV o PDF no encontrado' });
    }

    // Configurar los encabezados para la descarga del PDF
    res.setHeader('Content-Disposition', `attachment; filename=${name}_CV.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Enviar el buffer PDF como respuesta
    res.send(cv.pdf);

  } catch (error) {
    res.status(500).json({ message: 'Error al descargar el PDF', error: error.message });
  }
};

// Exportar las funciones del controlador
module.exports = {
  createCV,
  getAllCVs,
  downloadPDF 
};