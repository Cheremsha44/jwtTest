const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mainController = require('../controllers/mainController');

const users = [];

const authRouter = express.Router();

authRouter.get('/auth', mainController.home);

authRouter.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (users.find((u) => u.username === username)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

authRouter.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json({ message: 'Protected data', user: decoded });
  });
});

module.exports = authRouter;
