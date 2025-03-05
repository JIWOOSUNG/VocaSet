const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// 로그인 라우트 추가
router.post('/login', authController.login);

module.exports = router;
