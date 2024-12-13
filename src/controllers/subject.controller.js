import Subject from "../schemas/subject.schema.js";
import Event from "../schemas/event.schema.js";
import Semester from "../schemas/semester.schema.js";

// Crear un nuevo Subject
export const createSubject = async (req, res) => {
  try {
    const semesterId = req.params.semesterId;

    // if code exists in the semester, return error
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      return res.status(404).json({ message: "Semestre no encontrado" });
    }

    const subjectExists = await Subject.findOne({
      code: req.body.code.toUpperCase(),
    });
    if (subjectExists) {
      return res.status(400).json({ message: "Asignatura ya existe" });
    }

    const newSubject = new Subject({
      name: req.body.name.toUpperCase(),
      code: req.body.code.toUpperCase(),
    });
    const savedSubject = await newSubject.save();

    const updatedSemester = await Semester.findByIdAndUpdate(
      semesterId,
      { $push: { subjects: savedSubject._id } },
      { new: true }
    );

    if (!updatedSemester) {
      return res.status(404).json({ message: "Semestre no encontrado" });
    }

    res.status(201).json({
      message: "Asignatura creada exitosamente",
      subject: savedSubject,
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
    const { id, semesterId } = req.params;

    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    // Actualizar el Semester eliminando la referencia al Subject
    const updatedSemester = await Semester.findByIdAndUpdate(
      semesterId,
      { $pull: { subjects: id } }, // Remueve el ID del subject eliminado del array de subjects
      { new: true }
    );

    if (!updatedSemester) {
      return res.status(404).json({ message: "Semestre no encontrado" });
    }

    res.status(200).json({
      message: "Asignatura eliminada y actualizada en el semestre",
      semester: updatedSemester,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar la asignatura o actualizar el semestre",
    });
  }
};

// Agregar un evento al Subject
export const addEventToSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $push: { events: req.body.event } },
      { new: true }
    );

    const updatedEvent = await Event.findByIdAndUpdate(
      req.body.event,
      { subject: req.params.id },
      { new: true }
    );

    if (!updatedSubject || !updatedEvent) {
      return res
        .status(404)
        .json({ message: "Asignatura o evento no encontrado" });
    }

    res.status(200).json({
      message: "Evento añadido",
      subject: updatedSubject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al añadir el evento a la asignatura" });
  }
};

// Calcular el promedio del Subject
export const calculateSubjectAverage = async (req, res) => {
  try {
    const id = req.params.id;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    const events = await Event.find({
      _id: { $in: subject.events },
      type: "evaluado",
      grade: { $exists: true },
    });

    const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
    const average =
      totalWeight > 0
        ? events.reduce(
            (sum, event) => sum + (event.grade * event.weight) / 100,
            0
          )
        : 0;

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

export const getEventsFromSubject = async (req, res) => {
  try {
    const userId = "672e6fdd0a50f8ecd0e22a50";
    const subject = await Subject.findById(req.params.id).populate("events");
    if (!subject) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    const events = await Event.find({ _id: { $in: subject.events } });

    const eventsWithUserGrades = events.map((event) => {
      // Find the grade object for the specific user
      const userGrade = event.grades.find(
        (grade) => grade.user.toString() === userId
      );

      // Return the event details with the grade
      return {
        _id: event._id,
        title: event.title,
        date: event.date,
        type: event.type,
        weight: event.weight,
        grade: userGrade ? userGrade.grade : null, // Include grade if available, else null
      };
    });

    res.status(200).json({
      events: eventsWithUserGrades,
      subject: {
        _id: subject._id,
        name: subject.name,
        code: subject.code,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los eventos de la asignatura" });
  }
};
