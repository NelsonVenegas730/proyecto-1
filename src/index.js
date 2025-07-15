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
    res.render('Administrador/admin-aprobaciones.html');
});

app.get('/admin/tiquetes.html', (req, res) => {
    res.render('Administrador/admin-tiquetes.html');
});

app.get('/admin/usuarios.html', (req, res) => {
    res.render('Administrador/admin-usuarios.html');
});

app.get('/admin/panel-administrador.html', (req, res) => {
    res.render('Administrador/panel-administrador.html');
});

// Autenticacion
app.get('/auth/registrar-emprendimiento', (req, res) => {
    res.render('Autenticacion/registrar-emprendimiento', {
        title: 'Registrar Emprendimiento',
        layout: 'layouts/layout-auth'
    });
});

app.get('/auth/inicio-sesion', (req, res) => {
    res.render('Autenticacion/inicio-sesion', {
        title: 'Iniciar Sesión',
        layout: 'layouts/layout-auth'
    })
})

app.get('/perfil', (req, res) => {
    res.render('Autenticacion/perfil', {
        title: 'Perfil',
        style: '<link rel="stylesheet" href="/css/page-styles/perfil.css">',
    });
});

app.get('/auth/recuperar-password', (req, res) => {
    res.render('Autenticacion/recuperar-password', {
        title: 'Recuperar Contraseña',
        layout: 'layouts/layout-auth'
    });
});

app.get('/auth/registrarse', (req, res) => {
    res.render('Autenticacion/registrarse', {
        title: 'Registrarse',
        layout: 'layouts/layout-auth'
    })
})

// Ciudadano
app.get('/emprendimiento-slug.html', (req, res) => {
    res.render('Ciudadano/emprendimiento-slug.html');
});

app.get('/emprendimientos.html', (req, res) => {
    res.render('Ciudadano/emprendimientos.html');
});

app.get('/horario-buses.html', (req, res) => {
    res.render('Ciudadano/horario-buses.html');
});

app.get('/noticias-anuncios-eventos.html', (req, res) => {
    res.render('Ciudadano/noticias-anuncios-eventos.html');
});

app.get('/sugerencias.html', (req, res) => {
    res.render('Ciudadano/sugerencias.html');
});

// Emprendedor
app.get('emprendedor/mi-emprendimiento.html', (req, res) => {
    res.render('Emprendedor/mi-emprendimiento.html');
});

// Formularios
app.get('/form-anuncio-evento-noticia.html', (req, res) => {
    res.render('Formularios/form-anuncio-evento-noticia.html');
});

app.get('/form-tiquete.html', (req, res) => {
    res.render('Formularios/form-tiquete.html');
});

app.listen(port, () => {
    console.log(`Servidor encendido en http://localhost:${port}`);
});
