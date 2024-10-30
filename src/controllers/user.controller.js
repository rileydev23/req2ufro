import User from "../schemas/user.schema.js";

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

// Agregar un semestre a un usuario
export const addSemesterToUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { semesters: req.body.semesterId } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Semestre añadido", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error al añadir el semestre" });
  }
};

// Eliminar un semestre de un usuario
export const removeSemesterFromUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { semesters: req.body.semesterId } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
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

    res.status(200).json(user.semesters);
  } catch (error) {
    console.error("Error en getUserSemesters:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los semestres del usuario" });
  }
};
