const { comparePassword } = require('../utils/cryptoUtils');
const pool = require('../../config/databaseSet');

class PasswordService {
    async verifyPassword(userId, password) {
        try {
            const connection = await pool.getConnection();

            // 사용자 정보 조회
            const [userRows] = await connection.query(
                "SELECT user_password, user_salt FROM user WHERE user_id = ?", 
                [userId]
            );

            connection.release();

            if (userRows.length === 0) {
                return { success: false, error: "User not found" };
            }

            const { user_password, user_salt } = userRows[0];

            // 출력: 사용자가 입력한 비밀번호, 저장된 비밀번호, 사용된 salt
            console.log(`입력된 비밀번호: ${password}`);
            console.log(`저장된 비밀번호: ${user_password}`);
            console.log(`사용된 salt: ${user_salt}`);

            // 입력된 비밀번호와 저장된 salt를 사용하여 비밀번호 검증
            const isMatch = comparePassword(password, user_password, user_salt);

            if (isMatch) {
                return { success: true, message: "Password verified" };
            } else {
                return { success: false, error: "Incorrect password" };
            }
        } catch (error) {
            console.error("Error verifying password:", error);
            throw error;
        }
    }
}

module.exports = new PasswordService();