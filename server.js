const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, "db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data).notes;
  } catch (error) {
    if (error.code === "ENOENT") {
      
      await fs.writeFile(DB_PATH, JSON.stringify({ notes: [] }), "utf8");
      return [];
    }
    throw error;
  }
}

async function writeDb(notes) {
  await fs.writeFile(DB_PATH, JSON.stringify({ notes }, null, 2), "utf8");
}

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await readDb();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error reading notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const newNote = { ...req.body, id: uuidv4() };
    const notes = await readDb();
    notes.push(newNote);
    await writeDb(notes);
    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let notes = await readDb();
    notes = notes.filter((note) => note.id !== id);
    await writeDb(notes);
    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting note" });
  }
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