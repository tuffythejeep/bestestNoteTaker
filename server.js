const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error reading notes" });
    }
    res.json(JSON.parse(data));
  });
});
app.post("/api/notes", (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };
  fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error reading notes" });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "db.json"),
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error saving note" });
        }
        res.json(newNote);
      }
    );
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const idToDelete = req.params.id;
  fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error reading notes" });
    }
    let notes = JSON.parse(data);
    const initialLength = notes.length;

    notes = notes.filter((note) => note.id !== idToDelete);

    if (notes.length === initialLength) {
      return res.status(404).json({ error: "Note not found" });
    }

    fs.writeFile(
      path.join(__dirname, "db.json"),
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error deleting note" });
        }
        res.json({ message: "Note successfully deleted" });
      }
    );
  });
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});