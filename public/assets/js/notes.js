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
        listGroup.innerHTML = ""; // Clear existing notes
        if (notes.length > 0) {
          notes.forEach((note) => {
            const li = createNoteElement(note);
            listGroup.appendChild(li);
          });
        } else {
          listGroup.innerHTML = "<p>No notes yet!</p>"; // Display message for empty list
        }
      })
      .catch((error) => console.error("Error:", error));
  }
  function createNoteElement(note) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.dataset.id = note.id;
    li.textContent = note.title;
    li.addEventListener("click", () => {
      noteTitle.value = note.title;
      noteText.value = note.text;
      hideSaveAndClearButtons();
    });
    return li;
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
  hideSaveAndClearButtons(); // Initially hide Save and Clear buttons
});