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

