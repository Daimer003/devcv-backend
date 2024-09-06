const express = require('express');
const { createCV } = require('../controllers/cvController');
const router = express.Router();

router.post('/create', createCV);

module.exports = router;
