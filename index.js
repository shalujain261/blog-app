const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');

const app = express();
const port = 8000;

mongoose.connect('mongodb+srv://jshalu142_db_user:qpdgq0yL5BcojBhM@cluster0.yvx58xi.mongodb.net/?appName=Cluster0').then(() => {
  console.log('Database is connected');
}).catch(err => {
  console.error('Database connection error:', err);
})

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))

app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
