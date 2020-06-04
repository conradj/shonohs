import Head from "next/head";
import Link from "next/link";
import withSession from "../lib/session";
import { SpotifyApi, spotifyAuthPage } from "../lib/spotify-connection";
import ServiceConnect from "../components/ServiceConnect";
import SonosApi from "../lib/sonosApi";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  const spotifyApi = await SpotifyApi(req.session);
  const sonosToken = req.session.get("sonos_token");

  const sonosApi = new SonosApi();
  const sonosConnected = await sonosApi.connect(sonosToken);

  const spotifyConnection = {
    connected: false,
    loginUrl: "",
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

  if (spotifyApi) {
    spotifyConnection.connected = true;
  } else {
    spotifyConnection.loginUrl = spotifyAuthPage();
  }

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
