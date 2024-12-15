import { sendNotification } from "../google.js";
import Event from "../schemas/event.schema.js";
import User from "../schemas/user.schema.js";
import Subject from "../schemas/subject.schema.js";
// Crear un nuevo Event
export const createEvent = async (req, res) => {
  try {
    const { title, type, date, weight } = req.body;

    const newEvent = new Event({ title, type, date, weight });
    const savedEvent = await newEvent.save();
    res.status(201).json({
      message: "Evento creado exitosamente",
      event: savedEvent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el evento" });
  }
};

// Obtener Event por ID
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el evento" });
  }
};

// Obtener todos los Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los eventos" });
  }
};

// Actualizar Event por ID
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, type, date, grade, weight } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, type, date, grade, weight },
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Evento actualizado", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el evento" });
  }
};

// Eliminar Event por ID
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json({ message: "Evento eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el evento" });
  }
};

export const isEvaluatedEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const isEvaluated = event.type === "evaluado";
    res.status(200).json({
      message: "Evaluación del tipo de evento",
      isEvaluated,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al verificar el tipo de evento" });
  }
};

export const addGradeToEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, grade } = req.body;
    const event = await Event.findById(id);
    const subject = await Subject.findById(event.subject);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const user = event.grades.find((grade) => grade.user == userId);

    if (user) {
      return res
        .status(400)
        .json({ message: "Usuario ya tiene nota asignada" });
    }

    const notification = await User.findById(userId, { notificationToken: 1 });

    if (!notification) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    event.grades.push({ user: userId, grade });

    await event.save();

    if (notification.notificationToken) {
      await sendNotification(
        notification.notificationToken,
        `Se ha actualizado ${subject.code} - ${subject.name}`,
        `Las notas de la evaluación ${event.title} han sido publicadas.`,
        { url: `/(modals)/details/${subject._id}` }
      );
    }

    res.status(200).json({
      message: "Nota agregada al evento",
      event,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar la nota al evento" });
  }
};

export const addGradeMasiveToEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { grades } = req.body;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    grades.forEach((grade) => {
      const user = event.grades.find((g) => g.user == grade.user);
      if (user) {
        return res
          .status(400)
          .json({ message: "Usuario ya tiene nota asignada" });
      }
      event.grades.push(grade);
    });

    await event.save();

    res.status(200).json({
      message: "Notas agregadas al evento",
      event,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar las notas al evento" });
  }
};
