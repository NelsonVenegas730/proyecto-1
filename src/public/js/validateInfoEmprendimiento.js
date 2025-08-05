const imageInput = document.getElementById("image");
const previewContainer = document.getElementById("preview-container");

imageInput.addEventListener("change", () => {
  previewContainer.innerHTML = "";
  const file = imageInput.files[0];
  if (!file) return;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.alt = "Vista previa de la imagen subida";
  img.classList.add("image-preview");

  previewContainer.appendChild(img);
});

const form = document.getElementById("formulario");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const addressInput = document.getElementById("address");
const successMessage = document.getElementById("mensaje-exito");

const reqName = nameInput.nextElementSibling;
const reqDescription = descriptionInput.nextElementSibling;
const reqAddress = addressInput.nextElementSibling;

const validateNotEmpty = (input, reqElem) => {
  const isValid = input.value.trim() !== "";
  input.classList.toggle("input-correcto", isValid);
  input.classList.toggle("input-incorrecto", !isValid);
  reqElem.classList.toggle("ok", isValid);
  reqElem.classList.toggle("error", !isValid);
  return isValid;
};

const showImagePreview = () => {
  previewContainer.innerHTML = "";
  if (imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("image-preview");
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
};

nameInput.addEventListener("blur", () => validateNotEmpty(nameInput, reqName));
nameInput.addEventListener("keyup", () => validateNotEmpty(nameInput, reqName));
descriptionInput.addEventListener("blur", () => validateNotEmpty(descriptionInput, reqDescription));
descriptionInput.addEventListener("keyup", () => validateNotEmpty(descriptionInput, reqDescription));
addressInput.addEventListener("blur", () => validateNotEmpty(addressInput, reqAddress));
addressInput.addEventListener("keyup", () => validateNotEmpty(addressInput, reqAddress));
imageInput.addEventListener("change", showImagePreview);

form.addEventListener("submit", async e => {
  e.preventDefault();

  const nameValid = validateNotEmpty(nameInput, reqName);
  const descriptionValid = validateNotEmpty(descriptionInput, reqDescription);
  const addressValid = validateNotEmpty(addressInput, reqAddress);

  if (!(nameValid && descriptionValid && addressValid)) {
    alert("Por favor completá todos los campos obligatorios.");
    return;
  }

  const formData = new FormData(form);

  try {
    const response = await fetch('/api/businesses', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      showSuccessMessage(() => {
        window.location.href = '/emprendedor/mi-emprendimiento/' + data.business.user_id;
      });
    } else {
      alert("Error al registrar el emprendimiento");
    }
  } catch (error) {
    console.error(error);
    alert("Error en la conexión");
  }
});

function showSuccessMessage(callback) {
  successMessage.classList.remove("oculto");
  setTimeout(async () => {
    successMessage.classList.add("oculto");
    if (typeof callback === "function") await callback();
  }, 3500);
}