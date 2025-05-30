const express = require('express');
const router = express.Router();
const { 
    logoutController, 
    loginController, 
    verifyOtpController, 
    changePassword, 
    createUserController,
    forgotPasswordController,
    resetPasswordController,
} = require('../controllers/auth.controller');

router.post('/register', createUserController);
router.post('/login', loginController);
router.post('/verifyotp', verifyOtpController);
router.post('/forgotpassword', forgotPasswordController);
router.put('/resetpassword', resetPasswordController);
router.put('/changePassword', changePassword);
router.post('/logout', logoutController);

module.exports = router;