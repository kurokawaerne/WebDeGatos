// Mensajes flash guardados en una cookie de vida corta
module.exports = (req, res, next) => {
  res.flash = (type, msg) => res.cookie('flash', JSON.stringify({ type, msg }), { httpOnly: true, maxAge: 15000 });
  res.locals.flash = null;
  if (req.cookies.flash) {
    try { res.locals.flash = JSON.parse(req.cookies.flash); } catch {}
    res.clearCookie('flash');
  }
  next();
};
