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
app.get('/admin/aprobaciones', (req, res) => {
    res.render('administrador/admin-aprobaciones', {
        title: 'Gestionar Contenido',
        style: '<link rel="stylesheet" href="/css/page-styles/admin-aprobaciones.css">',
        layout: 'layouts/layout-admin'
    })
});

app.get('/admin/tiquetes', (req, res) => {
    res.render('administrador/admin-tiquetes', {
        title: 'Gestionar Tiquetes de Soporte',
        style: '<link rel="stylesheet" href="/css/page-styles/admin-tiquetes.css">',
        layout: 'layouts/layout-admin'
    });
});

app.get('/admin/usuarios', (req, res) => {
    res.render('administrador/admin-usuarios', {
        title: 'Gestionar Usuarios',
        style: '<link rel="stylesheet" href="/css/page-styles/admin-usuarios.css">',
        layout: 'layouts/layout-admin'
    });
});

app.get('/admin/panel-administrador', (req, res) => {
    res.render('administrador/panel-administrador', {
        title: 'Panel de Administrador',
        style: '<link rel="stylesheet" href="/css/page-styles/admin-panel.css">',
        layout: 'layouts/layout-admin'
    });
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
    res.render('ciudadano/emprendimiento-slug', {
        title: 'Detalles del Emprendimiento',
        style: '<link rel="stylesheet" href="/css/page-styles/emprendimiento.css">'
    });
});

app.get('/emprendimientos', (req, res) => {
    res.render('ciudadano/emprendimientos', {
        title: 'Emprendimientos',
        style: '<link rel="stylesheet" href="/css/page-styles/emprendimientos.css">'
    });
});

app.get('/horario-buses', (req, res) => {
    res.render('ciudadano/horario-buses', {
        title: 'Horarios de Buses',
        style: '<link rel="stylesheet" href="/css/page-styles/horario-buses.css">'
    });
});

app.get('/noticias-anuncios-eventos', (req, res) => {
    res.render('ciudadano/noticias-anuncios-eventos', {
        title: 'Noticias, Anuncios y Eventos',
        style: '<link rel="stylesheet" href="/css/page-styles/noticias-anuncios-eventos.css">'
    });
});

app.get('/sugerencias', (req, res) => {
    res.render('ciudadano/sugerencias', {
        title: 'Quejas y Sugerencias',
        style: '<link rel="stylesheet" href="/css/page-styles/sugerencias.css">'
    });
});

// Emprendedor
app.get('/emprendedor/mi-emprendimiento', (req, res) => {
    res.render('emprendedor/mi-emprendimiento', {
        title: 'Mi Emprendimiento',
        style: '<link rel="stylesheet" href="/css/page-styles/emprendimiento.css">'
    });
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
