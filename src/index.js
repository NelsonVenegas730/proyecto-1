// 🔐 Variables de entorno
require('dotenv').config(); // esto siempre primero

// ⚙️ Dependencias
const bcrypt = require('bcrypt');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');


// 📦 Inicializar app y config
const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' }); // carpeta temporal para imágenes

// 💾 Sesiones
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// 🌐 Conexión a la base de datos
const connectDB = require('./db/mongoose');
connectDB()
.then(() => console.log('BD CONECTADA'))
.catch(err => console.error(err));

// 🧠 Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const authMiddleware = require('./middleware/authMiddleware');

// 🎨 Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout-default');

// 🗂️ Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 📂 Rutas

const businessRoutes = require('./modules/business/businessRoute');
const businessController = require('./modules/business/businessController');
app.use('/api/businesses', businessRoutes);

// 🏠 Página principal
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Inicio',
    style: '<link rel="stylesheet" href="/css/page-styles/inicio.css">'
  });
});

// 🔐 Autenticación
const userRoutes = require('./modules/user/userRoute');
app.use('/auth', userRoutes);

// 🛠️ Administrador
app.get('/admin/aprobaciones', authMiddleware.authorizeRoleAccess(['administrador']), (req, res) => {
  res.render('administrador/admin-aprobaciones', {
    title: 'Gestionar Contenido',
    style: '<link rel="stylesheet" href="/css/page-styles/admin-aprobaciones.css">',
    layout: 'layouts/layout-admin'
  });
});

app.get('/admin/tiquetes', authMiddleware.authorizeRoleAccess(['administrador']), (req, res) => {
  res.render('administrador/admin-tiquetes', {
    title: 'Gestionar Tiquetes de Soporte',
    style: '<link rel="stylesheet" href="/css/page-styles/admin-tiquetes.css">',
    layout: 'layouts/layout-admin'
  });
});

app.get('/admin/usuarios', authMiddleware.authorizeRoleAccess(['administrador']), (req, res) => {
  res.render('administrador/admin-usuarios', {
    title: 'Gestionar Usuarios',
    style: '<link rel="stylesheet" href="/css/page-styles/admin-usuarios.css">',
    layout: 'layouts/layout-admin'
  });
});

app.get('/admin/panel-administrador', authMiddleware.authorizeRoleAccess(['administrador']), (req, res) => {
  res.render('administrador/panel-administrador', {
    title: 'Panel de Administrador',
    style: '<link rel="stylesheet" href="/css/page-styles/admin-panel.css">',
    layout: 'layouts/layout-admin'
  });
});

// 👥 Ciudadano
app.get('/emprendimiento/:id', authMiddleware.authorizeRoleAccess(['ciudadano']), businessController.getBusinessById);
app.get('/emprendimientos', authMiddleware.authorizeRoleAccess(['ciudadano']), businessController.getAllBusinesses);

app.get('/horario-buses', authMiddleware.authorizeRoleAccess(['ciudadano']), (req, res) => {
  res.render('ciudadano/horario-buses', {
    title: 'Horarios de Buses',
    style: '<link rel="stylesheet" href="/css/page-styles/horario-buses.css">'
  });
});

app.get('/noticias-anuncios-eventos', authMiddleware.authorizeRoleAccess(['ciudadano']), (req, res) => {
  res.render('ciudadano/noticias-anuncios-eventos', {
    title: 'Noticias, Anuncios y Eventos',
    style: '<link rel="stylesheet" href="/css/page-styles/noticias-anuncios-eventos.css">'
  });
});

app.get('/sugerencias', authMiddleware.authorizeRoleAccess(['ciudadano']), (req, res) => {
  res.render('ciudadano/sugerencias', {
    title: 'Quejas y Sugerencias',
    style: '<link rel="stylesheet" href="/css/page-styles/sugerencias.css">'
  });
});

// 💼 Emprendedor
app.get('/emprendedor/mi-emprendimiento/:id', authMiddleware.authorizeRoleAccess(['emprendedor']), businessController.getBusinessByUser);

// 📝 Formularios
app.get('/form/form-anuncio-evento-noticia', authMiddleware.authorizeRoleAccess(['ciudadano', 'administrador']), (req, res) => {
  res.render('formularios/form-anuncio-evento-noticia', {
    title: 'Crear nuevo Anuncio / Evento / Noticia',
    layout: 'layouts/layout-form'
  });
});

app.get('/form/form-tiquete', authMiddleware.authorizeRoleAccess(['ciudadano', 'administrador']), (req, res) => {
  res.render('formularios/form-tiquete', {
    title: 'Nuevo Tiquete de Soporte',
    layout: 'layouts/layout-form'
  });
});

app.use((req, res) => {
  res.status(404).render('error/404-not-found', {
    title: '404 Página no encontrada',
    layout: 'layouts/layout-error',
  });
})

// 🚀 Arrancar servidor
app.listen(port, () => {
  console.log(`Servidor encendido en http://localhost:${port}`);
});

// 🔽 POSTs (formularios)

// Registrar emprendimiento
app.post('/registrar-emprendimiento', upload.single('imagen'), (req, res) => {
  const { titulo, descripcion, direccion } = req.body;
  const imagen = req.file ? req.file.filename : null;
  console.log(`Título: ${titulo}, Descripción: ${descripcion}, Dirección: ${direccion}, Imagen: ${imagen}`);
  res.redirect('/emprendedor/mi-emprendimiento');
});

// Editar emprendimiento
app.post('/editar-emprendimiento', upload.single('imagen'), (req, res) => {
  const { titulo, descripcion, direccion } = req.body;
  const imagen = req.file ? req.file.filename : null;
  console.log(`Título: ${titulo}, Descripción: ${descripcion}, Dirección: ${direccion}, Imagen: ${imagen}`);
  res.json({
    success: true,
    nuevaImagenUrl: imagen ? `/uploads/${imagen}` : null
  });
});