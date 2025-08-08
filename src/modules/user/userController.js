const userService = require('./userService');

function getInitials(name, last_names) {
  const n = name ? name.split(' ').map(w => w[0]).join('') : '';
  const a = last_names ? last_names.split(' ').map(w => w[0]).join('') : '';
  return (n + a).toUpperCase();
}

async function signUp(req, res) {
  try {
    const user = await userService.register(req.body);

    const initials = getInitials(user.name, user.last_names);

    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      last_names: user.last_names,
      role: user.role,
      avatarUrl: user.avatar || null,
      initials
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

    const initials = getInitials(user.name, user.last_names);

    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      last_names: user.last_names,
      role: user.role,
      avatarUrl: user.avatar || null,
      initials
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
  console.log(req.body);
  try {
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const { username, name, last_names } = req.body;
    const updatedUser = await userService.updateUser(userId, { username, name, last_names });

    req.session.user.username = updatedUser.username;
    req.session.user.name = updatedUser.name;
    req.session.user.last_names = updatedUser.last_names;
    req.session.user.avatarUrl = updatedUser.avatar;
    req.session.initials = getInitials(updatedUser.name, updatedUser.last_names);

    res.status(200).json({ message: 'Datos actualizados correctamente', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

module.exports = { 
  signUp, 
  login, 
  logout, 
  updateUserData,
  updateUserAvatar,
  removeAvatar
};