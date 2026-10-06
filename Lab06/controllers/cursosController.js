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