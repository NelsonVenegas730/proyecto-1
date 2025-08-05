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

module.exports = { redirectIfAuthenticated, authorizeRoleAccess };