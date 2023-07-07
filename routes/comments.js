const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Comments } = require('../models');

// 댓글 목록 조회 API
router.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comments.findAll({
      where: { PostId: postId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ message: '댓글 목록 조회 완료', comments });
  } catch (error) {
    console.log('🚀 ~ file: comments.js:12 ~ router.get ~ error', error);
    res.status(500).json({ message: '댓글 목록 조회 오류' });
  }
});

// 댓글 작성 API
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { user } = res.locals;

  try {
    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    const newComment = await Comments.create({
      content,
      PostId: postId,
      UserId: user.userId,
    });

    res.status(201).json({ message: '댓글 작성 완료', newComment });
  } catch (error) {
    console.log('🚀 ~ file: comments.js:30 ~ router.post ~ error', error);
    res.status(500).json({ message: '댓글 작성 오류' });
  }
});

// 댓글 수정
router.put(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const { user } = res.locals;

    try {
      if (!content) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      }

      const comment = await Comments.findOne({
        where: { id: commentId, PostId: postId, UserId: user.userId },
      });

      if (!comment) {
        return res
          .status(404)
          .json({ message: '해당 댓글을 찾을 수 없습니다.' });
      }

      comment.content = content;
      await comment.save();

      res.status(200).json({ message: '댓글 수정 완료', comment });
    } catch (error) {
      console.log('🚀 ~ file: comments.js:53 ~ router.put ~ error', error);
      res.status(500).json({ message: '댓글 수정 오류' });
    }
  }
);

// 댓글 삭제
router.delete(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { user } = res.locals;

    try {
      const comment = await Comments.findOne({
        where: { id: commentId, PostId: postId, UserId: user.userId },
      });

      if (!comment) {
        return res
          .status(404)
          .json({ message: '해당 댓글을 찾을 수 없습니다.' });
      }

      await comment.destroy();

      res.status(200).json({ message: '댓글 삭제 완료' });
    } catch (error) {
      console.log('🚀 ~ file: comments.js:75 ~ router.delete ~ error', error);
      res.status(500).json({ message: '댓글 삭제 오류' });
    }
  }
);

module.exports = router;
