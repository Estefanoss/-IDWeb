const express = require('express');
const cursosRoutes = require('./routes/cursosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());