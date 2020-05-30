import withSession from "../lib/session";
import { sonosOauth, sonosAuthPage } from "../lib/sonos-connection";
import ServiceConnect from "../components/ServiceConnect";

const connectionStateTypes = {
  NOT_CONNECTED: 1,
  CONNECTED: 2
};

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  const state = { connectionState: connectionStateTypes.NOT_CONNECTED };
  const { code } = query;

  const sonosConnection = {
    connected: false,
    loginUrl: sonosAuthPage,
    badgeClass: "bg-black"
  };

  if (code) {
    const options = {
      code,
      redirect_uri: "http://localhost:3000/sonosAuthCallback",
      grant_type: "authorization_code"
    };
    try {
      const result = await sonosOauth.authorizationCode.getToken(options);
      try {
        const token = await sonosOauth.accessToken.create(result);
        req.session.set("sonos_token", result);
        await req.session.save();
        res.writeHead(302, { Location: "/connections" });
        res.end();
      } catch (err) {
        console.log("errCreateSonosToken", err);
        return {
          props: {
            message: "Error creating Sonos Token. Try again.",
            sonosConnection
          }
        };
      }
    } catch (err) {
      console.log("errGetSonosToken", err);
      return {
        props: {
          message: "Error getting Sonos Token. Try again.",
          sonosConnection
        }
      };
    }
  } else {
    return { props: { message: "No code. Try again.", sonosConnection } };
  }
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
