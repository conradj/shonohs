//var SpotifyWebApi = require("spotify-web-api-node");
import withSession from "../lib/session";
import { spotifyApi } from "../lib/spotify-connection";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  // The code that's returned as a query parameter to the redirect URI
  const { code } = query;
  // get errors etc
  // check for errors
  // Retrieve an access token and a refresh token
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);

    console.log("The token expires in " + data.body["expires_in"]);
    console.log("The access token is " + data.body["access_token"]);
    console.log("The refresh token is " + data.body["refresh_token"]);
    req.session.set("spotify_access_token", data.body["access_token"]);
    req.session.set("spotify_refresh_token", data.body["refresh_token"]);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body["access_token"]);
    spotifyApi.setRefreshToken(data.body["refresh_token"]);
    await req.session.save();
    res.writeHead(302, { Location: "/connections" });
    res.end();
  } catch (err) {
    return {
      props: { error: JSON.stringify(err) } // will be passed to the page component as props
    };
  }
});

const SpotifyCallback = ({ error }) => {
  return (
    <div>
      <span>Spotify Callback Error</span>
      <span>{error}</span>
    </div>
  );
};

export default SpotifyCallback;
