const userService = require('../modules/user/userService');

async function attachUserData(req, res, next) {
  if (req.session?.user?.master_id) {
    try {
      const userAccounts = await userService.getUserAccounts(req.session.user.master_id);
      res.locals.userAccounts = userAccounts;
    } catch {
      res.locals.userAccounts = [];
    }
  } else {
    res.locals.userAccounts = [];
  }

  res.locals.user = req.session.user || null;
  res.locals.activeAccountId = req.session?.user?._id || null;

  next();
}

function redirectIfAuthenticated() {
  return (req, res, next) => {
    const user = req.session.user;
    if (user) {
      return res.redirect('/');
    } else {
      next();
    }
  };
}

function redirectFromLanding() {
  return (req, res, next) => {
    const user = req.session.user;
    if (user && user.role === 'administrador') {
      return res.redirect('/admin/panel-administrador');
    } else if (user && user.role === 'emprendedor') {
      return res.redirect('/emprendedor/mi-emprendimiento/' + user._id);
    }
    next();
  };
}

function authorizeRoleAccess(rolesValidos = []) {
  const todosRoles = ['administrador', 'ciudadano', 'emprendedor'];

  for (const rol of rolesValidos) {
    if (!todosRoles.includes(rol)) {
      throw new Error(`Rol inválido en rolesValidos: ${rol}`);
    }
  }

  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      const includesCiudadano = rolesValidos.includes('ciudadano');
      if (includesCiudadano) {
        return res.redirect('/auth/inicio-sesion');
      }
      return res.status(403).render('error/403-access-denied', {
        title: '403 Acceso Denegado',
        layout: 'layouts/layout-error',
        mensaje: 'Debe iniciar sesión',
        roles: rolesValidos.join(', ')
      });
    }

    if (!rolesValidos.includes(user.role)) {
      return res.status(403).render('error/403-access-denied', {
        title: 'Acceso Denegado',
        layout: 'layouts/layout-error',
        mensaje: null,
        roles: rolesValidos.join(', ')
      });
    }

    next();
  };
}

module.exports = { redirectIfAuthenticated, redirectFromLanding, authorizeRoleAccess, attachUserData };