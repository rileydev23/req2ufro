import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token") || req.headers["authorization"];
  console.log(token, req.headers);
  if (!token) return res.status(401).json({ error: "Acceso denegado" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "token no es válido" });
  }
};

const verifyAdminToken = (req, res, next) => {
  const token = req.header("auth-token") || req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Acceso denegado" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verified.roles.includes("ROLE_ADMIN")) {
      return res.status(401).json({ error: "Acceso denegado" });
    }
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "token no es válido" });
  }
};

export { verifyToken, verifyAdminToken };
