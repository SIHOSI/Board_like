const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require('dotenv').config();
const env = process.env;

// 액세스 토큰 발급
const generateAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, env.ACCESS_KEY, {
    expiresIn: '1h',
  });
};

// 리프레시 토큰 발급
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, env.REFRESH_KEY, {
    expiresIn: '7d',
  });
};

router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const { refreshToken } = req.cookies;

    // Case 1: 처음 로그인하는 경우
    if (!refreshToken) {
      const user = await Users.findOne({ where: { nickname: nickname } });
      res.clearCookie('refreshToken');

      console.log('1');
      // 회원 유효성
      if (!user) {
        return res.status(401).json({ message: '닉네임이 존재하지 않습니다.' });
      }

      // 비밀번호 유효성
      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(401).json({ message: '잘못된 비밀번호.' });
      }

      const accessToken = generateAccessToken(user.userId);
      const refreshToken = generateRefreshToken(user.userId);

      return res
        .cookie('accessToken', accessToken, { httpOnly: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .json({ message: '로그인되었습니다.' });
    }

    // Case 2: Access Token과 Refresh Token 모두 만료된 경우
    try {
      jwt.verify(refreshToken, env.REFRESH_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decodedRefreshToken = jwt.decode(refreshToken);
        const userId = decodedRefreshToken.userId;

        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = generateRefreshToken(userId);

        return res
          .cookie('accessToken', newAccessToken, { httpOnly: true })
          .cookie('refreshToken', newRefreshToken, { httpOnly: true })
          .json({ message: 'ACCESS TOKEN과 REFRESH TOKEN이 갱신되었습니다.' });
      }
    }

    // Case 3: Access Token은 만료됐지만 Refresh Token은 유효한 경우
    try {
      jwt.verify(req.cookies.accessToken, env.ACCESS_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decodedRefreshToken = jwt.decode(refreshToken);
        const userId = decodedRefreshToken.userId;

        const newAccessToken = generateAccessToken(userId);

        return res
          .cookie('accessToken', newAccessToken, { httpOnly: true })
          .json({ message: 'ACCESS TOKEN이 갱신되었습니다.' });
      }
    }

    // Case 4: Access Token은 유효하지만 Refresh Token은 만료된 경우
    try {
      jwt.verify(refreshToken, env.REFRESH_KEY);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const decodedAccessToken = jwt.decode(req.cookies.accessToken);
        const userId = decodedAccessToken.userId;

        const newRefreshToken = generateRefreshToken(userId);

        return res
          .cookie('refreshToken', newRefreshToken, { httpOnly: true })
          .json({ message: 'REFRESH TOKEN이 갱신되었습니다.' });
      }
    }

    // Case 5: Access Token과 Refresh Token 모두 유효한 경우
    if (refreshToken) {
      const decodedAccessToken = jwt.decode(req.cookies.accessToken);
      const userId = decodedAccessToken.userId;
      console.log('5');
      res.status(201).json({
        userId,
        message: 'ACCESS TOKEN과 REFRESH TOKEN이 모두 유효합니다.',
      });
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js:56 ~ router.post ~ error:', error);
    res.status(500).json({ message: '로그인 오류' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: '로그아웃되었습니다.' });
});

module.exports = router;
