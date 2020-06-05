import SpotifyWebApi from "spotify-web-api-node";
const scopes = ["user-read-currently-playing", "user-read-playback-state"];

export default class {
  constructor() {
    console.log(`${process.env.DOMAIN}/spotifyAuthCallback`);
    this.client = new SpotifyWebApi({
      redirectUri: `${process.env.DOMAIN}/spotifyAuthCallback`,
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    });
    this.connection = {
      connected: false,
      token: ""
    };
    this.authorizationUri = this.client.createAuthorizeURL(scopes);
  }

  async setTokenOnCallback(code) {
    try {
      const data = await this.client.authorizationCodeGrant(code);
      // console.log("The token expires in " + data.body["expires_in"]);
      // console.log("The access token is " + data.body["access_token"]);
      // console.log("The refresh token is " + data.body["refresh_token"]);
      // console.log("spotify setTokenOnCallback", data);
      const {
        body: { expires_in, access_token, refresh_token }
      } = data;
      // Set the access token on the API object to use it in later calls
      this.client.setAccessToken(access_token);
      this.client.setRefreshToken(refresh_token);
      return { access_token, refresh_token };
    } catch (err) {
      console.error("errGetSpotifyToken", err);
      return null;
    }
  }

  async connect(accessToken, refreshToken) {
    if (!accessToken && !refreshToken) return false;
    this.client.setAccessToken(accessToken);
    this.client.setRefreshToken(refreshToken);

    try {
      const {
        body: { access_token }
      } = await this.client.refreshAccessToken();

      console.info("SpotifyApi token refresh successful", access_token);
      this.client.setAccessToken(access_token);
      return true;
    } catch (err) {
      console.error("SpotifyApi connect error", err);
      return false;
    }
  }
}
