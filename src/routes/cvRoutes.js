const express = require('express');
const cvController = require('../controllers/cvController');
const router = express.Router();

router.post('/create', cvController.createCV);
router.get('/all', cvController.getAllCVs);

module.exports = router;
