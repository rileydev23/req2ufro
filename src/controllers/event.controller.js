import Event from "../schemas/event.schema.js";

// Crear un nuevo Event
export const createEvent = async (req, res) => {
  try {
    const { title, type, date, grade, weight } = req.body;
    const newEvent = new Event({ title, type, date, grade, weight });
    const savedEvent = await newEvent.save();
    res.status(201).json({
      message: "Evento creado exitosamente",
      event: savedEvent,
    });
  } catch (error) {
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