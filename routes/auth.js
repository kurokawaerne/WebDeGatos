const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');

const registerRules = [
  body('username').trim().isLength({ min: 3, max: 20 }).withMessage('El usuario debe tener entre 3 y 20 caracteres'),
  body('email').trim().isEmail().withMessage('Escribe un correo válido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
];
const loginRules = [body('email').trim().isEmail(), body('password').notEmpty()];

router.get('/register', ctrl.showRegister);
router.post('/register', registerRules, ctrl.register);
router.get('/login', ctrl.showLogin);
router.post('/login', loginRules, ctrl.login);
router.post('/logout', ctrl.logout);

module.exports = router;
