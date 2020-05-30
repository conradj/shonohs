import withSession from "../lib/session";
import { SpotifyApi, spotifyAuthPage } from "../lib/spotify-connection";
import { discoverBridges } from "../lib/hue-connection";
import { SonosApi, sonosAuthPage } from "../lib/sonos-connection";
import ServiceConnect from "../components/ServiceConnect";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  const errorMessage = "";
  const spotifyApi = await SpotifyApi(req.session);
  const sonosApi = await SonosApi(req.session);
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
    connected: false,
    loginUrl: "",
    badgeClass: "bg-black"
  };

  if (sonosApi) {
    sonosConnection.connected = true;
  } else {
    sonosConnection.loginUrl = sonosAuthPage;
  }

  if (spotifyApi) {
    spotifyConnection.connected = true;
  } else {
    spotifyConnection.loginUrl = spotifyAuthPage();
  }

  const hueCredentials = req.session.get("hue_credentials");
  const hueGroup = req.session.get("hue_entertainment_group");

  if (hueCredentials && hueGroup) {
    hueConnection.connected = true;
  } else {
    const bridges = await discoverBridges();
    if (bridges.length === 0) {
      errorMessage = "No hue bridge found";
    } else {
      hueConnection.loginUrl = `/hueAuth?ip=${bridges[0].ip}`;
    }

    if (bridges.length > 1) {
      errorMessage =
        "More than one hue bridge found, just selected the first one. Multiple bridges not supported yet.";
    }
  }

  return {
    props: { spotifyConnection, hueConnection, sonosConnection, errorMessage }
  };
});

const Connections = ({
  spotifyConnection,
  hueConnection,
  sonosConnection,
  errorMessage
}) => {
  return (
    <div>
      <h1>Connect your services</h1>
      <ServiceConnect connection={sonosConnection}>Sonos</ServiceConnect>
      <ServiceConnect connection={spotifyConnection}>Spotify</ServiceConnect>
      <ServiceConnect connection={hueConnection}>Hue</ServiceConnect>
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  );
};

export default Connections;
