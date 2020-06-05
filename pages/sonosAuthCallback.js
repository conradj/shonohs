import withSession from "../lib/session";
import SonosApi from "../lib/sonosApi";
import ServiceConnect from "../components/ServiceConnect";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  const sonosApi = new SonosApi();
  const { code } = query;
  const sonosConnection = {
    connected: false,
    loginUrl: sonosApi.authorizationUri,
    badgeClass: "bg-black"
  };

  if (!code) {
    return { props: { message: "No code. Try again.", sonosConnection } };
  }

  try {
    const sonosToken = await sonosApi.setTokenOnCallback(code);
    const connected = await sonosApi.connect(sonosToken);
    sonosConnection.connected = connected;
  } catch (err) {
    console.info("errGetSonosToken", err);
    return {
      props: {
        message: "Error getting Sonos Token. Try again.",
        sonosConnection
      }
    };
  }

  try {
    req.session.set("sonos_token", sonosApi.token);
    await req.session.save();
    res.writeHead(302, { Location: "/" });
    res.end();
  } catch (err) {
    console.error("errCreateSonosToken", err);
    return {
      props: {
        message: "Error creating Sonos Token. Try again.",
        sonosConnection
      }
    };
  }

  return { props: {} };
});

const SonosAuthentication = ({ message, sonosConnection }) => {
  return (
    <div>
      <h1>Connect to Sonos</h1>
      <h2>{message}</h2>
      <ServiceConnect connection={sonosConnection}>Sonos</ServiceConnect>
    </div>
  );
};

export default SonosAuthentication;
