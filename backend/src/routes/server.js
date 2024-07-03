const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const session = require('express-session');
const signUpRouter = require("./signUpRouter");
const loginRouter = require("./loginRouter");
const logoutRouter = require("./logoutRouter");
const mypageRouter = require("./mypageRouter");
const resetPasswordRouter = require("./resetPasswordRouter");
const passwordRouter = require('./passwordRouter');
const adminRouter = require('./adminRouter');

// 환경 변수 설정
dotenv.config({ path: './src/routes/.env' });

const app = express();


// CORS 설정
app.use(cors());

// JSON 파싱을 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

// Passport 초기화 및 세션 사용
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/sign", signUpRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/mypage", mypageRouter);
app.use('/admin', adminRouter);
app.use("/", resetPasswordRouter);
app.use('/password', passwordRouter);

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});