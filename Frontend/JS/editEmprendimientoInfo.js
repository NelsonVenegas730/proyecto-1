const editBtn = document.getElementById("toggle-edition-btn");
const cancelBtn = document.getElementById("cancel-edition");

const emprendimientoName = document.getElementById("emprendimiento-name");
const emprendimientoNameInput = document.getElementById("emprendimiento-name-input");
const descripcionParrafo = document.querySelector(".emprendimiento-descripcion .emprendimiento-text");
const descripcionTextarea = document.getElementById("emprendimiento-descripcion-textarea");
const direccionParrafo = document.querySelector(".emprendimiento-direccion .emprendimiento-text");
const direccionTextarea = document.getElementById("emprendimiento-direccion-textarea");

const infoElements = document.querySelectorAll(".emprendimiento-text, #emprendimiento-name");
const formElements = document.querySelectorAll(".edit-form-container");

let isEditing = false;

const toggleVisibility = (elements, show) => {
  elements.forEach(el => {
    el.classList.toggle("active", show);
    el.classList.toggle("inactive", !show);
  });
};

const setEditValues = () => {
  emprendimientoNameInput.value = emprendimientoName.innerText.trim();
  descripcionTextarea.value = descripcionParrafo.innerText.trim();
  direccionTextarea.value = direccionParrafo.innerText.trim();
};

const updateTextContent = () => {
  emprendimientoName.innerText = emprendimientoNameInput.value.trim();
  descripcionParrafo.innerText = descripcionTextarea.value.trim();
  direccionParrafo.innerText = direccionTextarea.value.trim();
};

const toggleEdition = () => {
  if (isEditing) {
    updateTextContent();
    editBtn.innerHTML = `<i class="bx bxs-edit"></i><p class="edit-btn-text">Editar emprendimiento</p>`;
    cancelBtn.classList.remove("active");
    cancelBtn.classList.add("inactive");
  } else {
    setEditValues();
    editBtn.innerHTML = `<i class="bx bxs-save"></i><p class="edit-btn-text">Guardar cambios</p>`;
    cancelBtn.classList.remove("inactive");
    cancelBtn.classList.add("active");
  }

  isEditing = !isEditing;
  toggleVisibility(infoElements, !isEditing);
  toggleVisibility(formElements, isEditing);
};

const cancelEdition = () => {
  isEditing = false;
  editBtn.innerHTML = `<i class="bx bxs-edit"></i><p class="edit-btn-text">Editar emprendimiento</p>`;
  cancelBtn.classList.remove("active");
  cancelBtn.classList.add("inactive");
  toggleVisibility(infoElements, true);
  toggleVisibility(formElements, false);
};

editBtn.addEventListener("click", toggleEdition);
cancelBtn.addEventListener("click", cancelEdition);
