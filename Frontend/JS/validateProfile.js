const formulario = document.getElementById("formulario-perfil");

const correo = document.getElementById("correo");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const usuario = document.getElementById("usuario");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");

const requisitosCorreo = document.getElementById("correo-requisitos");
const requisitosPassword = document.getElementById("password-requisitos");
const requisitosConfirmPassword = document.getElementById("confirm-password-requisitos");

const requisitosUsuario = document.getElementById("usuario-requisitos");
const requisitosNombre = document.getElementById("nombre-requisitos");
const requisitosApellidos = document.getElementById("apellidos-requisitos");

const mensajeExito = document.getElementById("mensaje-exito");

const btnEditarCuenta = document.getElementById("btn-editar-cuenta");
const accountInfo = document.getElementById("account-info");
const inputsAccount = accountInfo.querySelectorAll("input");

const expresiones = {
    correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{12,}$/,
    soloTexto: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    usuario: /^[a-zA-Z0-9_-]{3,20}$/,
};
let editMode = false;

const validarCampo = (input, expresion, requisitosElement) => {
    const valido = expresion.test(input.value);
    input.classList.toggle("input-correcto", valido);
    input.classList.toggle("input-incorrecto", !valido);
    requisitosElement?.classList.toggle("ok", valido);
    requisitosElement?.classList.toggle("error", !valido);
    return valido;
};

const validarPasswordMatch = () => {
    const coincide = password.value === confirmPassword.value && password.value !== "";
    confirmPassword.classList.toggle("input-correcto", coincide);
    confirmPassword.classList.toggle("input-incorrecto", !coincide);
    requisitosConfirmPassword?.classList.toggle("ok", coincide);
  requisitosConfirmPassword?.classList.toggle("error", !coincide);
  return coincide;
};

document.getElementById("cancel-changes").addEventListener("click", () => {
  location.reload();
});

usuario.addEventListener("input", () => validarCampo(usuario, expresiones.usuario, requisitosUsuario));

correo.addEventListener("input", () => {
  if (!correo.disabled) validarCampo(correo, expresiones.correo, requisitosCorreo);
});

password.addEventListener("input", () => {
  if (!password.disabled) validarCampo(password, expresiones.password, requisitosPassword);
});

confirmPassword.addEventListener("input", () => {
  if (!confirmPassword.disabled) validarPasswordMatch();
});

nombre.addEventListener("input", () => validarCampo(nombre, expresiones.soloTexto, requisitosNombre));
apellidos.addEventListener("input", () => validarCampo(apellidos, expresiones.soloTexto, requisitosApellidos));


btnEditarCuenta.addEventListener("click", () => {
  editMode = !editMode;

  accountInfo.classList.toggle("disabled", !editMode);

  inputsAccount.forEach(input => {
    input.disabled = !editMode;
  });
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const usuarioValido = validarCampo(usuario, expresiones.usuario, requisitosUsuario);

  let correoValido = true;
  let passwordValido = true;
  let confirmValido = true;

  if (!correo.disabled) {
    correoValido = validarCampo(correo, expresiones.correo, requisitosCorreo);
    passwordValido = validarCampo(password, expresiones.password, requisitosPassword);
    confirmValido = validarPasswordMatch();
  }

  const nombreValido = validarCampo(nombre, expresiones.soloTexto, requisitosNombre);
  const apellidosValido = validarCampo(apellidos, expresiones.soloTexto, requisitosApellidos);

  if (usuarioValido && correoValido && passwordValido && confirmValido && nombreValido && apellidosValido) {
    mensajeExito.classList.remove("oculto");
    setTimeout(() => {
      mensajeExito.classList.add("oculto");
      formulario.submit();
    }, 2000);
  } else {
    alert("Por favor completá todos los campos correctamente.");
  }
});
