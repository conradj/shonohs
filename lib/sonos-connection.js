const simpleOauthModule = require("simple-oauth2");

const baseUrl = "https://api.ws.sonos.com/control/api/v1";

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

const getGroups = async accessToken => {
  const households = await fetch(`${baseUrl}/households`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  console.log("households", households);
};

module.exports = { SonosApi, sonosOauth, sonosAuthPage };
