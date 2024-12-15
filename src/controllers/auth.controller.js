import User from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/environment.js";
import bcrypt from "bcrypt";

export async function postLogin(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  const validPassword = comparePassword(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "contraseña no válida" });

  const token = generateToken(user);

  res.json({
    error: null,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        created_at: user.createdAt,
      },
      token,
    },
  });
}

export async function postRegister(req, res) {
  const user = new User(req.body);
  user.password = hsahPassword(user.password);
  await user.save();

  const token = generateToken(user);

  res.json({
    error: null,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        created_at: user.createdAt,
      },
      token,
    },
  });
}

export async function regenerateToken(id) {
  const user = await User.findById(id);
  const token = generateToken(user);

  return token;
}

function generateToken(user) {
  return jwt.sign(
    {
      name: user.email,
      id: user._id,
      role: user.role,
      hasNotificationToken: !!user.notificationToken,
    },
    TOKEN_SECRET
  );
}

export function hsahPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
