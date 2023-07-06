const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Posts } = require('../models');

// 게시글 작성 API
router.post('/posts', authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
    }

    const newPost = await Posts.create({
      title: title,
      content: content,
      userId: req.locals.user.userId,
    });

    res.status(201).json({ message: '게시글 작성 완료', newPost });
  } catch (error) {
    console.log('🚀 ~ file: posts.js:23 ~ router.post ~ error:', error);
    res.status(500).json({ message: '게시글 작성 오류' });
  }
});

// 사용자 작성 글 불러오기 API
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await Posts.findAll({
      where: { userId: req.locals.user.userId },
    });

    res.status(200).json({ message: '사용자 게시글 조회 완료', posts });
  } catch (error) {
    console.log('🚀 ~ file: posts.js:35 ~ router.get ~ error:', error);
    res.status(500).json({ message: '게시글 조회 오류' });
  }
});

module.exports = router;
