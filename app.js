const express = require('express');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users.js');
const authRouter = require('./routes/auth.js');
const postRouter = require('./routes/posts.js');
// const commentRouter = require('./routes/comments.js');
const postlikeRouter = require('./routes/postlikes.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [usersRouter, authRouter, postlikeRouter, postRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
