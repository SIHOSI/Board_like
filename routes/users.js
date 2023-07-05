const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../models');

// 회원가입 API
router.post('/signup', async (req, res) => {
  const { nickname, password } = req.body;

  try {
    // 값이 비어있을 때
    if (!nickname || !password) {
      return res
        .status(401)
        .json({ message: '닉네임과 비밀번호를 입력해주세요.' });
    }

    // 닉네임 유효성
    const user = await Users.findOne({
      where: { nickname: nickname },
    });
    if (!user) {
      return res.status(401).json({ message: '이미 존재하는 닉네임.' });
    }

    // 비밀번호 유효성
    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(401).json({
        message: '비밀번호는 5글자 이상이며 특수문자를 포함해야 합니다.',
      });
    }

    // 비밀번호 암호화
    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      nickname: nickname,
      password: hasedPassword,
    });

    res.status(201).json({ message: '회원가입 완료', newUser });
  } catch (error) {
    console.log('🚀 ~ file: users.js:45 ~ router.post ~ error:', error);
    res.status(500).json({ message: '회원가입 오류' });
  }
});

module.exports = router;
