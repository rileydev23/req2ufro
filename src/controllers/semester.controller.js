import Semester from '../schemas/semester.schema.js';

export const createSemester = async (req, res) => {
  try {
    const { name, year, startDate, endDate, subjects, users, owner } = req.body;
    const nuevoSemestre = new Semester({
      name,
      year,
      startDate,
      endDate,
      subjects,
      users,
      owner,
    });

    const savedSemester = await nuevoSemestre.save();
    res.status(201).json({ message: 'Semestre creado exitosamente', semestre: savedSemester });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el semestre', details: error.message });
  }
};

export const getAllSemesters = async (req, res) => {
  try {
    const semestres = await Semester.find();
    res.status(200).json(semestres);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los semestres', details: error.message });
  }
};

export const getSemester = async (req, res) => {
  const { id } = req.params;

  try {
    const semestre = await Semester.findById(id);
    if (!semestre) {
      return res.status(404).json({ message: 'Semestre no encontrado' });
    }
    res.status(200).json(semestre);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el semestre', details: error.message });
  }
};

export const editSemester = async (req, res) => {
  const { id } = req.params;
  const { name, year, startDate, endDate, subjects, users } = req.body;

  try {
    const semestre = await Semester.findByIdAndUpdate(
      id,
      { name, year, startDate, endDate, subjects, users },
      { new: true, runValidators: true }
    );

    if (!semestre) {
      return res.status(404).json({ message: 'Semestre no encontrado' });
    }
    res.status(200).json({ message: 'Semestre actualizado', semestre });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el semestre', details: error.message });
  }
};

export const deleteSemester = async (req, res) => {
  const { id } = req.params;

  try {
    const semestre = await Semester.findByIdAndDelete(id);
    if (!semestre) {
      return res.status(404).json({ message: 'Semestre no encontrado' });
    }
    res.status(200).json({ message: 'Semestre eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el semestre', details: error.message });
  }
};
