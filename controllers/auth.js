import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
const { JWT_SECRET, ADMIN_USER, ADMIN_PASS } = config;

export const loginView = async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USER)
    return res.render("login", { error: "Invalid username" });
  const ok = await bcrypt.compare(password, ADMIN_PASS);
  if (!ok) return res.render("login", { error: "Wrong password" });

  const token = jwt.sign({ user: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
};
