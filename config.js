export const config = {
  JWT_SECRET: "super-secret-key-123", // сольж болно
  ADMIN_USER: "admin",
  ADMIN_PASS: "$2b$10$QgcYxPfJ3Z4zqAWtWkLujeQQnes9o4jgv1qFnWDjk7oRJGVZjAjBa",
  // password = admin123 (hashed)

  BASE_PATH: "/var/backups/", // эндээс файлуудыг удирдана
  // BASE_PATH: "D:/projects/training/default/secure-file-manager/",
  LOG_PATH: "/root/file_manager/logs",
  // LOG_PATH: "D:/projects/training/default/secure-file-manager/logs",
};
//  {
//   JWT_SECRET: "super-secret-key-123", // сольж болно
//   ADMIN_USER: "02220110",
//   ADMIN_PASS: "$2b$04$70tbtrilIPJyZyEJEQMUk.dG92HjXm9FhMRTP72AZeRRhtblzLAAK",
//   // password = admin123 (hashed)

//   BASE_PATH: "/var/www", // эндээс файлуудыг удирдана
//   LOG_PATH: "/var/log",
// };

// insert into users(id, firstname, lastname, role, mobile, password, status, merchant_id, user_status, nickname)
// values(1, 'dorjoo', 'dorjoo', 10, '02220110', '$2b$04$70tbtrilIPJyZyEJEQMUk.dG92HjXm9FhMRTP72AZeRRhtblzLAAK', 10, '3f86c0b23a5a4ef89a745269e7849640', 10, 'dorj')
