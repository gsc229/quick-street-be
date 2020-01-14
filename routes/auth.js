const express = require('express');
const { register, 
    login, 
    logout, 
    getMe, 
    forgotPassword, 
    resetPassword, 
    updateDetails, 
    updatePassword 
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout); //  GET /api/v1/auth/logout
router.get('/me', protect, getMe); // POST /api/v1/auth/me
router.put('/updatedetails', protect, updateDetails); // PUT /api/v1/auth/updatedetails
router.put('/updatepassword', protect, updatePassword); // PUT /api/v1/auth/updatepassword
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);


module.exports = router;
