const simpleOauthModule = require("simple-oauth2");

const sonosOauth = simpleOauthModule.create({
  client: {
    id: process.env.SONOS_CLIENT_ID,
    secret: process.env.SONOS_CLIENT_SECRET
  },
  auth: {
    tokenHost: "https://api.sonos.com",
    tokenPath: "/login/v3/oauth/access",
    authorizePath: "/login/v3/oauth"
  }
});

// Authorization uri definition
const sonosAuthPage = sonosOauth.authorizationCode.authorizeURL({
  redirect_uri: `${process.env.DOMAIN}/sonosAuthCallback`,
  scope: "playback-control-all",
  state: "testState"
});

//const sonosAuthPage = `https://api.sonos.com/login/v3/oauth?client_id=${process.env.SONOS_CLIENT_ID}&response_type=code&state=23dsddsddsa324jk34&scope=playback-control-all&redirect_uri=http%3A%2F%2Flocalhost:3000/sonosAuthCallback`;

const SonosApi = async session => {
  const sonosToken = session.get("sonos_token");
  if (sonosToken) {
    let accessToken = sonosOauth.accessToken.create(sonosToken);

    if (accessToken.expired(300)) {
      try {
        const params = {
          grant_type: "refresh_token"
        };

        accessToken = await accessToken.refresh(params);
      } catch (error) {
        console.log("Error refreshing access token: ", error.message);
      }
    }

    session.set("sonos_token", accessToken.token);
    await session.save();

    return accessToken;
  }

  console.log("no sonos access tokens");
  return null;
};

module.exports = { SonosApi, sonosOauth, sonosAuthPage };
