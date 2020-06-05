import Head from "next/head";
import Link from "next/link";
import withSession from "../lib/session";
import ServiceConnect from "../components/ServiceConnect";
import SpotifyApi from "../lib/spotifyApi";
import SonosApi from "../lib/sonosApi";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  const sonosToken = req.session.get("sonos_token");
  const spotifyAccessToken = req.session.get("spotify_access_token");
  const spotifyRefreshToken = req.session.get("spotify_refresh_token");
  const spotifyApi = new SpotifyApi();
  const spotifyConnected = await spotifyApi.connect(
    spotifyAccessToken,
    spotifyRefreshToken
  );
  const sonosApi = new SonosApi();
  const sonosConnected = await sonosApi.connect(sonosToken);

  const spotifyConnection = {
    connected: spotifyConnected,
    loginUrl: spotifyApi.authorizationUri,
    badgeClass: "bg-green-500"
  };
  const hueConnection = {
    connected: false,
    loginUrl: "",
    badgeClass: "bg-orange-400"
  };

  const sonosConnection = {
    connected: sonosConnected,
    loginUrl: sonosApi.authorizationUri,
    badgeClass: "bg-black"
  };
  return {
    props: {
      spotifyConnection,
      hueConnection,
      sonosConnection,
      errorMessage: ""
    }
  };
});

const Connections = ({
  spotifyConnection,
  hueConnection,
  sonosConnection,
  errorMessage
}) => {
  return (
    <div className="container">
      <Head>
        <title> 💡🔊🎶 SHONOHS: Connect your services</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Connect your services</h1>
      <ServiceConnect connection={sonosConnection}>Sonos</ServiceConnect>
      <ServiceConnect connection={spotifyConnection}>Spotify</ServiceConnect>
      <ServiceConnect connection={hueConnection}>Hue</ServiceConnect>
      {errorMessage && <span>{errorMessage}</span>}
      {sonosConnection.connected && (
        <Link href="/playing">
          <a>Now Playing</a>
        </Link>
      )}
    </div>
  );
};

export default Connections;
