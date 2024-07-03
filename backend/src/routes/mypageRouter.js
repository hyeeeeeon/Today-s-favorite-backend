const express = require('express');
const router = express.Router();
const userController = require('../controllers/mypageController');
const multer = require('multer');

// 파일 업로드 처리를 위한 multer 미들웨어 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 마이 페이지 조회
router.get('/:user_id', userController.getUser.bind(userController));

// 마이 페이지 수정
router.put('/:user_id/modify', userController.modifyUser.bind(userController));

module.exports = router;