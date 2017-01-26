var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var calculatePScore = function(req, res) {
  var {
    companyName,
    companyTwitter,
    ownerName,
    ownerTwitter
  } = req.body;

  var scoreCompanyTwitter = calculateTwitterScore(companyTwitter, companyName);
  var scoreOwnerTwitter = calculateTwitterScore(ownerTwitter, ownerName);

  Promise.all([
    scoreCompanyTwitter,
    scoreOwnerTwitter
  ]).then(function(values) {
    var score = calculateWeightedScore(values, [75, 25]);
    res.render('score', { score });
  });
}

var calculateTwitterScore = function(twitterURL, nameToMatch) {
  if ((/^https:\/\/twitter\.com\/([A-Za-z0-9]+)$/).test(twitterURL)) {
    var username = (/^https:\/\/twitter\.com\/([A-Za-z0-9]+)$/).exec(twitterURL)[1];

    return new Promise(function(resolve, reject) {
      client.get('users/show', { screen_name: username }, function(error, data) {
        if (error) {
          resolve(0);
        }

        var {
          name,
          default_profile_image,
          followers_count,
          verified,
          created_at,
          statuses_count
        } = data;

        var scoreName = name == nameToMatch ? 100 : 0;
        var scoreProfileImage = default_profile_image ? 0 : 100;
        var scoreFollowers = Math.min(Math.sqrt(followers_count * 10), 100);
        var scoreVerified = verified ? 100 : 0;
        var scoreAge = Math.min((Date.now() - Date.parse(created_at)) / (1000 * 60 * 60 * 24 * 365) * 20, 100);
        var scoreStatuses = Math.min(Math.sqrt(statuses_count), 100);

        var values = [
          scoreName,
          scoreProfileImage,
          scoreFollowers,
          scoreVerified,
          scoreAge,
          scoreStatuses
        ];

        var score = calculateWeightedScore(values, [5, 5, 55, 5, 15, 15]);
        resolve(score);
      });
    });
  }
  return 0;
}

var calculateWeightedScore = function(values, weights) {
  return values.map((value, i) => weights[i] * value).reduce((a, b) => a + b) / weights.reduce((a, b) => a + b);
}

module.exports = calculatePScore;
