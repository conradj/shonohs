const simpleOauthModule = require("simple-oauth2");

// the process.env values are set in .env
const oauth2 = simpleOauthModule.create({
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  auth: {
    tokenHost: "https://api.sonos.com",
    tokenPath: "/login/v3/oauth/access",
    authorizePath: "/login/v3/oauth"
  }
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: "https://" + process.env.PROJECT_DOMAIN + ".glitch.me/callback",
  scope: "playback-control-all",
  state: "testState"
});

export default (req, res) => {
  res.statusCode = 200;
  res.json({ name: "John Doe" });
};
