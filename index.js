const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { config } = require('./config/config');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/error.handler');

const app = express();
const port = config.port;

// Configuración de CORS mejorada
const corsOptions = {
  origin: '*', // Permitir todos los orígenes (para desarrollo)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight por 10 minutos
};

app.use(cors(corsOptions));

// Middleware para parsear JSON (aumentar límite para imágenes base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// LOGS DE DEBUG
app.use((req, res, next) => {
  console.log('\n🔵 ============ NUEVA PETICIÓN ============');
  console.log(`📍 ${req.method} ${req.url}`);
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  console.log('=========================================\n');
  next();
});

// Rutas principales
app.get('/', (req, res) => {
  res.send('Hola, bienvenido a mi servidor en Express');
});

app.get('/nueva-ruta', (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

// Configuración de rutas API
routerApi(app);

// Manejo de errores (middlewares)
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});