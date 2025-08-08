const bcrypt = require('bcrypt');
const User = require('./userModel');
const path = require('path');
const fs = require('fs');

function getInitials(name, last_names) {
  const nameInitial = name.trim().charAt(0).toUpperCase() || '';
  const lastNameInitial = last_names.trim().charAt(0).toUpperCase() || '';
  return nameInitial + lastNameInitial;
}

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

async function updateUser(userId, data) {
  const { username, name, last_names } = data;
  if (!name || !last_names) throw new Error('Nombre y apellidos son obligatorios');

  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  const initials = getInitials(name, last_names);

  const isAvatarImage = user.avatar && (user.avatar.startsWith('/uploads/') || user.avatar.startsWith('http'));

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      username: username.trim(),
      name,
      last_names,
      avatar: isAvatarImage ? user.avatar : initials
    },
    { new: true }
  );

  return updatedUser;
}

async function updateAvatar(userId, file) {
  if (!file) throw new Error('Archivo no encontrado');
  const avatarPath = `/uploads/${file.filename}`;

  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');
  if (user.avatar && user.avatar.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, '..', user.avatar);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
  user.avatar = avatarPath;
  await user.save();
  return avatarPath;
}


async function removeAvatar(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  if (user.avatar && user.avatar.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, '..', user.avatar);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }

  const initials = getInitials(user.name, user.last_names);
  user.avatar = initials;
  await user.save();

  return initials;
}

module.exports = {
  register,
  verifyCredentials,
  destroySession,
  updateUser,
  updateAvatar,
  removeAvatar
};