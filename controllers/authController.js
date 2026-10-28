const { validationResult } = require('express-validator');
const User = require('../models/User');
const { signToken, cookieOptions } = require('../middlewares/auth');

const messages = (req) => validationResult(req).array().map((e) => e.msg);

exports.showRegister = (req, res) =>
  res.render('auth/register', { title: 'Crear cuenta', errors: [], values: {} });

exports.register = async (req, res) => {
  const errors = messages(req);
  const fail = (list) => res.status(422).render('auth/register', { title: 'Crear cuenta', errors: list, values: req.body });
  if (errors.length) return fail(errors);
  let user;
  try {
    user = await User.register(req.body);
  } catch (err) {
    if (err.code === 11000) return fail(['Ese correo o nombre de usuario ya está en uso']);
    throw err;
  }
  res.cookie('token', signToken(user), cookieOptions);
  res.flash('success', `¡Bienvenid@, ${user.username}!`);
  res.redirect('/photos');
};

exports.showLogin = (req, res) =>
  res.render('auth/login', { title: 'Entrar', errors: [], values: {} });

exports.login = async (req, res) => {
  const user = validationResult(req).isEmpty() && (await User.authenticate(req.body.email, req.body.password));
  if (!user)
    return res.status(401).render('auth/login', { title: 'Entrar', errors: ['Correo o contraseña incorrectos'], values: { email: req.body.email } });
  res.cookie('token', signToken(user), cookieOptions);
  res.flash('success', `Hola de nuevo, ${user.username}`);
  res.redirect('/photos');
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.flash('success', 'Sesión cerrada');
  res.redirect('/photos');
};
