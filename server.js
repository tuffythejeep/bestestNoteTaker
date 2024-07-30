const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };
  fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "db.json"),
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) throw err;
        res.json(newNote);
      }
    );
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== id);
    fs.writeFile(
      path.join(__dirname, "db.json"),
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) throw err;
        res.json({ message: "Note deleted" });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
