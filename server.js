import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";

import * as auth from "./controllers/auth.js";
import * as files from "./controllers/files.js";
import * as logs from "./controllers/logs.js";
import jwt from "jsonwebtoken";
const app = express();
app.use("/", express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());

// Brute force protection
app.use("/login", rateLimit({ windowMs: 60000, max: 5 }));

// JWT middleware
app.use((req, res, next) => {
  if (req.path === "/login" || req.path === "/login-submit") return next();
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  if (!token) return res.redirect("/login");

  try {
    jwt.verify(token, "super-secret-key-123");
    next();
  } catch (err) {
    return res.redirect("/login");
  }
});

// Routes
app.get("/login", (req, res) => res.render("login", { error: null }));
app.post("/login-submit", auth.loginView);

app.get("/", files.listView);
app.get("/log", logs.show);
app.get("/uploads", files.listUploads);
// API routes
app.post("/upload", files.upload);

app.post("/delete", files.deleteFile);
app.post("/rename", files.rename);
app.get("/download", files.download);

app.listen(5000, () => console.log("Server running on 5000"));
