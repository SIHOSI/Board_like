const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Posts } = require('../models');

// 게시글 작성 API
router.post('/posts', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { user } = res.locals;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
    }

    const newPost = await Posts.create({
      postTitle: title, // 수정된 부분
      postContent: content,
      UserId: user.userId,
    });

    res.status(201).json({ message: '게시글 작성 완료', newPost });
  } catch (error) {
    console.log('🚀 ~ file: posts.js:23 ~ router.post ~ error:', error);
    res.status(500).json({ message: '게시글 작성 오류' });
  }
});

// 사용자 작성 글 불러오기 API
router.get('/posts/:userId', authMiddleware, async (req, res) => {
  const { user } = res.locals;

  try {
    const posts = await Posts.findAll({
      where: { UserId: user.userId },
    });

    res.status(200).json({ message: '사용자 게시글 조회 완료', posts });
  } catch (error) {
    console.log('🚀 ~ file: posts.js:35 ~ router.get ~ error:', error);
    res.status(500).json({ message: '게시글 조회 오류' });
  }
});

// 모든 글 불러오기 API
router.get('/posts', async (req, res) => {
  try {
    const allPosts = await Posts.findAll();

    res.status(200).json({ message: '모든 글 조회 완료', allPosts });
  } catch (error) {
    console.log('🚀 ~ file: posts.js:50 ~ router.get ~ error:', error);
    res.status(500).json({ message: '모든 글 조회 실패' });
  }
});
module.exports = router;
