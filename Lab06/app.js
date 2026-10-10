const express = require('express');
const cursosRoutes = require('./routes/cursosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  const inicio = Date.now();

  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`[${new Date().toISOString()}] ${req.method} en ${req.url} - Estado: ${res.statusCode} (${duracion}ms)`);
  });

  next();
});

app.use('/api/cursos', cursosRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `La ruta '${req.originalUrl}' no existe en el servidor`
  });
});

app.use((err, req, res, next) => {
  console.error('Error capturado:', err.stack);

  res.status(500).json({
    status: 'error',
    message: 'Ocurrió un error interno en el servidor',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});