document.addEventListener("DOMContentLoaded", () => {
  const listGroup = document.getElementById("list-group");
  const noteTitle = document.querySelector(".note-title");
  const noteText = document.querySelector(".note-textarea");
  const saveNoteBtn = document.querySelector(".save-note");
  const clearFormBtn = document.querySelector(".clear-btn");
  const newNoteBtn = document.querySelector(".new-note");

  function fetchNotes() {
    fetch("/api/notes")
      .then((response) => response.json())
      .then((notes) => {
        listGroup.innerHTML = "";
        notes.forEach((note) => {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.dataset.id = note.id;
          li.textContent = note.title;
          li.addEventListener("click", () => {
            noteTitle.value = note.title;
            noteText.value = note.text;
            saveNoteBtn.style.display = "none";
            clearFormBtn.style.display = "none";
            newNoteBtn.style.display = "inline";
          });
          listGroup.appendChild(li);
        });
      });
  }

  function saveNote() {
    const note = {
      title: noteTitle.value,
      text: noteText.value,
    };
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then((response) => response.json())
      .then((newNote) => {
        fetchNotes();
        noteTitle.value = "";
        noteText.value = "";
        saveNoteBtn.style.display = "none";
        clearFormBtn.style.display = "none";
        newNoteBtn.style.display = "inline";
      });
  }

  function deleteNote() {
    const selectedNote = document.querySelector(".list-group-item.selected");
    if (selectedNote) {
      fetch(`/api/notes/${selectedNote.dataset.id}`, {
        method: "DELETE",
      }).then(() => {
        fetchNotes();
        noteTitle.value = "";
        noteText.value = "";
        saveNoteBtn.style.display = "none";
        clearFormBtn.style.display = "inline";
      });
    }
  }

  saveNoteBtn.addEventListener("click", saveNote);
  clearFormBtn.addEventListener("click", () => {
    noteTitle.value = "";
    noteText.value = "";
  });
  newNoteBtn.addEventListener("click", () => {
    noteTitle.value = "";
    noteText.value = "";
    saveNoteBtn.style.display = "inline";
    clearFormBtn.style.display = "inline";
    newNoteBtn.style.display = "none";
  });

  fetchNotes();
});
