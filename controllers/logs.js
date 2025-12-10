import * as fs from "fs";
import * as path from "path";
import { config } from "../config.js";
const { LOG_PATH } = config;
export const show = (req, res) => {
  const file = req.query.file || "syslog";
  const full = path.join(LOG_PATH, file);

  if (!fs.existsSync(full)) return res.status(404).send("Not found");

  const content = fs.readFileSync(full, "utf8");
  res.type("text/plain").send(content);
};
