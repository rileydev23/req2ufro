import User from "../schemas/user.schema.js";
import Semester from "../schemas/semester.schema.js";
import { sendNotification } from "../google.js";
import { regenerateToken } from "./auth.controller.js";
import { populate } from "dotenv";

// Registrar un nuevo usuario con Google OAuth
export const registerUser = async (req, res) => {
  try {
    const { googleId, email, name, avatarUrl } = req.body;
    const newUser = new User({ googleId, email, name, avatarUrl });
    await newUser.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// Iniciar sesión con Google OAuth
export const loginUser = async (req, res) => {
  try {
    const { googleId } = req.body;
    const user = await User.findOne({ googleId });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Inicio de sesión exitoso", user });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};
// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener todos los usuarios" });
  }
};

// Actualizar usuario por ID
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

// Eliminar usuario por ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

// Agregar un semestre a un usuario y el usuario al semestre
export const addSemesterToUser = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario
    const { semesterId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $addToSet: { semesters: semesterId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await Semester.findByIdAndUpdate(
      semesterId,
      { $addToSet: { users: id } },
      { new: true }
    );

    res.status(200).json({ message: "Semestre añadido", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error al añadir el semestre" });
  }
};

// Eliminar un semestre de un usuario y el usuario del semestre
export const removeSemesterFromUser = async (req, res) => {
  try {
    const { id, semesterId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $pull: { semesters: semesterId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await Semester.findByIdAndUpdate(
      semesterId,
      { $pull: { users: id } },
      { new: true }
    );

    res.status(200).json({ message: "Semestre eliminado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el semestre" });
  }
};

// Asignar un rol a un usuario
export const assignRoleToUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Rol asignado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error al asignar el rol" });
  }
};

// Obtener los semestres de un usuario
export const getUserSemesters = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // remove users, owner from semester
    const semesters = await Semester.find({
      _id: { $in: user.semesters },
    })
      .select("-users -owner -__v")
      .populate("subjects", "-semester -__v");

    // add current week for each semester calculated from startDate
    const updatedSemesters = semesters.map((semester) => {
      const currentWeek = Math.ceil(
        (Date.now() - new Date(semester.startDate)) / (1000 * 60 * 60 * 24 * 7)
      );
      return { ...semester._doc, currentWeek };
    });

    res.status(200).json(updatedSemesters);
  } catch (error) {
    console.error("Error en getUserSemesters:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los semestres del usuario" });
  }
};

export const updateNotificationToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { notificationToken } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { notificationToken },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    regenerateToken(id)
      .then((token) => {
        console.log("Token de notificación actualizado", token);
        res.status(200).json({
          token,
          message: "Token de notificación actualizado",
        });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ error: "Error al actualizar el token de notificación" });
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el token de notificación" });
  }
};

export const sendTestNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const { notificationToken } = user;
    console.log("notificationToken:", notificationToken);
    if (!notificationToken) {
      return res
        .status(404)
        .json({ message: "Token de notificación no encontrado" });
    }

    await sendNotification(
      notificationToken,
      "PEDRO GAETE ha actualizado ICC203 - INTRODUCCION A LA INGENIERA",
      "Las notas de la evaluación EV1 - MATRICES han sido publicadas"
    );

    res.status(200).json({ message: "Notificación de prueba enviada" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al enviar la notificación de prueba" });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: "semesters",
      populate: { path: "subjects", populate: { path: "events" } },
    });

    console.log("user:", user);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let events = [];

    user.semesters.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        subject.events.forEach((event) => {
          events.push({
            event: {
              id: event._id,
              title: event.title,
              date: event.date,
              time: formatEventDateManual(event.date),
              type: event.type,
            },
            subject: {
              id: subject._id,
              name: subject.name,
              code: subject.code,
            },
          });
        });
      });
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los eventos del usuario" });
  }
};

const formatEventDateManual = (date) => {
  const dateObj = new Date(date);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    hour: `${hours}:${minutes}`,
  };
};
