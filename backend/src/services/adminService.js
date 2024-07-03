const pool = require('../../config/databaseSet');
const dotenv = require('dotenv');

dotenv.config();

class AdminService {
    async verifyAdminPassword(userId, inputPassword) {
        try {
            const connection = await pool.getConnection();
            
            // 사용자 정보 조회
            const [userRows] = await connection.query(
                "SELECT role FROM user WHERE user_id = ?",
                [userId]
            );

            connection.release();

            if (userRows.length === 0) {
                return { success: false, error: "User not found" };
            }

            const { role } = userRows[0];

            // 역할 검증
            if (role !== 1) {
                return { success: false, error: "Unauthorized access" };
            }

            // 환경 변수에서 관리자 비밀번호 가져오기
            const adminPassword = process.env.ADMIN_PASSWORD;

            // 입력된 비밀번호와 관리자 비밀번호 평문 비교
            if (inputPassword !== adminPassword) {
                return { success: false, error: "Admin password does not match" };
            }

            return { success: true, message: "Admin login successful" };
        } catch (error) {
            console.error("Error verifying admin password:", error);
            throw error;
        }
    }
}

module.exports = new AdminService();