const simpleOauthModule = require("simple-oauth2");

const baseUrl = "https://api.ws.sonos.com/control/api/v1";
const config = {
  client: {
    id: process.env.SONOS_CLIENT_ID,
    secret: process.env.SONOS_CLIENT_SECRET
  },
  auth: {
    tokenHost: "https://api.sonos.com",
    tokenPath: "/login/v3/oauth/access",
    authorizePath: "/login/v3/oauth"
  }
};

export default class {
  constructor() {
    this.client = simpleOauthModule.create(config);
    this.connection = {
      connected: false,
      token: ""
    };
    this.authorizationUri = this.client.authorizationCode.authorizeURL({
      redirect_uri: `${process.env.DOMAIN}/sonosAuthCallback`,
      scope: "playback-control-all",
      state: "testState"
    });
  }

  async setTokenOnCallback(code) {
    const options = {
      code,
      redirect_uri: `${process.env.DOMAIN}/sonosAuthCallback`,
      grant_type: "authorization_code"
    };

    try {
      const token = await this.client.authorizationCode.getToken(options);
      return token;
    } catch (err) {
      console.error("errGetSonosToken", err);
      return null;
    }
  }

  async refreshToken(accessTokenId) {
    const accessToken = await this.client.accessToken.create(accessTokenId);
    if (accessToken.expired(300)) {
      console.info("sonos token expiring soon, refreshing");
      try {
        const params = {
          grant_type: "refresh_token"
        };

        token = await accessToken.refresh(params);
        return token;
      } catch (error) {
        console.error("Error refreshing access token: ", error.message);
        return null;
      }
    }

    return accessToken;
  }

  async connect(sonosToken) {
    if (!sonosToken) return false;
    const accessToken = await this.refreshToken(sonosToken);
    this.token = accessToken.token;
    this.connection.token = accessToken.token;
    if (!this.token) {
      console.error("no valid access token even after refresh");
      return false;
    }

    return true;
  }

  getData = async endpoint => {
    if (this.connection.token) {
      try {
        console.info(`${endpoint} sonos get data`);
        const response = await fetch(`${baseUrl}${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.connection.token.access_token}`
          }
        });
        const data = await response.json();
        console.info(`${endpoint} sonos get data succeeded`);
        return data;
      } catch (err) {
        console.error(`${endpoint} error when getting sonos data at`, err);
      }
    } else {
      console.error(`${endpoint} Can't get sonos data - no token available`);
    }
    return null;
  };

  getHouseholds = async () => {
    const data = await this.getData("/households");
    return data.households;
  };

  getFirstHousehold = async () => {
    const households = await this.getHouseholds();
    return households[0];
  };

  getGroups = async householdId => {
    if (!householdId) {
      const firstHousehold = await this.getFirstHousehold();
      householdId = firstHousehold.id;
    }
    return await this.getData(`/households/${householdId}/groups`);
  };

  getPlaybackMetadata = async groupId => {
    return await this.getData(`/groups/${groupId}/playbackMetadata`);
  };

  getPlaybackStatus = async groupId => {
    return await this.getData(`/groups/${groupId}/playback`);
  };

  subscribe = async endpoint => {
    if (this.connection.token) {
      try {
        console.info(`${endpoint} sonos subscribe`);
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.connection.token.access_token}`
          }
        });
        const data = await response;
        console.info(`${endpoint} sonos subscribe succeeded`, data);
        return data;
      } catch (err) {
        console.error(`${endpoint} error when getting sonos subscription`, err);
      }
    } else {
      console.error(`${endpoint} Can't sonos subscribe - no token available`);
    }
    return null;
  };
  subscribeToPlayback = async groupId => {
    return await this.subscribe(
      `/groups/${groupId}/playbackMetadata/subscription`
    );
  };
}
