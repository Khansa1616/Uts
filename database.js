const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Ganti dengan username MySQL Anda
  password: "", // Ganti dengan password MySQL Anda
  database: "sekolahku",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected!");
});

module.exports = db;
