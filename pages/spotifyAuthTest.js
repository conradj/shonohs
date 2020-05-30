//var SpotifyWebApi = require("spotify-web-api-node");
import withSession from "../lib/session";
import { spotifyApi } from "../lib/spotifyconnection";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  console.log(req.session.get("spotify_access_token"));
  console.log(req.session.get("spotify_refresh_token"));
  spotifyApi.setAccessToken(req.session.get("spotify_access_token"));
  spotifyApi.setRefreshToken(req.session.get("spotify_refresh_token"));

  // return spotifyApi.getMyCurrentPlayingTrack().then(
  //   function(data) {
  //     console.log(data.body);
  //     return {
  //       props: { code: JSON.stringify(data.body), error: "" } // will be passed to the page component as props
  //     };
  //   },
  //   function(err) {
  //     return {
  //       props: { code: "23232", error: JSON.stringify(err) } // will be passed to the page component as props
  //     };
  //   }
  // );

  return spotifyApi.refreshAccessToken().then(
    function(data) {
      console.log("The access token has been refreshed!");

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      return spotifyApi.getMyCurrentPlayingTrack().then(
        function(data) {
          console.log(data.body);
          return {
            props: { code: JSON.stringify(data.body), error: "" } // will be passed to the page component as props
          };
        },
        function(err) {
          return {
            props: { code: "23232", error: JSON.stringify(err) } // will be passed to the page component as props
          };
        }
      );
    },
    function(err) {
      console.log("Could not refresh access token", err);
    }
  );
});

const NowPlaying = ({ code, error }) => {
  return (
    <div>
      <span>{code}</span>
      <span>{error}</span>
    </div>
  );
};

export default NowPlaying;
