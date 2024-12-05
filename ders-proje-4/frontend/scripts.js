const API_URL = "http://localhost:3000/notes";
const notesUndoneContainer = document.getElementById("notesUndone");
const notesDoneContainer = document.getElementById("notesDone");
const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const checkBox = document.getElementById("checkDone");

let isEditing = false;
let currentEditId = null;

async function fetchNotes() {
  try {
    const response = await fetch(API_URL);
    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    console.error("Notlar yüklenirken bir hata oluştu:", error);
  }
}

function renderNotes(notes) {
  notesUndoneContainer.innerHTML = "<h5>Bekleyen Notlar</h5>";
  notesDoneContainer.innerHTML = "<h5>Tamamlanan Notlar</h5>";
  for (const id in notes) {
    const note = notes[id];
    if (note.done) {
      const noteCard = `
              <div class="col-md-12">
                  <div class="card shadow">
                      <div class="card-body">
                                <h5 class="card-title"><s>${note.title}</s></h5>
                          <p class="card-text"><s>${note.content}</s></p>
                            <button class="btn btn-warning btn-sm" onclick="startEdit('${id}', '${note.title}', '${note.content}', '${note.done}')">Düzenle</button>
                          <button class="btn btn-danger btn-sm" onclick="deleteNote('${id}')">Sil</button>
                          <button class="btn btn-primary btn-sm" onclick="unDoneNote('${id}', '${note.title}', '${note.content}', '${note.done}')">Tamamlanmadı</button>
                      </div>
                  </div>
              </div>
          `;
      notesDoneContainer.insertAdjacentHTML("beforeend", noteCard);
    } else {
      const noteCard = `
              <div class="col-md-12">
                  <div class="card shadow">
                      <div class="card-body">
                          <h5 class="card-title"> ${note.title}</h5>
                          <p class="card-text">${note.content}</p>
                          <button class="btn btn-warning btn-sm" onclick="startEdit('${id}', '${note.title}', '${note.content}', '${note.done}')">Düzenle</button>
                          <button class="btn btn-danger btn-sm" onclick="deleteNote('${id}')">Sil</button>
                          <button class="btn btn-primary btn-sm" onclick="doneNote('${id}', '${note.title}', '${note.content}', '${note.done}')">Tamamla</button>
                      </div>
                  </div>
              </div>
          `;
      notesUndoneContainer.insertAdjacentHTML("beforeend", noteCard);
    }
  }
}

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const noteData = {
    title: titleInput.value,
    content: contentInput.value,
    done: checkBox.checked,
  };
  console.log("🚀 ~ noteForm.addEventListener ~ noteData:", noteData);

  if (isEditing) {
    try {
      await fetch(`${API_URL}/${currentEditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Not güncellenirken bir hata oluştu:", error);
    }
  } else {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Not eklenirken bir hata oluştu:", error);
    }
  }
});

function startEdit(id, title, content, done) {
  isEditing = true;
  currentEditId = id;
  titleInput.value = title;
  contentInput.value = content;
  checkBox.checked = done === "true";
  document.querySelector("button[type='submit']").innerText = "Güncelle";
}

function resetForm() {
  isEditing = false;
  currentEditId = null;
  titleInput.value = "";
  contentInput.value = "";
  checkBox.checked = false;
  document.querySelector("button[type='submit']").innerText = "Not Ekle";
}

async function deleteNote(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchNotes();
  } catch (error) {
    console.error("Not silinirken bir hata oluştu:", error);
  }
}
async function doneNote(id, title, content, checked) {
  const noteData = {
    id,
    title,
    content,
    done: true,
  };
  try {
    await fetch(`${API_URL}/${noteData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
    fetchNotes();
  } catch (error) {
    console.error("Not silinirken bir hata oluştu:", error);
  }
}
async function unDoneNote(id, title, content, checked) {
  const noteData = {
    id,
    title,
    content,
    done: false,
  };
  try {
    await fetch(`${API_URL}/${noteData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });
    fetchNotes();
  } catch (error) {
    console.error("Not silinirken bir hata oluştu:", error);
  }
}

fetchNotes();
