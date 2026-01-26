const express = require('express');
const cors = require('cors');
const path = require('path');
const routerApi = require('./routes');
const { config } = require('./config/config');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/error.handler');

const app = express();
const port = config.port;

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS para todos los orígenes (modo desarrollo)
app.use(cors());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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