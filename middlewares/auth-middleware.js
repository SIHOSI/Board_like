const jwt = require('jsonwebtoken');
const { Users } = require('../models');

require('dotenv').config();
const env = process.env;

const authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: 'Access Token이 필요합니다.' });
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, env.ACCESS_KEY);
    const user = await Users.findOne({
      where: { userId: decodedAccessToken.userId },
    });
    if (!user) {
      return res.status(401).json({
        errorMessage: '유효한 사용자가 아닙니다.',
      });
    }
    res.locals.user = user;
    // console.log(
    //   '🚀 ~ file: auth-middleware.js:25 ~ authMiddleware ~ res.locals.user:',
    //   res.locals.user
    // );
    // res.locals는 express에서 제공되는 특별한 객체.
    // res.locals에 저장된 변수들은 요청됐을 때만 유효

    next();
  } catch (error) {
    console.log(
      '🚀 ~ file: auth-middleware.js:16 ~ authMiddleware ~ error:',
      error
    );
    res.status(401).json({ message: '유효하지 않은 Access Token입니다.' });
  }
};

module.exports = authMiddleware;
