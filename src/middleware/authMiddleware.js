function AuthenticateSession() {
  return (req, res, next) => {
    const user = req.session.user
    if (!user) {
      return res.status(403).render('error/403-access-denied', {
        title: '403 Acceso Denegado',
        layout: 'layouts/layout-error'
      });
    }
    next();
  }
}

function redirectIfAuthenticated() {
  return (req, res, next) => {
    const user = req.session.user
    if (user) {
      return res.redirect('/')
    } else {
      next()
    }
  }
}

function authorizeRoleAccess(rolesValidos = []) {
  const todosRoles = ['administrador', 'ciudadano', 'emprendedor'];

  for (const rol of rolesValidos) {
    if (!todosRoles.includes(rol)) {
      throw new Error(`Rol inválido en rolesValidos: ${rol}`);
    }
  }

  return (req, res, next) => {
    const userId = req.session.user_id;
    const rolUsuario = req.session.role;

    if (!userId) {
      const soloCiudadano = rolesValidos.length === 1 && rolesValidos.includes('ciudadano');
      if (soloCiudadano) {
        return res.redirect('/auth/inicio-sesion');
      }
      return res.status(403).render('error/403-access-denied', {
        title: '403 Acceso Denegado',
        layout: 'layouts/layout-error',
        mensaje: 'Debe iniciar sesión',
        roles: rolesValidos.join(', ')
      });
    }

    if (!rolUsuario || !rolesValidos.includes(rolUsuario)) {
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

module.exports = { AuthenticateSession, redirectIfAuthenticated, authorizeRoleAccess };