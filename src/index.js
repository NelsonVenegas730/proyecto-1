const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const path = require('path');
const port = 3000;

app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/layout-default'); // layout por defecto

app.use(express.static(path.join(__dirname, 'public')));

// Rutas views de las páginas HTML (views)
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Inicio',
    style: '<link rel="stylesheet" href="/css/page-styles/inicio.css">'
  })
})

// Administrador
app.get('/admin/aprobaciones.html', (req, res) => {
    res.render('administrador/admin-aprobaciones.html');
});

app.get('/admin/tiquetes.html', (req, res) => {
    res.render('administrador/admin-tiquetes.html');
});

app.get('/admin/usuarios.html', (req, res) => {
    res.render('administrador/admin-usuarios.html');
});

app.get('/admin/panel-administrador.html', (req, res) => {
    res.render('administrador/panel-administrador.html');
});

// Autenticacion
app.get('/auth/registrar-emprendimiento', (req, res) => {
    res.render('autenticacion/registrar-emprendimiento', {
        title: 'Registrar Emprendimiento',
        layout: 'layouts/layout-auth'
    });
});

app.get('/auth/inicio-sesion', (req, res) => {
    res.render('autenticacion/inicio-sesion', {
        title: 'Iniciar Sesión',
        layout: 'layouts/layout-auth'
    })
})

app.get('/perfil', (req, res) => {
    res.render('autenticacion/perfil', {
        title: 'Perfil',
        style: '<link rel="stylesheet" href="/css/page-styles/perfil.css">',
    });
});

app.get('/auth/recuperar-password', (req, res) => {
    res.render('autenticacion/recuperar-password', {
        title: 'Recuperar Contraseña',
        layout: 'layouts/layout-auth'
    });
});

app.get('/auth/registrarse', (req, res) => {
    res.render('autenticacion/registrarse', {
        title: 'Registrarse',
        layout: 'layouts/layout-auth'
    })
})

// Ciudadano
app.get('/emprendimiento-slug', (req, res) => {
    res.render('ciudadano/emprendimiento-slug');
});

app.get('/emprendimientos', (req, res) => {
    res.render('ciudadano/emprendimientos');
});

app.get('/horario-buses', (req, res) => {
    res.render('ciudadano/horario-buses');
});

app.get('/noticias-anuncios-eventos', (req, res) => {
    res.render('ciudadano/noticias-anuncios-eventos');
});

app.get('/sugerencias', (req, res) => {
    res.render('ciudadano/sugerencias');
});

// Emprendedor
app.get('/emprendedor/mi-emprendimiento', (req, res) => {
    res.render('emprendedor/mi-emprendimiento');
});

// Formularios
app.get('/form/form-anuncio-evento-noticia', (req, res) => {
    res.render('formularios/form-anuncio-evento-noticia', {
        title: 'Crear nuevo Anuncio / Evento / Noticia',
        layout: 'layouts/layout-form'
    });
});

app.get('/form/form-tiquete', (req, res) => {
    res.render('formularios/form-tiquete', {
        title: 'Nuevo Tiquete de Soporte',
        layout: 'layouts/layout-form'
    });
});

app.listen(port, () => {
    console.log(`Servidor encendido en http://localhost:${port}`);
});
