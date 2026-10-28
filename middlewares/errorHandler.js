exports.notFound = (req, res, next) =>
  next(Object.assign(new Error('Página no encontrada'), { status: 404 }));

exports.errorHandler = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.flash('error', 'La imagen no puede pasar de 5 MB');
    return res.redirect(req.get('referer') || '/photos');
  }
  const status = err.name === 'CastError' ? 404 : err.status || 500;
  if (status === 500) console.error(err);
  const message = status === 500 ? 'Algo salió mal en el servidor' : status === 404 && err.name === 'CastError' ? 'No encontramos lo que buscas' : err.message;
  res.status(status).render('error', { title: 'Error', status, message });
};
