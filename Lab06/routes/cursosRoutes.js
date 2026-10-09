const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');

router.route('/')
  .get(cursosController.getAllCursos)
  .post(cursosController.createCurso);

router.route('/:id')
  .get(cursosController.getCursoById)
  .put(cursosController.updateCurso)
  .delete(cursosController.deleteCurso);

module.exports = router;