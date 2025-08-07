const formulario = document.getElementById("formulario");

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

const mensajeError = document.getElementById("mensaje-error");
const mensajeExito = document.getElementById("mensaje-exito");

const expresiones = {
  correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,14}$/,
  soloTexto: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
  usuario: /^[a-zA-Z0-9_-]{3,20}$/,
};

const validarCampo = (input, expresion, requisitosElement) => {
  const valido = expresion.test(input.value);
  input.classList.toggle("input-correcto", valido);
  input.classList.toggle("input-incorrecto", !valido);
  requisitosElement.classList.toggle("ok", valido);
  requisitosElement.classList.toggle("error", !valido);
  return valido;
};

const validarPasswordMatch = () => {
  const coincide = password.value === confirmPassword.value && password.value !== "";
  confirmPassword.classList.toggle("input-correcto", coincide);
  confirmPassword.classList.toggle("input-incorrecto", !coincide);
  requisitosConfirmPassword.classList.toggle("ok", coincide);
  requisitosConfirmPassword.classList.toggle("error", !coincide);
  return coincide;
};

usuario.addEventListener("input", () => validarCampo(usuario, expresiones.usuario, requisitosUsuario));
correo.addEventListener("input", () => validarCampo(correo, expresiones.correo, requisitosCorreo));
password.addEventListener("input", () => validarCampo(password, expresiones.password, requisitosPassword));
confirmPassword.addEventListener("input", validarPasswordMatch);
nombre.addEventListener("input", () => validarCampo(nombre, expresiones.soloTexto, requisitosNombre));
apellidos.addEventListener("input", () => validarCampo(apellidos, expresiones.soloTexto, requisitosApellidos));

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuarioValido = validarCampo(usuario, expresiones.usuario, requisitosUsuario);
  const correoValido = validarCampo(correo, expresiones.correo, requisitosCorreo);
  const passwordValido = validarCampo(password, expresiones.password, requisitosPassword);
  const confirmValido = validarPasswordMatch();
  const nombreValido = validarCampo(nombre, expresiones.soloTexto, requisitosNombre);
  const apellidosValido = validarCampo(apellidos, expresiones.soloTexto, requisitosApellidos);

  if (!(usuarioValido && correoValido && passwordValido && confirmValido && nombreValido && apellidosValido)) {
    mensajeError.textContent = 'Corrige los campos con error';
    mensajeError.classList.remove('oculto');
    setTimeout(() => mensajeError.classList.add('oculto'), 3000);
    return;
  }

  const data = {
    username: usuario.value,
    name: nombre.value,
    last_names: apellidos.value,
    email: correo.value, // que sea 'correo' si el backend espera ese nombre
    password: password.value,
    isEmprendedor: document.getElementById("emprende").checked ? 'on' : 'off',
  };

  try {
    const response = await fetch('/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      mensajeError.textContent = result.message || 'Error desconocido';
      mensajeError.classList.remove('oculto');
      setTimeout(() => mensajeError.classList.add('oculto'), 3000);
    } else {
      mensajeError.classList.add('oculto');
      mensajeExito.textContent = result.message;
      mensajeExito.classList.remove('oculto');
      setTimeout(() => {
        mensajeExito.classList.add('oculto');
          if (result.success) {
            if (result.role === 'emprendedor') {
              window.location.href = '/auth/registrar-emprendimiento';
            } else {
              window.location.href = '/';
            }
          }
      }, 3500);
    }
  } catch (err) {
    mensajeError.textContent = 'Error al procesar la solicitud.';
    mensajeError.classList.remove('oculto');
    setTimeout(() => mensajeError.classList.add('oculto'), 3000);
  }
});
