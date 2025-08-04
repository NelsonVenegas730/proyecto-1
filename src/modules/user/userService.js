const bcrypt = require('bcrypt');
const User = require('./userModel');

async function register(data) {
  const { username, name, last_names, email, password, isEmprendedor } = data;

  const encryptedPassword = await bcrypt.hash(password, 10);

  const nuevoUsuario = new User({
    username,
    name,
    last_names,
    email,
    password: encryptedPassword,
    role: isEmprendedor === 'on' ? 'emprendedor' : 'ciudadano',
    status: 'activo'
  });

  return await nuevoUsuario.save();
}

async function verifyCredentials(correo, password) {
  const user = await User.findOne({ email: correo });
  const match = user ? await bcrypt.compare(password, user.password) : false;
  return { user, match };
}

async function recoverPassword(email) {
  const user = await User.findOne({ email });
  return user; // acá luego se puede agregar lógica para enviar token, email, etc.
}

module.exports = {
  register,
  verifyCredentials,
  recoverPassword
};