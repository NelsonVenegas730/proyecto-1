
const editBtn = document.getElementById("toggle-edition-btn");
const cancelBtn = document.getElementById("cancel-edition");
const editImgBtn = document.getElementById("edit-img-trigger");
const imgInput = document.getElementById("edit-img-input");
const imgElement = document.getElementById("emprendimiento-img");

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
let originalImgSrc = imgElement.src;

const toggleVisibility = (elements, show) => {
  elements.forEach(el => {
    el.classList.toggle("active", show);
    el.classList.toggle("inactive", !show);
  });
};

const showEditImgControls = (show) => {
  editImgBtn.classList.toggle("inactive", !show);
  imgInput.classList.toggle("inactive", !show);
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
  const isValid = input.value.trim() !== "";
  error.classList.toggle("active", !isValid);
  error.classList.toggle("inactive", isValid);
  return isValid;
};

const validateFields = () => {
  return inputs.every(({ input, error }) => validateField(input, error));
};

const restoreOriginalImage = () => {
  imgElement.src = originalImgSrc;
};

const enviarCambiosAlServidor = async () => {
  const formData = new FormData();
  formData.append('name', emprendimientoNameInput.value.trim());
  formData.append('description', descripcionTextarea.value.trim());
  formData.append('address', direccionTextarea.value.trim());

  if (imgInput.files.length > 0) {
    formData.append('image', imgInput.files[0]);
  }

  try {
    const res = await fetch('/api/businesses/update', {
      method: 'PUT',
      body: formData
    });

    if (!res.ok) throw new Error('Error al guardar');

    const data = await res.json();

    if (data.nuevaImagenUrl) {
      imgElement.src = data.nuevaImagenUrl;
      originalImgSrc = data.nuevaImagenUrl;
    }

    return true;
  } catch (error) {
    alert('No se pudo guardar el emprendimiento');
    console.error(error);
    return false;
  }
};

const toggleEdition = async () => {
  if (isEditing) {
    if (!validateFields()) return;

    const success = await enviarCambiosAlServidor();
    if (!success) return;

    updateTextContent();
    editBtn.innerHTML = `<i class="bx bxs-edit"></i><p class="edit-btn-text">Editar emprendimiento</p>`;
    cancelBtn.classList.remove("active");
    cancelBtn.classList.add("inactive");
  } else {
    setEditValues();
    originalImgSrc = imgElement.src;
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
  showEditImgControls(isEditing);
};

const cancelEdition = () => {
  isEditing = false;
  restoreOriginalImage();
  editBtn.innerHTML = `<i class="bx bxs-edit"></i><p class="edit-btn-text">Editar emprendimiento</p>`;
  cancelBtn.classList.remove("active");
  cancelBtn.classList.add("inactive");
  toggleVisibility(infoElements, true);
  toggleVisibility(formContainers, false);
  showEditImgControls(false);
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

editImgBtn.addEventListener("click", () => imgInput.click());

imgInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imgElement.src = reader.result;
  };
  reader.readAsDataURL(file);
});
