import SpotifyWebApi from "spotify-web-api-node";
const scopes = ["user-read-currently-playing", "user-read-playback-state"];

const spotifyApi = new SpotifyWebApi({
  redirectUri: `${process.env.DOMAIN}/${process.env.SPOTIFY_REDIRECT_URI}`,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const SpotifyApi = async session => {
  const accessToken = session.get("spotify_access_token");
  const requestToken = session.get("spotify_refresh_token");

  if (accessToken && requestToken) {
    console.log("refresh spotify access token");
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(requestToken);
    try {
      const refreshToken = await spotifyApi.refreshAccessToken();
      const accessToken = refreshToken.body["access_token"];
      console.log("SpotifyApi token refresh successful");
      spotifyApi.setAccessToken(accessToken);
      session.set("spotify_access_token", accessToken);
      return spotifyApi;
    } catch (err) {
      console.log("SpotifyApi error", err);
      return null;
    }
  }

  console.log("no spotify access tokens");
  return null;
};

const spotifyAuthPage = () => {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
  console.log(authorizeURL);
  //return redirect(authorizeURL);
  return authorizeURL;
};

module.exports = { SpotifyApi, spotifyApi, spotifyAuthPage };
