const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/music', require('./music'));

module.exports = router;