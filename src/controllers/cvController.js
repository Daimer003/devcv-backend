const CV = require('../models/cv');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Función para crear un CV
const createCV = async (req, res) => {
  try {
    const { name, email, skills, experience } = req.body;

    // Ruta donde guardaremos el archivo PDF
    const dirPath = path.join(__dirname, '../file');
    
    // Verificar si la carpeta existe, si no, crearla
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const pdfPath = path.join(dirPath, `${name}_CV.pdf`);
    
    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Crear un flujo de escritura a un archivo
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);
    
    // Título
    doc.fontSize(20).text('Curriculum Vitae', { align: 'center' });
    
    // Nombre y Email
    doc.fontSize(16).text(`Nombre: ${name}`, { align: 'left' });
    doc.text(`Email: ${email}`);
    
    // Experiencia
    doc.text('Experiencia:', { underline: true });
    doc.fontSize(12).text(experience);
    
    // Finalizar la escritura del documento
    doc.end();

    // Escuchar cuando se finalice la escritura del documento
    writeStream.on('finish', function () {
      res.download(pdfPath, `${name}_CV.pdf`, (err) => {
        if (err) {
          return res.status(500).send('Error al descargar el archivo');
        }
        fs.unlinkSync(pdfPath); // Eliminar el archivo del servidor después de enviarlo
      });
    });

    // Guardar el CV en la base de datos
    const newCV = new CV({ name, email, skills, experience });
    await newCV.save();

  } catch (err) {
    // Solo enviar la respuesta si no se ha enviado antes
    if (!res.headersSent) {
      res.status(400).json({ message: 'Error al crear CV', error: err.message });
    }
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

// Exportar las funciones del controlador
module.exports = {
  createCV,
  getAllCVs
};