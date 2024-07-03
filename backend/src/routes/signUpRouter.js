const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");
const passport = require('passport'); // 추가된 부분
const axios = require('axios');
const querystring = require('querystring');
const signUpService = require('../services/signUpService');

require('dotenv').config();
// 회원가입 또는 로그인
router.post("/signupOrLogin", signUpController.signUpOrLogin);

// 회원가입 이메일 전송
router.post("/auth", signUpController.auth);
router.post("/authcheck", signUpController.emailCheck);

// 회원가입
router.post("/signup", signUpController.signUp);

// 구글 로그인 라우트 추가
router.get('/google', (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`
  url += `&redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}`
  url += '&response_type=code'
  url += '&scope=email profile'    
  res.redirect(url);
});

// 구글 콜백 라우트 추가
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
    try {
      // 토큰 교환
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_LOGIN_REDIRECT_URI,
        grant_type: 'authorization_code'
      }));
  
      const { access_token } = tokenResponse.data;

      // 사용자 정보 가져오기
      const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
      const { name, email } = userInfoResponse.data;

      let user = await signUpService.findUser(email);

      if(user.length === 0){
        let result = await signUpService.googleSign(name,email);
        res.cookie("user_id", result.insertId, { path: '/', secure: false });
        res.cookie("role", 0, { path: '/',  secure: false });
      }else{
        res.cookie("user_id", user[0].user_id, { path: '/',  secure: false });
        res.cookie("role", 0, { path: '/',  secure: false });
      }

      res.redirect('http://localhost:3001');
    }catch(error){
      console.log(error);
    }

});

module.exports = router;