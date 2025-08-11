// 🔐 Variables de entorno
require('dotenv').config(); // esto siempre primero

// ⚙️ Dependencias
const bcrypt = require('bcrypt');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const path = require('path');


// 📦 Inicializar app y config
const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' }); // carpeta para imágenes

// 💾 Sesiones
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // o la conexión que uses
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 * 7 // 7 días de duración
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
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
app.use(authMiddleware.attachUserData);
app.use(authMiddleware.noCache);

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
const adminRoutes = require('./modules/administrator/adminRoute');
const adminController = require('./modules/administrator/adminController');
app.use('/admin', adminRoutes);

const userRoutes = require('./modules/user/userRoute');
const userController = require('./modules/user/userController');
app.use('/auth', userRoutes);

const passwordResetTokenRoutes = require('./modules/password_reset_token/passwordResetTokenRoute');
app.use('/auth/password-reset', passwordResetTokenRoutes);

const businessRoutes = require('./modules/business/businessRoute');
const businessController = require('./modules/business/businessController');
app.use('/api/businesses', businessRoutes);

const announcementRoutes = require('./modules/announcement/announcementRoute');
const announcementController = require('./modules/announcement/announcementController');
const announcementService = require('./modules/announcement/announcementService');
app.use('/api/announcement', announcementRoutes);

const supportTicketRoutes = require('./modules/support_ticket/ticketRoute');
const supportTicketController = require('./modules/support_ticket/ticketController');
app.use('/api/support-tickets', supportTicketRoutes);

const busScheduleRoutes = require('./modules/bus_schedule/busRoute');
const busScheduleController = require('./modules/bus_schedule/busController');
app.use('/api/bus-schedules', busScheduleRoutes);

// 🏠 Página principal
app.get('/', authMiddleware.attachUserData, authMiddleware.redirectFromLanding(), async (req, res) => {
  try {
    const anuncio = await announcementService.getLatestApprovedAnnouncement();

    res.render('index', {
      title: 'Inicio',
      style: '<link rel="stylesheet" href="/css/page-styles/inicio.css">',
      user: req.session.user || null,
      anuncio
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la página de inicio');
  }
});

// 🔐 Autenticación

app.get('/auth/inicio-sesion', (req, res) => {
  res.render('autenticacion/inicio-sesion', {
    title: 'Iniciar Sesión',
    layout: 'layouts/layout-auth'
  });
});

app.get('/auth/registrarse', (req, res) => {
  res.render('autenticacion/registrarse', {
    title: 'Registrarse',
    layout: 'layouts/layout-auth'
  });
});

app.get('/auth/recuperar-password', (req, res) => {
  res.render('autenticacion/recuperar-password', {
    title: 'Recuperar Contraseña',
    layout: 'layouts/layout-auth',
    message: '',
    error: ''
  });
});

app.get('/auth/cambiar-password', (req, res) => {
  const token = req.query.token
  res.render('autenticacion/cambiar-password', {
    title: 'Modificar Contraseña',
    layout: 'layouts/layout-auth',
    token
  })
})

app.get('/auth/registrar-emprendimiento', (req, res) => {
  res.render('autenticacion/registrar-emprendimiento', {
    title: 'Registrar Emprendimiento',
    layout: 'layouts/layout-auth'
  });
});

app.get('/auth/perfil', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['ciudadano', 'emprendedor', 'administrador']), (req, res) => {
  res.render('autenticacion/perfil', {
    title: 'Perfil',
    style: '<link rel="stylesheet" href="/css/page-styles/perfil.css">',
    user: req.session.user || null
  });
});

// 🛠️ Administrador
app.get('/admin/gestion-contenido', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['administrador']), adminController.getManagementContent);

app.get('/admin/tiquetes', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['administrador']), supportTicketController.getAllTicketsAdmin)

app.get('/admin/usuarios', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['administrador']), userController.getAllUsersController);

app.get('/admin/panel-administrador', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['administrador']), (req, res) => {
  res.render('administrador/panel-administrador', {
    title: 'Panel de Administrador',
    style: '<link rel="stylesheet" href="/css/page-styles/admin-panel.css">',
    layout: 'layouts/layout-admin'
  });
});

// 👥 Ciudadano
app.get('/emprendimiento/:id', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['ciudadano', 'administrador']), businessController.getBusinessById);
app.get('/emprendimientos', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['ciudadano']), businessController.getAllBusinesses);

app.get('/horario-buses', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['ciudadano']), busScheduleController.getAllBusSchedules);

app.get('/noticias-anuncios-eventos', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['ciudadano', 'emprendedor']), announcementController.getAllAnnouncements);

app.get('/sugerencias', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['ciudadano']), supportTicketController.getAllTickets);

// 💼 Emprendedor
app.get('/emprendedor/mi-emprendimiento/:id', authMiddleware.authorizeRoleAccess(['emprendedor']), businessController.getBusinessByUser);

// 📝 Formularios
app.get('/form/form-anuncio-evento-noticia', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['ciudadano', 'administrador', 'emprendedor']), (req, res) => {
  res.render('formularios/form-anuncio-evento-noticia', {
    title: 'Crear nuevo Anuncio / Evento / Noticia',
    layout: 'layouts/layout-form',
    user: req.session.user || null
  });
});

app.get('/form/form-tiquete', authMiddleware.attachUserData, authMiddleware.authorizeRoleAccess(['ciudadano', 'administrador']), (req, res) => {
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