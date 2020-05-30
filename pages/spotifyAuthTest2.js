//var SpotifyWebApi = require("spotify-web-api-node");
import withSession from "../lib/session";
import { SpotifyApi } from "../lib/spotifyconnection";
import redirect from "nextjs-redirect";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  const spotifyApi = await SpotifyApi(req.session);
  console.log("api", spotifyApi);
  if (spotifyApi) {
    return spotifyApi.getMyCurrentPlayingTrack().then(
      function(data) {
        console.log(data.headers);
        console.log(data.statusCode);
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
  }

  res.writeHead(302, { Location: "/connections" });
  res.end();
  // return {
  //   props: { code: "No spotify conneciton" } // will be passed to the page component as props
  // };
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
