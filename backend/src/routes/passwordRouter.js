const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// 비밀번호 확인 라우트
router.post('/verify/:user_id', passwordController.verifyPassword);

module.exports = router;