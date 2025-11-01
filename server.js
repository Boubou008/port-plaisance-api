/**
 * @file Entry point de l'application serveur (Express).
 * @module server
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { connectDB } = require('./src/config/db');
const { ensureAuth } = require('./src/middleware/auth');
const engine = require('ejs-mate');

const app = express();
const PORT = process.env.PORT || 3000;

// DB
connectDB();

// Templating
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middlewares globaux
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Sessions 
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8h
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

// Expose session aux vues
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.session?.user || null;
  next();
});

// 👉 rendre la session dispo dans EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.session?.user || null;
  next();
});

// Swagger (doc API)
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger', 'openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes API
app.use('/api', require('./src/routes/api/auth.routes'));
app.use('/api/catways', require('./src/routes/api/catways.routes'));
app.use('/api/users', require('./src/routes/api/users.routes'));

// Routes Web
app.use('/', require('./src/routes/web/public.routes'));
app.use('/dashboard', ensureAuth, require('./src/routes/web/dashboard.routes'));
app.use('/catways', ensureAuth, require('./src/routes/web/catways.web.routes'));
app.use('/reservations', ensureAuth, require('./src/routes/web/reservations.web.routes'));
app.use('/users', ensureAuth, require('./src/routes/web/users.web.routes'));

// 404
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).render('404', { title: '404' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
