const userService = require('../services/mypageService');
const { hashedPassword } = require("../utils/cryptoUtils");
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const { access } = require('fs');

class UserController {
  async getUser(req, res) {
    const user_id = req.params.user_id;
    try {
      const userInfo = await userService.getUserInfoByUserId(user_id);
      res.json(userInfo);
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 정보를 가져오는 중 에러 발생" });
    }
  }
  
  async getLikedPosts(req, res) {
    const { user_id } = req.params;

    try {
        console.log(`사용자 ID: ${user_id} - 좋아요 누른 게시물 요청 수신`);
        const likedPosts = await userService.getLikedPosts(user_id);
        console.log("좋아요를 누른 게시물:", likedPosts);
        res.status(200).json(likedPosts);
    } catch (error) {
        console.error("좋아요를 누른 게시물 정보를 가져오는 중 에러 발생:", error);
        res.status(500).json({ error: error.message });
    }
}
  
  async modifyUser(req, res) {
    const user_id = req.params.user_id;
    const { user_nickname, user_password, user_password_confirm, user_intro } = req.body;
  
    if (user_password !== user_password_confirm) {
      return res.status(400).json({ message: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
    }
  
    try {
     
  
      // Modify user info without image
      const updatedUserInfo = await userService.modifyUserInfo(user_id, user_nickname, user_password, user_intro, null);
      return res.json(updatedUserInfo);
    } catch (error) {
      console.error("사용자 정보 수정 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      return res.status(500).json({ message: "사용자 정보 수정 중 에러 발생" });
    }
  }
  
  async modifyUserImage(req, res) {
    const user_id = req.params.user_id;
  
    try {
      let imageFileName = null;
      if (req.file && req.file.buffer) {
        const fileName = `${user_id}_${Date.now()}.png`;
        const filePath = path.join(__dirname, '../../../../front/front/front/public/images/', fileName);
  
        // 이미지를 파일로 저장
        await fs.writeFile(filePath, req.file.buffer);
  
        imageFileName = fileName;
      }
      const updatedUserImage = await userService.modifyUserImage(user_id, imageFileName);
  
      res.json(updatedUserImage);
    } catch (error) {
      console.error("사용자 이미지 수정 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 이미지 수정 중 에러 발생" });
    }
  }
  
  async deleteUser(req, res) {
    const user_id = req.params.user_id;

    try {
      await userService.deleteUserById(user_id);
      res.status(204).end();
    } catch (error) {
      console.error("사용자 삭제 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 삭제 중 에러 발생" });
    }
  }

  async DeleteUserImage(req, res) {

    const before_image_path = req.body.preimage;

    if(before_image_path == 'null' || before_image_path === ''){
      res.status(200).send({access: true});
      return;
    }else{
      const image_path = path.join(__dirname,'../../../../front/front/front/public/', `${before_image_path}`);
    
      await fs.unlink(image_path);
  
      res.status(200).send({access: true})
    }
  }
}

module.exports = new UserController();