const session = require('express-session');

// 세션 미들웨어 설정
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // 환경변수 설정 추가
  resave: false,
  saveUninitialized: false
});

// 인증 미들웨어 함수 (인증 검사를 우회하도록 수정)
const authenticateSession = (req, res, next) => {
  next(); // 인증 검사를 우회하고 다음 미들웨어로 넘어가게 설정
};

module.exports = {
  sessionMiddleware,
  authenticateSession
};