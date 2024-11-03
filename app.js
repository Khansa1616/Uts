const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./database");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Halaman Landing
app.get("/", (req, res) => {
  res.render("landing");
});

// Halaman Login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (results.length > 0) {
        req.session.user = results[0];
        res.redirect("/profile");
      } else {
        res.send("Username atau password salah");
      }
    }
  );
});

// Halaman Register
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role],
    (err) => {
      if (err) throw err;
      res.redirect("/login");
    }
  );
});

// Halaman Profile
app.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("profile", { user: req.session.user });
});

// CRUD Guru
app.get("/crud-guru", (req, res) => {
  db.query("SELECT * FROM guru", (err, results) => {
    res.render("crud_guru", { gurus: results });
  });
});

// CRUD Murid

// Menampilkan daftar Murid
app.get("/crud-murid", (req, res) => {
  db.query("SELECT * FROM murid", (err, results) => {
    res.render("crud_murid", { murids: results });
  });
});

// Menambah Murid
app.post("/add-murid", (req, res) => {
  const { nama, kelas } = req.body;
  db.query(
    "INSERT INTO murid (nama, kelas) VALUES (?, ?)",
    [nama, kelas],
    (err) => {
      if (err) throw err;
      res.redirect("/crud-murid");
    }
  );
});

// Mengedit Murid
app.get("/edit-murid/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM murid WHERE id = ?", [id], (err, results) => {
    res.render("edit_murid", { murid: results[0] });
  });
});

app.post("/edit-murid/:id", (req, res) => {
  const { id } = req.params;
  const { nama, kelas } = req.body;
  db.query(
    "UPDATE murid SET nama = ?, kelas = ? WHERE id = ?",
    [nama, kelas, id],
    (err) => {
      if (err) throw err;
      res.redirect("/crud-murid");
    }
  );
});

// Menghapus Murid
app.get("/delete-murid/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM murid WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/crud-murid");
  });
});

// CRUD Mata Pelajaran
app.get("/crud-mata-pelajaran", (req, res) => {
  db.query("SELECT * FROM mata_pelajaran", (err, results) => {
    res.render("crud_mata_pelajaran", { pelajaran: results });
  });
});

// CRUD Mata Pelajaran

// Menampilkan daftar Mata Pelajaran
app.get("/crud-mata-pelajaran", (req, res) => {
  db.query("SELECT * FROM mata_pelajaran", (err, results) => {
    res.render("crud_mata_pelajaran", { pelajaran: results });
  });
});

// Menambah Mata Pelajaran
app.post("/add-mata-pelajaran", (req, res) => {
  const { nama } = req.body;
  db.query("INSERT INTO mata_pelajaran (nama) VALUES (?)", [nama], (err) => {
    if (err) throw err;
    res.redirect("/crud-mata-pelajaran");
  });
});

// Mengedit Mata Pelajaran
app.get("/edit-mata-pelajaran/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM mata_pelajaran WHERE id = ?",
    [id],
    (err, results) => {
      res.render("edit_mata_pelajaran", { pelajaran: results[0] });
    }
  );
});

app.post("/edit-mata-pelajaran/:id", (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;
  db.query(
    "UPDATE mata_pelajaran SET nama = ? WHERE id = ?",
    [nama, id],
    (err) => {
      if (err) throw err;
      res.redirect("/crud-mata-pelajaran");
    }
  );
});

// Menghapus Mata Pelajaran
app.get("/delete-mata-pelajaran/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM mata_pelajaran WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/crud-mata-pelajaran");
  });
});
// CRUD Jadwal Piket

// Menampilkan daftar Jadwal Piket
app.get("/crud-jadwal-piket", (req, res) => {
  db.query(
    "SELECT jp.*, g.nama AS guru_nama FROM jadwal_piket jp JOIN guru g ON jp.guru_id = g.id",
    (err, results) => {
      res.render("crud_jadwal_piket", { jadwal: results });
    }
  );
});

// Menambah Jadwal Piket
app.post("/add-jadwal-piket", (req, res) => {
  const { hari, guru_id } = req.body;
  db.query(
    "INSERT INTO jadwal_piket (hari, guru_id) VALUES (?, ?)",
    [hari, guru_id],
    (err) => {
      if (err) throw err;
      res.redirect("/crud-jadwal-piket");
    }
  );
});

// Mengedit Jadwal Piket
app.get("/edit-jadwal-piket/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM jadwal_piket WHERE id = ?", [id], (err, results) => {
    res.render("edit_jadwal_piket", { jadwal: results[0] });
  });
});

app.post("/edit-jadwal-piket/:id", (req, res) => {
  const { id } = req.params;
  const { hari, guru_id } = req.body;
  db.query(
    "UPDATE jadwal_piket SET hari = ?, guru_id = ? WHERE id = ?",
    [hari, guru_id, id],
    (err) => {
      if (err) throw err;
      res.redirect("/crud-jadwal-piket");
    }
  );
});

// Menghapus Jadwal Piket
app.get("/delete-jadwal-piket/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM jadwal_piket WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/crud-jadwal-piket");
  });
});

// CRUD Guru

// Menampilkan daftar Guru
app.get("/crud-guru", (req, res) => {
  db.query("SELECT * FROM guru", (err, results) => {
    res.render("crud_guru", { gurus: results });
  });
});

// Menambah Guru
app.post("/add-guru", (req, res) => {
  const { nama, mata_pelajaran } = req.body;
  db.query(
    "INSERT INTO guru (nama, mata_pelajaran) VALUES (?, ?)",
    [nama, mata_pelajaran],
    (err) => {
      if (err) throw err;
      res.redirect("/crud-guru");
    }
  );
});

// Mengedit Guru
app.get("/edit-guru/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM guru WHERE id = ?", [id], (err, results) => {
    res.render("edit_guru", { guru: results[0] });
  });
});

app.post("/edit-guru/:id", (req, res) => {
  const { id } = req.params;
  const { nama, mata_pelajaran } = req.body;
  db.query(
    "UPDATE guru SET nama = ?, mata_pelajaran = ? WHERE id = ?",
    [nama, mata_pelajaran, id],
    (err) => {
      if (err) throw err;
      res.redirect("/crud-guru");
    }
  );
});

// Menghapus Guru
app.get("/delete-guru/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM guru WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/crud-guru");
  });
});

// Menjalankan Server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
