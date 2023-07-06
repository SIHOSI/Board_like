const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require('dotenv').config();
const env = process.env;

router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // REFRESH TOKEN이 존재할 경우 ACCESS TOKEN 갱신
      const decodedRefreshToken = jwt.verify(refreshToken, env.REFRESH_KEY);
      const userId = decodedRefreshToken.userId;

      const newAccessToken = jwt.sign({ userId: userId }, env.ACCESS_KEY, {
        expiresIn: '1h',
      });

      // ACCESS TOKEN 갱신
      res
        .cookie('accessToken', newAccessToken, { httpOnly: true })
        .json({ message: 'ACCESS TOKEN 갱신.' });
    } else {
      // REFRESH TOKEN이 없을 경우
      const user = await Users.findOne({ where: { nickname: nickname } });

      // 회원 유효성
      if (!user) {
        return res.status(401).json({ message: '닉네임이 존재하지 않습니다.' });
      }

      // 비밀번호 유효성
      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(401).json({ message: '잘못된 비밀번호.' });
      }

      const accessToken = jwt.sign({ userId: user.userId }, env.ACCESS_KEY, {
        expiresIn: '1h',
      });
      const refreshToken = jwt.sign({ userId: user.userId }, env.REFRESH_KEY, {
        expiresIn: '7d',
      });

      res
        .cookie('accessToken', accessToken, { httpOnly: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .json({ message: '로그인됐습니다' });
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js:56 ~ router.post ~ error:', error);
    res.status(500).json({ message: '로그인 오류' });
  }
});

module.exports = router;
