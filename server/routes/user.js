const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, password: hashedPassword, name });

    const token = await newUser.generateAuthToken();

    res.status(201).json({ success: true, data: { user: newUser, token } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/login', async function (req, res) {
  try {
    const user = await User.findByCredentials(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).json({ success: true, data: { user, token } });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    res.status(200).json({ success: true, data: { user: req.user } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    const user = req.user;
    user.token = null;
    await user.save();
    res.status(200).json({ success: true, message: 'Logout done' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error logging out' });
  }
});

module.exports = router;
