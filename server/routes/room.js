const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Room = require('../models/room');

router.post('/create', async (req, res) => {
  try {
    const { title, key, bgColor } = req.body;

    const hashedkey = await bcrypt.hash(key, 10);

    const newRoom = await Room.create({ title, key: hashedkey, bgColor });

    res.status(201).json({ message: 'Room created successfully', room: newRoom });
  } catch (error) {
    console.error('Error creating room:', error.message);
    console.error(error);

    res.status(400).json({ error: error.message });
  }
});

module.exports = router;