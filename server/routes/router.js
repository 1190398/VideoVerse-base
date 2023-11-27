const express = require('express');
const router = express.Router();

// include routes
const userRoutes = require('../routes/user')
router.use('/users', userRoutes)

module.exports = router