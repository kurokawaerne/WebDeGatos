const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/photoController');
const { requireAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const rules = [
  body('title').trim().notEmpty().withMessage('Ponle un título a la foto')
    .isLength({ max: 80 }).withMessage('El título admite hasta 80 caracteres'),
  body('catName').trim().isLength({ max: 40 }).withMessage('El nombre del gato admite hasta 40 caracteres'),
  body('description').trim().isLength({ max: 500 }).withMessage('La descripción admite hasta 500 caracteres'),
];

router.get('/', ctrl.index);
router.get('/new', requireAuth, ctrl.newForm);
router.post('/', requireAuth, upload, rules, ctrl.create);
router.get('/:id', ctrl.show);
router.get('/:id/edit', requireAuth, ctrl.editForm);
router.put('/:id', requireAuth, upload, rules, ctrl.update);
router.delete('/:id', requireAuth, ctrl.destroy);

module.exports = router;
