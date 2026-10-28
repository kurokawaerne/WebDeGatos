const jwt = require('jsonwebtoken');

exports.cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 3600 * 1000,
};

exports.signToken = (u) =>
  jwt.sign({ id: u.id, username: u.username, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Lee el JWT de la cookie en cada petición y deja el usuario en req.user / res.locals.user
exports.attachUser = (req, res, next) => {
  req.user = null;
  try {
    if (req.cookies.token) req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch {
    res.clearCookie('token');
  }
  res.locals.user = req.user;
  next();
};

exports.requireAuth = (req, res, next) => {
  if (req.user) return next();
  res.flash('error', 'Inicia sesión para continuar');
  res.redirect('/login');
};
