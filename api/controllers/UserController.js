const request = require('request');
const URL     = require('url');

module.exports = {

  index: function (req, res) {
    return res.send({
      user: req.session.user,
      authenticated: typeof req.session.user !== 'undefined',
    });
  },

  auth: function (req, res) {

    var data = {
      client_secret: sails.config.client_secret,
      client_id: sails.config.client_id,
      grant_type: 'authorization_code',
      redirect_uri: sails.config.redirect_uri,
      code: req.query.code,
      scope: 'likes+comments+relationships',
    };

    var options = {
      uri: 'https://api.instagram.com/oauth/access_token',
      method: 'POST',
      form: data,
    };

    sails.log.info('Login Request ::', URL.format(options));

    var currentRoute = req.route.path;

    request.post(options, function (err, response, body) {
      if (err) return res.serverError(err);

      body = JSON.parse(body);

      if (body.code >= 400) return res.serverError(body.error_message);

      var token = body.access_token;
      var user = body.user;

      req.session.token = token;
      req.session.user = user;

      return res.redirect('/feed');
    });
  },

  logout: function (req, res) {
    req.session.destroy();
    return res.redirect('/');
  },
};
