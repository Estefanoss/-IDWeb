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

  // Ruta get
  if (url === '/api/estudiantes' && method === 'GET') {
    const dataPath = path.join(__dirname, 'data', 'estudiantes.json');
    fs.readFile(dataPath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Error al leer la base de datos local' }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(content);
    });

  // Ruta post
  } else if (url === '/api/estudiantes' && method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const nuevoEstudiante = JSON.parse(body);
        const dataPath = path.join(__dirname, 'data', 'estudiantes.json');

        fs.readFile(dataPath, 'utf8', (err, content) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Error al leer la base de datos' }));
          }

          const estudiantes = JSON.parse(content);
          
          // Asignación de ID autoincremental
          nuevoEstudiante.id = estudiantes.length > 0 ? estudiantes[estudiantes.length - 1].id + 1 : 1;
          estudiantes.push(nuevoEstudiante);

          fs.writeFile(dataPath, JSON.stringify(estudiantes, null, 2), (errWrite) => {
            if (errWrite) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Error al escribir el registro' }));
            }

            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(nuevoEstudiante));
          });
        });

      } catch (parseErr) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Formato JSON no válido en el cuerpo de la solicitud' }));
      }
    });

  // Servidor de archivos estticos
  } else if (method === 'GET') {
    let relativeFilePath = url === '/' ? 'index.html' : url;
    
    if (relativeFilePath.startsWith('/public/')) {
      relativeFilePath = relativeFilePath.replace('/public/', '');
    }

    const safeFilePath = path.join(__dirname, 'public', relativeFilePath);
    const extname = String(path.extname(safeFilePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(safeFilePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno al leer el archivo');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });

  // Manejo de rutas
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});