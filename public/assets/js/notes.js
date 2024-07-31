document.addEventListener("DOMContentLoaded", () => {
  const listGroup = document.getElementById("list-group");
  const noteTitle = document.querySelector(".note-title");
  const noteText = document.querySelector(".note-textarea");
  const saveNoteBtn = document.querySelector(".save-note");
  const clearFormBtn = document.querySelector(".clear-btn");
  const newNoteBtn = document.querySelector(".new-note");

  function showSaveAndClearButtons() {
    saveNoteBtn.style.display = "inline";
    clearFormBtn.style.display = "inline";
    newNoteBtn.style.display = "none";
  }

  function hideSaveAndClearButtons() {
    saveNoteBtn.style.display = "none";
    clearFormBtn.style.display = "none";
    newNoteBtn.style.display = "inline";
  }

  function handleNoteInput() {
    if (noteTitle.value.trim() !== "" || noteText.value.trim() !== "") {
      showSaveAndClearButtons();
    } else {
      hideSaveAndClearButtons();
    }
  }

  noteTitle.addEventListener("input", handleNoteInput);
  noteText.addEventListener("input", handleNoteInput);

  function fetchNotes() {
    fetch("/api/notes")
      .then((response) => response.json())
      .then((notes) => {
        listGroup.innerHTML = ""; 
        if (notes.length > 0) {
          notes.forEach((note) => {
            const li = createNoteElement(note);
            listGroup.appendChild(li);
          });
        } else {
          listGroup.innerHTML = "<p>No notes yet!</p>";
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  function createNoteElement(note) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.dataset.id = note.id;

    const titleSpan = document.createElement("span");
    titleSpan.className = "list-item-title";
    titleSpan.textContent = note.title;
    titleSpan.addEventListener("click", () => {
      noteTitle.value = note.title;
      noteText.value = note.text;
      hideSaveAndClearButtons();
    });

    const deleteBtn = document.createElement("i");
    deleteBtn.className =
      "fas fa-trash-alt float-right text-danger delete-note";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteNote(note.id);
    });

    li.appendChild(titleSpan);
    li.appendChild(deleteBtn);

    return li;
  }

  function deleteNote(id) {
    fetch(`/api/notes/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete note");
        }
        return response.json();
      })
      .then(() => {
        fetchNotes();
        clearForm(); 
      })
      .catch((error) => console.error("Error:", error));
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
        hideSaveAndClearButtons();
      })
      .catch((error) => console.error("Error:", error));
  }

  function clearForm() {
    noteTitle.value = "";
    noteText.value = "";
    hideSaveAndClearButtons();
  }

  saveNoteBtn.addEventListener("click", saveNote);
  clearFormBtn.addEventListener("click", clearForm);
  newNoteBtn.addEventListener("click", () => {
    noteTitle.value = "";
    noteText.value = "";
    showSaveAndClearButtons();
  });

  fetchNotes();
});
