const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/logoutController");

router.post("/", logoutController.logout);

// 구글 로그아웃 라우트 추가
router.get('/google/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;