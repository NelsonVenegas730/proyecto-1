const bcrypt = require('bcrypt');
const User = require('./userModel');

async function register(data) {
  const { username, name, last_names, email, password, isEmprendedor } = data;

  const encryptedPassword = await bcrypt.hash(password, 10);

  const iniciales = (
    (name?.[0] || '') + 
    (last_names?.split(' ')[0]?.[0] || '')
  ).toUpperCase();

  const nuevoUsuario = new User({
    avatar: iniciales,
    username,
    name,
    last_names,
    email,
    password: encryptedPassword,
    role: isEmprendedor === 'on' ? 'emprendedor' : 'ciudadano',
  });

  return await nuevoUsuario.save();
}

async function verifyCredentials(correo, password) {
  const user = await User.findOne({ email: correo });
  const match = user ? await bcrypt.compare(password, user.password) : false;
  return { user, match };
}

async function destroySession(req) {
  if (!req.session) throw new Error('No hay sesión para destruir');
  return new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function recoverPassword(email) {
  const user = await User.findOne({ email });
  return user; // acá luego se puede agregar lógica para enviar token, email, etc.
}

module.exports = {
  register,
  verifyCredentials,
  destroySession,
  recoverPassword
};