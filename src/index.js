const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para guardar las imágenes
const app = express();
const path = require('path');
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/layout-default'); // layout por defecto

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas views de las páginas HTML (views)
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Inicio',
    style: '<link rel="stylesheet" href="/css/page-styles/inicio.css">'
  })
})

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
  const emprendimiento = {
    titulo: 'Joyería Yurusti',
    imagen: 'default.jpeg',
    descripcion: 'Joyería artesanal que ofrece una variedad de productos hechos a mano...',
    direccion: 'Desamparados, San José, Costa Rica, 100 metros Este de la Plaza de Deportes.'
  };

  res.render('emprendedor/mi-emprendimiento', {
    title: 'Mi Emprendimiento',
    style: '<link rel="stylesheet" href="/css/page-styles/emprendimiento.css">',
    emprendimiento
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

// Metodos POST para manejar los formularios

// Autenticación
app.post('/login', (req, res) => {
  const correo = req.body.correo;
  const password = req.body.password;
  const keepSesionActive = req.body.keepSesionActive === 'on';
  console.log(`Correo: ${correo}, Password: ${password}, Mantener sesión activa: ${keepSesionActive}`);
  res.redirect('/'); // Redirigir al inicio después del login
});

app.post('/sign-up', (req, res) => {
    const username = req.body.username;
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const password = req.body.password;
    const isEmprendedor = req.body.isEmprendedor === 'on';
    console.log(`Usuario: ${username}, Nombre: ${nombre}, Apellidos: ${apellidos}, Correo: ${correo}, Contraseña: ${password}, Emprendedor: ${isEmprendedor}`);
    
    if (isEmprendedor) {
        res.redirect('/auth/registrar-emprendimiento'); // Redirigir al registro de emprendimiento
    }
    else {
        res.redirect('/'); // Redirigir al inicio después del registro
    }
});

app.post('/recover-password', (req, res) => {
    const correo = req.body.correo;
    console.log(`Correo para recuperar contraseña: ${correo}`);
    res.redirect('/auth/inicio-sesion'); // Redirigir al inicio de sesión después de la recuperación
})

app.post('/registrar-emprendimiento', upload.single('imagen'), (req, res) => {
  const titulo = req.body.titulo;
  const descripcion = req.body.descripcion;
  const direccion = req.body.direccion;
  const imagen = req.file ? req.file.filename : null;

  console.log(`Título: ${titulo}, Descripción: ${descripcion}, Dirección: ${direccion}, Imagen: ${imagen}`);

  res.redirect('/emprendedor/mi-emprendimiento');
});

app.post('/editar-emprendimiento', upload.single('imagen'), (req, res) => {
  const titulo = req.body.titulo;
  const descripcion = req.body.descripcion;
  const direccion = req.body.direccion;
  const imagen = req.file ? req.file.filename : null;

  console.log(`Título: ${titulo}, Descripción: ${descripcion}, Dirección: ${direccion}, Imagen: ${imagen}`);

  // Guardá en la DB acá...

  res.json({
    success: true,
    nuevaImagenUrl: imagen ? `/uploads/${imagen}` : null
  });
});