require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/database');
const flash = require('./middlewares/flash');
const { attachUser } = require('./middlewares/auth');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const isProd = process.env.NODE_ENV === 'production';
const app = express();

app.set('trust proxy', 1); // Render está detrás de un proxy HTTPS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ['https://fonts.gstatic.com'],
      'upgrade-insecure-requests': isProd ? [] : null,
    },
  },
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method')); // formularios con ?_method=PUT / DELETE
app.use(expressLayouts);
app.use(flash);
app.use(attachUser);

app.get('/', (req, res) => res.redirect('/photos'));
app.use('/', require('./routes/auth'));
app.use('/photos', require('./routes/photos'));
app.use(notFound);
app.use(errorHandler);

if (!process.env.JWT_SECRET) throw new Error('Falta JWT_SECRET en las variables de entorno');
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`WebDeGatos en http://localhost:${PORT}`)))
  .catch((err) => { console.error(err); process.exit(1); });
