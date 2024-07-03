const bcrypt = require('bcrypt');
const { comparePassword } = require('../utils/cryptoUtils');
const pool = require('../../config/databaseSet');

// 로그인 인증 함수
const authenticate = async (user_email, inputPassword) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user WHERE user_email = ?", [user_email]);

    if (rows.length === 0) {
      console.log("사용자를 찾을 수 없음");
      return { success: false, error: "사용자를 찾을 수 없습니다." };
    }

    const user = rows[0];


    // 저장된 해시된 비밀번호와 입력된 비밀번호 비교
    const isMatch = await comparePassword(inputPassword, user.user_password, user.user_salt);

    if (!isMatch) {
      console.log("비밀번호가 일치하지 않음");
      return { success: false, error: "비밀번호가 일치하지 않습니다." };
    }

    console.log("비밀번호 비교 결과:", isMatch);

    // 인증 성공 시 사용자 정보 반환
    return {
      success: true,
      user_id: user.user_id,
      role : user.role
      // 필요한 경우 추가 정보 반환
    };
  } catch (err) {
    console.error("인증 중 오류 발생:", err);
    return { success: false, error: "서버 에러가 발생했습니다." };
  }
};

module.exports = { authenticate };