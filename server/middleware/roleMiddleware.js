const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Admin access required' });
  }
};

const moderatorOnly = (req, res, next) => {
  if (req.user && ['admin', 'moderator'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ msg: 'Moderator access required' });
  }
};

module.exports = { adminOnly, moderatorOnly };