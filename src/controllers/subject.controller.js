import Subject from "../schemas/subject.schema.js";

// Crear un nuevo Subject
export const createSubject = async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    await newSubject.save();
    res.status(201).json({
      message: "Asignatura creada exitosamente",
      subject: newSubject,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la asignatura" });
  }
};

// Obtener Subject por ID
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la asignatura" });
  }
};

// Obtener todos los Subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las asignaturas" });
  }
};

// Actualizar Subject por ID
export const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSubject) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }
    res.status(200).json({
      message: "Asignatura actualizada",
      subject: updatedSubject,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la asignatura" });
  }
};

// Eliminar Subject por ID
export const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }
    res.status(200).json({ message: "Asignatura eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la asignatura" });
  }
};

// Agregar un evento al Subject
export const addEventToSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }
    subject.events.push(req.body.event);
    await subject.save();
    res.status(200).json({
      message: "Evento añadido",
      subject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al añadir el evento a la asignatura" });
  }
};
// Calcular el promedio del Subject
export const calculateSubjectAverage = async (subject, res) => {
  try {
    if (!subject) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }
    const average = subject.calculateAverage();
    res.status(200).json({
      message: "Promedio calculado",
      average,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al calcular el promedio de la asignatura" });
  }
};
