const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    // decoded = jwt.verify(req.headers.token, 'secrets');
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'secrets');

  } catch(e) {
    // debugger;
    return res.status(401).json({msg: 'could not authenticate'});
  }
  User.findById(decoded._id, (err, user) => {
    if (err) {
      return res.status(401).json({msg: 'could not authenticate'});
    }
    if (!user) return res.status(401).json({msg: 'could not authenticate'});

    req.user = user;
    next();
  });
};
