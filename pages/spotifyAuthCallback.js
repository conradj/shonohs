import withSession from "../lib/session";
import SpotifyApi from "../lib/spotifyApi";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  const spotifyApi = new SpotifyApi();
  const { code } = query;
  try {
    const { access_token, refresh_token } = await spotifyApi.setTokenOnCallback(
      code
    );
    req.session.set("spotify_access_token", access_token);
    req.session.set("spotify_refresh_token", refresh_token);
    await req.session.save();
    res.writeHead(302, { Location: "/" });
    res.end();
  } catch (err) {
    return {
      props: { error: JSON.stringify(err) } // will be passed to the page component as props
    };
  }
  return { props: {} };
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
