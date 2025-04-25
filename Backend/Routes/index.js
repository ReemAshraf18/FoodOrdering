const userRoutes = require('./UserRoutes');
const blogRoutes = require('./BlogRoutes');
const followRoutes = require('./FollowRoutes');
const likeRoutes = require('./LikeRoutes');
const commentRoutes = require('./CommentRoutes');
const orderRoutes = require('./OrderRoutes');

module.exports = (app, middleware) => {
  app.use('/api/users', userRoutes(middleware));
  app.use('/api/blogs', blogRoutes(middleware));
  app.use('/api/follows', followRoutes(middleware));
  app.use('/api/likes', likeRoutes(middleware));
  app.use('/api/comments', commentRoutes(middleware));
  app.use('/api/orders', orderRoutes(middleware));
};