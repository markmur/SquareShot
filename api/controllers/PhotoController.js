var findUser = function findUser(username) {
  return Instagram.searchUsers(username)
    .then(res => {
      var users = res.data;
      return _.find(users, {
        username: username,
      });
    })
    .catch(err => console.warn(err));
};

var getUser = function getUser(id) {
  return Promise.all([
    Instagram.findUser(id),
    Instagram.user(id),
  ]);
};

module.exports = {

  search: function (req, res) {
    var hashtag = req.query.hashtag;
    var user = req.query.user;

    if (hashtag) {
      Instagram.searchHashtags(hashtag).then(results => res.send(results));
    } else if (user) {
      Instagram.searchUsers(user).then(results => res.send(results));
    }
  },

  popular: function (req, res) {
    Instagram.popular().then(photos => {
      res.send(photos);
    }, err => res.serverError(err));
  },

  feed: function (req, res) {
    var user = req.session.user;

    if (!user) {
      return res.forbidden('You must be logged in to access this page.');
    }

    Instagram.feed(req.session.token, req.param('next_max_id')).then(data => res.send(data));
  },

  liked: function (req, res) {
    Instagram.liked(req.session.token).then(data => {
      res.send(data);
    });
  },

  hashtag: function (req, res) {
    Instagram.hashtag(req.params.hashtag, req.param('next_max_id')).then(response => {
      res.send(response);
    });
  },

  like: function (req, res) {
    Instagram.like(req.param('id'), req.session.token).then(response => {
      return res.ok();
    }, err => {

      console.log(err);
      return res.serverError(err);
    });
  },

  findUser: function (req, res) {
    Instagram.findUser(req.params.id);
  },

  user: function (req, res) {
    var username = req.params.username;
    var id = req.params.id;

    sails.log.debug(req.params);
    sails.log.debug('User Route ::', req.param('username'));

    if (!username) return res.badRequest('Username is required');

    if (id) {
      getUser(user.id).then(array => {
        console.log('get');
        return res.send({
          user: array[0].data,
          data: array[1].data,
        });
      });
    } else {

      Instagram.searchUsers(username)
        .then(response => {
          var users = response.data;
          var user = _.find(users, {
            username: username,
          });

          sails.log.info('User ::', user);

          if (!user) return res.notFound('User not found');

          getUser(user.id).then(array =>
            res.send({
              user: array[0].data,
              data: array[1].data,
            })
          );
        }).catch(err => {
          throw err;
        });
    }
  },
};
