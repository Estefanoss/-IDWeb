const cursos = require('../data/cursosData');

exports.getAllCursos = (req, res, next) => {
  try {
    let resultado = [...cursos];

    if (req.query.creditos) {
      const creditosNum = parseInt(req.query.creditos, 10);
      resultado = resultado.filter(curso => curso.creditos === creditosNum);
    }

    res.status(200).json({
      status: 'success',
      total: resultado.length,
      data: resultado
    });
  } catch (error) {
    next(error); 
  }     
};

exports.getCursoById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const curso = cursos.find(c => c.id === id);

    if (!curso) {
      return res.status(404).json({
        status: 'fail',
        message: `Curso con ID ${id} no encontrado`
      });
    }

    res.status(200).json({
      status: 'success',
      data: curso
    });
  } catch (error) {
    next(error);
  }
};

exports.createCurso = (req, res, next) => {
  try {
    const { nombre, codigo, creditos } = req.body;

    if (!nombre || !codigo || creditos === undefined) {
      return res.status(400).json({
        status: 'fail',
        message: 'Campos obligatorios faltantes: nombre, codigo y creditos son requeridos'
      });
    }

    const nuevoId = cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1;
    const nuevoCurso = {
      id: nuevoId,
      nombre,
      codigo,
      creditos: parseInt(creditos, 10)
    };

    cursos.push(nuevoCurso);

    res.status(201).json({
      status: 'success',
      data: nuevoCurso
    });
  } catch (error) {
      next(error);
    }
  };
  
  exports.updateCurso = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = cursos.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({
        status: 'fail',
        message: `No se encontró el curso con ID ${id} para actualizar`
      });
    }

    const { nombre, codigo, creditos } = req.body;

    if (nombre !== undefined) cursos[index].nombre = nombre;
    if (codigo !== undefined) cursos[index].codigo = codigo;
    if (creditos !== undefined) cursos[index].creditos = parseInt(creditos, 10);

    res.status(200).json({
      status: 'success',
      data: cursos[index]
    });
  } catch (error) {
      next(error);
    }
  };

exports.deleteCurso = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const index = cursos.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({
        status: 'fail',
        message: `No se encontró el curso con ID ${id} para eliminar`
      });
    }

    const cursoEliminado = cursos.splice(index, 1)[0];

    res.status(200).json({
      status: 'success',
      message: `El curso '${cursoEliminado.nombre}' con ID ${id} fue eliminado correctamente`
    });
  } catch (error) {
      next(error);
    }
  };
