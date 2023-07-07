// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middlewares/auth-middleware');
// const { Comments } = require('../models');

// // 댓글 목록 조회 API
// router.get('/posts/:postId/comments', async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const comments = await Comments.findAll({
//       where: { postId },
//       order: [['createdAt', 'DESC']],
//     });
//     res.status(201).json(comments, { message: '댓글 목록 조회 성공' });
//   } catch (error) {
//     console.log('🚀 ~ file: comments.js:16 ~ router.get ~ error:', error);
//     res.status(500).json({ message: '댓글목록 조회 실패' });
//   }
// });

// // 댓글 작성 API
// router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { content } = req.body;
//     const { user } = res.locals;

//     if (!content) {
//       return res.status(400).json({ message: '댓글 내용을 입력해주세요' });
//     }

//     const comment = await Comments.create({
//       postId,
//       userId: user.userId,
//       content,
//     });
//     res.status(201).json(comment, { message: '댓글 작성 성공' });
//   } catch (error) {
//     console.log('🚀 ~ file: comments.js:39 ~ router.post ~ error:', error);
//     res.status(500).json({ message: '댓글 작성 실패' });
//   }
// });

// module.exports = router;
