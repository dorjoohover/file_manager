import fs from "fs";
import path from "path";
import { config } from "../config.js";
const { BASE_PATH: PATH } = config;
const BASE_PATH = PATH + "test";
// ----------------------------
// List files
// ----------------------------
export const listView = (req, res) => {
  if (!fs.existsSync(BASE_PATH)) fs.mkdirSync(BASE_PATH, { recursive: true });

  const files = fs.readdirSync(BASE_PATH).map((f) => {
    const stat = fs.statSync(path.join(BASE_PATH, f));
    return {
      name: f,
      isDir: stat.isDirectory(),
      size: stat.size,
      mtime: stat.mtime,
    };
  });
  res.render("panel", { files });
};
export const listUploads = (req, res) => {
  // uploads folder байгаа эсэхийг шалгах
  if (!fs.existsSync(BASE_PATH)) fs.mkdirSync(BASE_PATH, { recursive: true });

  const files = fs.readdirSync(BASE_PATH).map((f) => {
    const stat = fs.statSync(path.join(BASE_PATH, f));
    return {
      name: f,
      isDir: stat.isDirectory(),
      size: stat.size,
      mtime: stat.mtime,
    };
  });

  // JSON response
  res.json(files.map((f) => f.name)); // front-end-д зөвхөн нэрс явуулна
};
// ----------------------------
// Upload
// ----------------------------
export const upload = (req, res) => {
  if (!req.files || !req.files.file)
    return res.status(400).send("No file uploaded");
  const file = req.files.file;
  const uploadPath = path.join(BASE_PATH, file.name);

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err.message);
    res.redirect("http://localhost:5000/");
  });
};

// ----------------------------
// Delete
// ----------------------------
export const deleteFile = (req, res) => {
  const { name } = req.body;
  const filePath = path.join(BASE_PATH, name);
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  fs.rmSync(filePath, { recursive: true, force: true });
  res.redirect("http://localhost:5000/");
};

// ----------------------------
// Rename
// ----------------------------
export const rename = (req, res) => {
  const { oldName, newName } = req.body;
  const oldPath = path.join(BASE_PATH, oldName);
  const newPath = path.join(BASE_PATH, newName);

  if (!fs.existsSync(oldPath)) return res.status(404).send("File not found");

  fs.renameSync(oldPath, newPath);
  res.redirect("http://localhost:5000/");
};

// ----------------------------
// Download
// ----------------------------
export const download = (req, res) => {
  const { file } = req.query;
  const filePath = path.join(BASE_PATH, file);

  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
  res.download(filePath);
};
