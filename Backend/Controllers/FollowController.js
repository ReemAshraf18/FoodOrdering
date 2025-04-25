const Follow = require('../Models/Follow');
const Blog = require('../Models/Blog');

const followUser = async (req, res) => {
  try {
    const follow = new Follow({
      follower: req.user.id,
      followed: req.params.id
    });
    await follow.save();
    res.status(201).json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    await Follow.deleteOne({ follower: req.user.id, followed: req.params.id });
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeed = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const follows = await Follow.find({ follower: req.user.id }).select('followed');
    const followedUsers = follows.map(f => f.followed);

    const blogs = await Blog.find({ author: { $in: followedUsers } })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Blog.countDocuments({ author: { $in: followedUsers } });

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { followUser, unfollowUser, getFeed };