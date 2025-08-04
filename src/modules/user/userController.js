const userService = require('./userService');

async function signUp(req, res) {
  try {
    const user = await userService.register(req.body);

    req.session.user_id = user._id;
    req.session.role = user.role;

    if (user.role === 'emprendedor') {
      return res.redirect('/auth/registrar-emprendimiento');
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar usuario');
  }
}

async function login(req, res) {
  try {
    const { correo, password, keepSesionActive } = req.body;
    const { user, match } = await userService.verifyCredentials(correo, password);

    if (!user || !match) {
      return res.status(401).render('error/403-access-denied', {
        title: 'Credenciales inválidas',
        layout: 'layouts/layout-error'
      });
    }

    req.session.user_id = user._id;
    req.session.role = user.role;

    if (keepSesionActive === 'on') {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 días
    }

    if (user.role === 'administrador') {
      return res.redirect('/admin/panel-administrador');
    } else if (user.role === 'emprendedor') {
      return res.redirect('/emprendedor/mi-emprendimiento/' + user._id);
    } else if (user.role === 'ciudadano') {
      return res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.status(500).render('error/403-access-denied', {
      title: 'Error al iniciar sesión',
      layout: 'layouts/layout-error'
    });
  }
}

async function recoverPassword(req, res) {
  try {
    const { correo } = req.body;
    const user = await userService.recoverPassword(correo);

    // Acá podés agregar lógica para enviar correo con token, etc.

    res.redirect('/auth/inicio-sesion');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en recuperación de contraseña');
  }
}

module.exports = { signUp, login, recoverPassword };