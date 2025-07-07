const imagenInput = document.getElementById("imagen");
const previewContainer = document.getElementById("preview-container");

imagenInput.addEventListener("change", () => {
  previewContainer.innerHTML = "";
  const file = imagenInput.files[0];
  if (!file) return;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.alt = "Vista previa de la imagen subida";
  img.classList.add("image-preview");

  previewContainer.appendChild(img);
});

const formulario = document.getElementById("formulario");
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const direccion = document.getElementById("direccion");
const imagen = document.getElementById("imagen");

const requisitosTitulo = titulo.nextElementSibling;
const requisitosDescripcion = descripcion.nextElementSibling;
const requisitosDireccion = direccion.nextElementSibling;

const mensajeExito = document.getElementById("mensaje-exito");

const validateNotEmpty = (input, requisitoElem) => {
  const isValid = input.value.trim() !== "";
  input.classList.toggle("input-correcto", isValid);
  input.classList.toggle("input-incorrecto", !isValid);
  requisitoElem.classList.toggle("ok", isValid);
  requisitoElem.classList.toggle("error", !isValid);
  return isValid;
};

const mostrarPreviewImagen = () => {
  previewContainer.innerHTML = "";
  if (imagen.files && imagen.files[0]) {
    const file = imagen.files[0];
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

titulo.addEventListener("blur", () => validateNotEmpty(titulo, requisitosTitulo));
titulo.addEventListener("keyup", () => validateNotEmpty(titulo, requisitosTitulo));
descripcion.addEventListener("blur", () => validateNotEmpty(descripcion, requisitosDescripcion));
descripcion.addEventListener("keyup", () => validateNotEmpty(descripcion, requisitosDescripcion));
direccion.addEventListener("blur", () => validateNotEmpty(direccion, requisitosDireccion));
direccion.addEventListener("keyup", () => validateNotEmpty(direccion, requisitosDireccion));
imagen.addEventListener("change", mostrarPreviewImagen);

formulario.addEventListener("submit", e => {
  e.preventDefault();

  const tituloValido = validateNotEmpty(titulo, requisitosTitulo);
  const descripcionValido = validateNotEmpty(descripcion, requisitosDescripcion);
  const direccionValido = validateNotEmpty(direccion, requisitosDireccion);

  if (tituloValido && descripcionValido && direccionValido) {
    mostrarMensajeExito();
  } else {
    alert("Por favor completá todos los campos obligatorios.");
  }
});

function mostrarMensajeExito() {
  mensajeExito.classList.remove("oculto");
  setTimeout(() => {
    mensajeExito.classList.add("oculto");
    window.location.href = "../Emprendedor/mi-emprendimiento.html";
  }, 3500);
}


