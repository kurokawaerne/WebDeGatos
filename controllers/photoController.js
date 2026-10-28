const { validationResult } = require('express-validator');
const Photo = require('../models/Photo');
const { saveImage, deleteImage } = require('../config/storage');

const httpError = (status, message) => Object.assign(new Error(message), { status });
const fields = ({ title, catName, description }) => ({ title, catName, description });
const messages = (req) => validationResult(req).array().map((e) => e.msg);

const load = async (id) => {
  const photo = await Photo.findById(id).populate('owner', 'username');
  if (!photo) throw httpError(404, 'Foto no encontrada');
  return photo;
};

exports.index = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(24, Math.max(1, parseInt(req.query.limit) || 9));
  const q = String(req.query.q || '').trim();
  const mine = req.query.mine === '1' && Boolean(req.user);
  const result = await Photo.paginate({ q, page, limit, owner: mine ? req.user.id : undefined });
  res.render('photos/index', { title: 'Galería', ...result, q, limit, mine });
};

exports.show = async (req, res) => {
  const photo = await load(req.params.id);
  res.render('photos/show', { title: photo.title, photo });
};

exports.newForm = (req, res) =>
  res.render('photos/form', { title: 'Subir foto', photo: {}, errors: [], editing: false });

exports.create = async (req, res) => {
  const errors = messages(req);
  if (!req.file) errors.push('Elige una imagen (JPG, PNG, WEBP o GIF)');
  if (errors.length)
    return res.status(422).render('photos/form', { title: 'Subir foto', photo: req.body, errors, editing: false });
  const img = await saveImage(req.file);
  const photo = await Photo.create({ ...fields(req.body), imageUrl: img.url, imagePublicId: img.publicId, owner: req.user.id });
  res.flash('success', 'Foto publicada');
  res.redirect('/photos/' + photo.id);
};

exports.editForm = async (req, res) => {
  const photo = await load(req.params.id);
  if (!photo.canEdit(req.user)) throw httpError(403, 'Solo quien subió la foto puede editarla');
  res.render('photos/form', { title: 'Editar foto', photo, errors: [], editing: true });
};

exports.update = async (req, res) => {
  const photo = await load(req.params.id);
  if (!photo.canEdit(req.user)) throw httpError(403, 'Solo quien subió la foto puede editarla');
  const errors = messages(req);
  Object.assign(photo, fields(req.body));
  if (errors.length)
    return res.status(422).render('photos/form', { title: 'Editar foto', photo, errors, editing: true });
  if (req.file) {
    const old = { imageUrl: photo.imageUrl, imagePublicId: photo.imagePublicId };
    const img = await saveImage(req.file);
    photo.imageUrl = img.url;
    photo.imagePublicId = img.publicId;
    await deleteImage(old);
  }
  await photo.save();
  res.flash('success', 'Cambios guardados');
  res.redirect('/photos/' + photo.id);
};

exports.destroy = async (req, res) => {
  const photo = await load(req.params.id);
  if (!photo.canDelete(req.user)) throw httpError(403, 'No tienes permiso para borrar esta foto');
  await deleteImage(photo);
  await photo.deleteOne();
  res.flash('success', 'Foto eliminada');
  res.redirect('/photos');
};
