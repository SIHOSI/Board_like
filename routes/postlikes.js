const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Posts, PostLikes, Users } = require('../models');

// 게시글 좋아요 API
router.post('/posts/:postId/like', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { user } = res.locals;

  try {
    const post = await Posts.findByPk(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: '해당 게시글을 찾을 수 없습니다.' });
    }

    const existingLike = await PostLikes.findOne({
      where: { PostId: postId, UserId: user.userId },
    });

    if (existingLike) {
      // 이미 좋아요한 글인 경우 좋아요 취소
      await existingLike.destroy();
      await post.decrement('likeCount', { by: 1 }); // likeCount 감소
      res.status(200).json({ message: '게시글 좋아요 취소 완료' });
    } else {
      // 좋아요 추가
      await PostLikes.create({
        PostId: postId,
        UserId: user.userId,
      });
      await post.increment('likeCount', { by: 1 }); // likeCount 증가
      res.status(201).json({ message: '게시글 좋아요 완료' });
    }
  } catch (error) {
    console.log('🚀 ~ file: posts.js:99 ~ router.post ~ error:', error);
    res.status(500).json({ message: '게시글 좋아요 오류' });
  }
});

router.get('/posts/like', authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;

    const likedPosts = await PostLikes.findAll({
      where: { UserId: user.userId },
    });

    const postIds = likedPosts.map((like) => {
      return like.PostId;
    });
    console.log('🚀 ~ file: postlikes.js:61 ~ postIds ~ postIds:', postIds);

    const posts = await Posts.findAll({
      where: { postId: postIds },
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
    });

    res.status(200).json({ message: '좋아요한 게시글 조회 완료', posts });
  } catch (error) {
    console.log('🚀 ~ file: posts.js:124 ~ router.get ~ error:', error);
    res.status(500).json({ message: '좋아요한 게시글 조회 오류' });
  }
});

module.exports = router;
