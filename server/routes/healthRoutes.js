const express = require('express');
const { getHealth } = require('../controllers/healthControllers');

const router = express.Router();

router.get('/', getHealth);

module.exports = router;
