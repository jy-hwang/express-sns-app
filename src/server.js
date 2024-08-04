const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const connect = require('./config');
const cookieSession = require('cookie-session');

// routers
const commentsRouter = require('./routes/comments.router');
const friendsRouter = require('./routes/friends.router');
const likesRouter = require('./routes/likes.router');
const mainRouter = require('./routes/main.router');
const postsRouter = require('./routes/posts.router');
const profileRouter = require('./routes/profile.router');
const usersRouter = require('./routes/users.router');

const config = require('config');
const serverConfig = config.get('server');
const port = serverConfig.port;

const flash = require('connect-flash');

require('dotenv').config();

//process.env
app.use(
  cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_ENCRYPTION_KEY],
  }),
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = cb => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = cb => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// mongodb connection
connect();

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));
// 파일 업로드 위치 변경
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/posts/:id/comments', commentsRouter);
app.use('/friends', friendsRouter);
app.use('/posts/:id/like', likesRouter);
app.use('/posts', postsRouter);
app.use('/profile/:id', profileRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Error Occurred');
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
