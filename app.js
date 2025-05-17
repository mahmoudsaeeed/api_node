// app.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user_routes/user_routes');
const productRoutes = require('./routes/product_routes/product_routes');
const dotenv = require('dotenv').config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_DB,
  {
    user: process.env.USER_DB,
    pass: process.env.PASS_DB,
    dbName:process.env.DB_NAME,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB error:', err));

app.use('/api/',userRoutes);
app.use('/api/',productRoutes);

app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port http://localhost:3000/api/');
});
