const mongoose = require('mongoose');
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

  // Buscar usuario con mismo email para master_id
  const existingUser = await User.findOne({ email });
  let masterId;
  if (existingUser && existingUser.master_id) {
    masterId = existingUser.master_id;
  } else {
    masterId = new mongoose.Types.ObjectId();
  }

  const iniciales = (
    (name?.[0] || '') + 
    (last_names?.split(' ')[0]?.[0] || '')
  ).toUpperCase();

  const nuevoUsuario = new User({
    master_id: masterId,
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
  const users = await User.find({ email: correo })
  for (const user of users) {
    const match = await bcrypt.compare(password, user.password)
    if (match) return { user, match: true }
  }
  return { user: null, match: false }
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

async function updateUserSensitive(userId, data) {
  const { email, password } = data

  const user = await User.findById(userId)
  if (!user) throw new Error('Usuario no encontrado')

  if (email && password) {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      const samePassword = await bcrypt.compare(password, existingUser.password)
      if (samePassword) throw new Error('El correo y la contraseña ya existen en otro usuario')
    }
  }

  if (email) {
    user.email = email.trim()
  }

  if (password) {
    const encryptedPassword = await bcrypt.hash(password, 10)
    user.password = encryptedPassword
  }

  await user.save()

  return { message: 'Información sensible actualizada correctamente' }
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

async function getUserAccounts(masterId) {
  const accounts = await User.find({ master_id: masterId }).lean();
  accounts.forEach(acc => {
    acc.initials = getInitials(acc.name, acc.last_names);
  });
  return accounts;
}

async function switchUserAccount(session, newAccountId) {
  const user = await User.findById(newAccountId);

  if (!user) throw new Error('Cuenta no encontrada');

  if (user.master_id.toString() !== session.user.master_id.toString()) {
    throw new Error('No autorizado para cambiar a esta cuenta');
  }

  session.user = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatar,
    master_id: user.master_id,
    name: user.name,
    last_names: user.last_names,
    initials: getInitials(user.name, user.last_names)
  };

  return user;
}

module.exports = {
  register,
  verifyCredentials,
  destroySession,
  updateUser,
  updateUserSensitive,
  updateAvatar,
  removeAvatar,
  getUserAccounts,
  switchUserAccount
};