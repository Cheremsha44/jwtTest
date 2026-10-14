require('dotenv').config();

const path = require('node:path');
const express = require('express');

const router = require('./routes/router');
const authRouter = require('./routes/auth');

const PORT = process.env.PORT || 3000;
const app = express();

// 1. Setting EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static files (css, js, images)
app.use(express.static(path.join(__dirname, 'public')));

// 4. Routes
app.use('/auth', authRouter);
app.use('/', router);

// 5. Error handling middleware
app.use((req, res) => {
  res.status(404).render('404', { title: 'Something went wrong' });
});

// 6. Start the server
const server = app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error.message);
});
