const expree = require('express');
const { register, login, getME, forgotpassword, resetPassword, updateDetails, updatePassword, logout } = require('../controller/auth');

const router = expree.Router();
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getME);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);
router.post('/forgotpassword',  forgotpassword);
router.put('/resetpassword/:resettoken',  resetPassword);

module.exports =  router;