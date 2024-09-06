

const createCV = (req, res) => {
    const cvData = req.body;
    // Lógica para generar el CV
    res.status(201).json({ message: 'CV generado exitosamente', cv: cvData });
 };
 
 module.exports = { createCV };
 