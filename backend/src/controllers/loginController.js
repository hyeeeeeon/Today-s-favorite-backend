const loginService = require("../services/loginService");

const login = async (req, res) => {
  const { user_email, user_password } = req.body;

  console.log("로그인 시도:", user_email, user_password);

  if (!user_email || !user_password) {
    return res.status(400).send("이메일과 비밀번호를 모두 입력해주세요.");
  }

  try {
    const user = await loginService.authenticate(user_email, user_password);

    if (user && user.success) {
      res.status(200).send({
        user_id: user.user_id,
        role : user.role,
        // Add other necessary information, but do not include sensitive data like user_password
        message: "로그인이 성공적으로 처리되었습니다.",
      });
    } else {
      res
        .status(401)
        .send(
          "인증에 실패하였습니다. 올바른 사용자 이름과 비밀번호를 입력해주세요."
        );
    }
  } catch (error) {
    console.error("인증 중 오류 발생:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

module.exports = { login };
