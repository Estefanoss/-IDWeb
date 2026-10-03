// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const { method, url } = req;

  console.log(`Petición recibida: ${method} ${url}`);

  if (url === '/api/estudiantes' && method === 'GET') {
    const dataPath = path.join(__dirname, 'data', 'estudiantes.json');
    fs.readFile(dataPath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error al leer la base de datos local' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(content);
    });
  } else if (url === '/' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      }
    });
  } else if (url === '/api/status' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', uptime: process.uptime() }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});