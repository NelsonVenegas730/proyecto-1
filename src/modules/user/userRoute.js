const express = require('express');
const router = express.Router();
const userController = require('./userController');
const authMiddleware = require('../../middleware/authMiddleware');

// POSTs (API lógica)
router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);
router.post('/recover-password', userController.recoverPassword);

// Vistas públicas (GETs)
router.get('/inicio-sesion', (req, res) => {
  res.render('autenticacion/inicio-sesion', {
    title: 'Iniciar Sesión',
    layout: 'layouts/layout-auth'
  });
});

router.get('/registrarse', (req, res) => {
  res.render('autenticacion/registrarse', {
    title: 'Registrarse',
    layout: 'layouts/layout-auth'
  });
});

router.get('/recuperar-password', (req, res) => {
  res.render('autenticacion/recuperar-password', {
    title: 'Recuperar Contraseña',
    layout: 'layouts/layout-auth'
  });
});

router.get('/registrar-emprendimiento', authMiddleware.AuthenticateSession, (req, res) => {
  res.render('autenticacion/registrar-emprendimiento', {
    title: 'Registrar Emprendimiento',
    layout: 'layouts/layout-auth'
  });
});

router.get('/perfil', authMiddleware.AuthenticateSession, (req, res) => {
  res.render('autenticacion/perfil', {
    title: 'Perfil',
    style: '<link rel="stylesheet" href="/css/page-styles/perfil.css">'
  });
});

module.exports = router;
