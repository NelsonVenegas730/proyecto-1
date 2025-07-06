const editBtn = document.getElementById("toggle-edition-btn");
const cancelBtn = document.getElementById("cancel-edition");

const emprendimientoName = document.getElementById("emprendimiento-name");
const emprendimientoNameInput = document.getElementById("emprendimiento-name-input");
const descripcionParrafo = document.querySelector(".emprendimiento-descripcion .emprendimiento-text");
const descripcionTextarea = document.getElementById("emprendimiento-descripcion-textarea");
const direccionParrafo = document.querySelector(".emprendimiento-direccion .emprendimiento-text");
const direccionTextarea = document.getElementById("emprendimiento-direccion-textarea");

const infoElements = document.querySelectorAll(".emprendimiento-text, #emprendimiento-name");
const formContainers = document.querySelectorAll(".edit-form-container");
const errorMessages = document.querySelectorAll(".error-message");

const inputs = [
  { input: emprendimientoNameInput, error: errorMessages[0] },
  { input: descripcionTextarea, error: errorMessages[1] },
  { input: direccionTextarea, error: errorMessages[2] },
];

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


const validateField = (input, error) => {
  if (!input.value.trim()) {
    error.classList.remove("inactive");
    error.classList.add("active");
    return false;
  } else {
    error.classList.remove("active");
    error.classList.add("inactive");
    return true;
  }
};

const toggleEdition = () => {
  if (isEditing) {
    if (!validateFields()) return;

    updateTextContent();
    editBtn.innerHTML = `<i class="bx bxs-edit"></i><p class="edit-btn-text">Editar emprendimiento</p>`;
    cancelBtn.classList.remove("active");
    cancelBtn.classList.add("inactive");
  } else {
    setEditValues();
    editBtn.innerHTML = `<i class="bx bxs-save"></i><p class="edit-btn-text">Guardar cambios</p>`;
    cancelBtn.classList.remove("inactive");
    cancelBtn.classList.add("active");

    errorMessages.forEach(e => {
      e.classList.remove("active");
      e.classList.add("inactive");
    });
  }

  isEditing = !isEditing;
  toggleVisibility(infoElements, !isEditing);
  toggleVisibility(formContainers, isEditing);
};

const cancelEdition = () => {
  isEditing = false;
  editBtn.innerHTML = `<i class="bx bxs-edit"></i><p class="edit-btn-text">Editar emprendimiento</p>`;
  cancelBtn.classList.remove("active");
  cancelBtn.classList.add("inactive");
  toggleVisibility(infoElements, true);
  toggleVisibility(formContainers, false);

  errorMessages.forEach(e => {
    e.classList.remove("active");
    e.classList.add("inactive");
  });
};

editBtn.addEventListener("click", toggleEdition);
cancelBtn.addEventListener("click", cancelEdition);
inputs.forEach(({ input, error }) => {
  input.addEventListener("keyup", () => validateField(input, error));
  input.addEventListener("blur", () => validateField(input, error));
});

const validateFields = () => {
  return inputs.every(({ input, error }) => validateField(input, error));
};