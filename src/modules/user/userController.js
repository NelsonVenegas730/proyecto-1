const userService = require('./userService');
const utils = require('../../utils/getInitials');

async function getAllUsersController(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    const usersWithInitials = users.map(user => ({
      ...user,
      initials: utils.getInitials(user.name, user.last_names),
    }));

    res.render('administrador/admin-usuarios', {
      title: 'Gestionar Usuarios',
      style: '<link rel="stylesheet" href="/css/page-styles/admin-usuarios.css">',
      layout: 'layouts/layout-admin',
      users: usersWithInitials
    });
  } catch (error) {
    next(error);
  }
}

async function signUp(req, res) {
  try {
    const user = await userService.register(req.body);

    const initials = utils.getInitials(user.name, user.last_names);

    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      last_names: user.last_names,
      role: user.role,
      avatarUrl: user.avatar || null,
      initials,
      master_id: user.master_id
    };

    res.json({
      success: true,
      role: user.role,
      userId: user._id,
      message: 'Usuario registrado con éxito',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
    });
  }
}

async function registerManualController(req, res) {
  try {
    const { username, name, last_names, email, password, role } = req.body;

    if (!username || !name || !last_names || !email || !password || !role) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newUser = await userService.registerManual({
      username,
      name,
      last_names,
      email,
      password,
      role,
    });

    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    console.error('Error al crear usuario manual:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function login(req, res) {
  try {
    const { correo, password, keepSesionActive } = req.body;
    const { user, match } = await userService.verifyCredentials(correo, password);

    if (!user || !match) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const initials = utils.getInitials(user.name, user.last_names);

    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      last_names: user.last_names,
      role: user.role,
      avatarUrl: user.avatar || null,
      initials,
      master_id: user.master_id
    };

    if (keepSesionActive === 'on') {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
    }

    return res.json({
      success: true,
      role: user.role,
      userId: user._id.toString()
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Error interno, intente más tarde'
    });
  }
}

async function logout(req, res) {
  try {
    await userService.destroySession(req);
    res.clearCookie('connect.sid', { path: '/' });
    res.status(200).json({ message: 'Sesión cerrada' });
  } catch (err) {
    console.error('Error destruyendo sesión:', err);
    res.status(500).json({ message: 'Error cerrando sesión' });
  }
}


async function updateUserData(req, res) {
  try {
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const { username, name, last_names } = req.body;
    const updatedUser = await userService.updateUser(userId, { username, name, last_names });

    req.session.user.username = updatedUser.username;
    req.session.user.name = updatedUser.name;
    req.session.user.last_names = updatedUser.last_names;
    req.session.user.avatarUrl = updatedUser.avatar;
    req.session.initials = utils.getInitials(updatedUser.name, updatedUser.last_names);

    res.status(200).json({ message: 'Datos actualizados correctamente', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateSensitive(req, res) {
  try {
    const { email, password } = req.body;
    const result = await userService.updateUserSensitive(
      req.session.user._id,
      { email, password }
    );

    if (email) req.session.user.email = email;

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateUserAvatar(req, res) {
  try {
    const userId = req.session.user._id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'Archivo no recibido' });

    const avatarUrl = await userService.updateAvatar(userId, file);

    req.session.user.avatarUrl = avatarUrl;

    res.json({ message: 'Avatar actualizado correctamente', avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error al actualizar avatar' });
  }
}

async function removeAvatar(req, res) {
  try {
    const userId = req.session.user._id;
    const initials = await userService.removeAvatar(userId);

    req.session.user.avatarUrl = initials;

    res.json({ message: 'Avatar eliminado', avatarUrl: initials });
  } catch (error) {
    console.error('Error en removeAvatar:', error);
    res.status(500).json({ error: 'Error al eliminar avatar' });
  }
}

async function getAccounts(req, res) {
  try {
    const masterId = req.session.user.master_id;
    if (!masterId) return res.status(400).json({ error: 'Master ID no encontrado en sesión' });

    const accounts = await userService.getUserAccounts(masterId);
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function changeAccount(req, res) {
  try {
    const { accountId } = req.body;
    if (!accountId) return res.status(400).json({ error: 'accountId es requerido' });

    const updatedUser = await userService.switchUserAccount(req.session, accountId);
    res.json({ message: 'Cuenta cambiada', user: updatedUser });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user_id = req.params.id;
    if (!user_id) return res.status(400).json({ error: 'Falta el ID del usuario' });

    await userService.deleteUserById(user_id);

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al eliminar usuario' });
  }
}

module.exports = {
  getAllUsersController,
  signUp,
  registerManualController,
  login, 
  logout, 
  updateUserData,
  updateSensitive,
  updateUserAvatar,
  removeAvatar,
  getAccounts,
  changeAccount,
  deleteUser
};