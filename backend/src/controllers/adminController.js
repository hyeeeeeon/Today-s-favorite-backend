const adminService = require('../services/adminService');

class AdminController {
    async login(req, res) {
        const { user_id } = req.params;
        const { admin_password } = req.body;

        try {
            if (!admin_password) {
                return res.status(400).json({ success: false, error: "Password is required" });
            }

            const result = await adminService.verifyAdminPassword(user_id, admin_password);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(401).json(result);
            }
        } catch (error) {
            console.error("Error during admin login:", error);
            return res.status(500).json({ success: false, error: "Server error" });
        }
    }
}

module.exports = new AdminController();
