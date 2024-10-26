import Semester from '../schemas/semester.schema.js';

export const createSemester = async (req, res) => {
  try {
    const { name, year, subjects } = req.body; // Desestructuramos los campos del cuerpo de la solicitud
    const nuevoSemestre = new Semester({ name, year, subjects });
    const savedSemester = await nuevoSemestre.save();
    res.status(201).json({ message: 'Semestre creado exitosamente', semestre: savedSemester });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el semestre' });
  }
};

export const getAllSemesters = async (req, res) => {
  try {
    const semestres = await Semester.find();
    res.json(semestres);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los semestres' });
  }
};

export const getSemester = async (req, res) => {
  const { id } = req.params;

  try {
    const semestre = await Semester.findById(id);
    if (!semestre) {
      return res.status(404).json({ message: 'Semestre no encontrado' });
    }
    res.json(semestre);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el semestre' });
  }
};

export const editSemester = async (req, res) => {
  const { id } = req.params; 
  const { name, year, subjects } = req.body; 

  try {
    const semestre = await Semester.findByIdAndUpdate(
      id, 
      { name, year, subjects },
      { new: true, runValidators: true }
    );
    if (!semestre) {
      return res.status(404).json({ message: 'Semestre no encontrado' });
    }
    res.json({ message: 'Semestre actualizado', semestre });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el semestre' });
  }
};

export const deleteSemester = async (req, res) => {
  const { id } = req.params;

  try {
    const semestre = await Semester.findByIdAndDelete(id);
    if (!semestre) {
      return res.status(404).json({ message: 'Semestre no encontrado' });
    }
    res.json({ message: 'Semestre eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el semestre' });
  }
};


