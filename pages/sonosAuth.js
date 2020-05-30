import withSession from "../lib/session";
import { useRouter } from "next/router";
import { sonosOauth, sonosAuthPage } from "../lib/sonos-connection";
import ServiceConnect from "../components/ServiceConnect";

const connectionStateTypes = {
  NOT_CONNECTED: 1,
  NO_ENTERTAINMENT_GROUP: 2,
  CONNECTED: 3
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
      redirect_uri: "http://localhost:3000/sonosAuth",
      grant_type: "authorization_code"
    };
    try {
      const result = await sonosOauth.authorizationCode.getToken(options);
      try {
        const token = await sonosOauth.accessToken.create(result);
        req.session.set("sonos_token", result);
        await req.session.save();
      } catch (err) {
        console.log("errToken", err);
      }
    } catch (err) {
      console.log("errCode", err);
    }
  } else {
    console.log("no code");
    return { props: { test: "No code", sonosConnection } };
  }
  // Pass data to the page via props
  return { props: { test: "hello", sonosConnection } };

  // if (!req.session.get("hue_credentials")) {
  //   const credentials = await registerHue(ip);
  //   if (credentials) {
  //     req.session.set("hue_credentials", {
  //       address: ip, // wtf
  //       username: credentials.username,
  //       psk: credentials.psk
  //     });
  //   }
  // }

  // const hueCredentials = req.session.get("hue_credentials");

  // if (!hueCredentials) {
  //   state.connectionState = connectionStateTypes.NOT_CONNECTED;
  // } else {
  //   const entertainmentGroup = await getHueEntertainmentGroup(hueCredentials);
  //   if (!entertainmentGroup) {
  //     state.connectionState = connectionStateTypes.NO_ENTERTAINMENT_GROUP;
  //   } else {
  //     req.session.set("hue_entertainment_group", entertainmentGroup);
  //     state.connectionState = connectionStateTypes.CONNECTED;
  //   }
  // }

  // await req.session.save();

  // if (state.connectionState === connectionStateTypes.CONNECTED) {
  //   res.writeHead(302, { Location: "/connections" });
  //   res.end();
  // }

  // return { props: { ip, state } };
});

const SonosAuthentication = ({ test, sonosConnection }) => {
  return (
    <div>
      <h1>Connect to Sonos</h1>
      <h2>{test}</h2>
      <ServiceConnect connection={sonosConnection}>Sonos</ServiceConnect>
    </div>
  );
};

export default SonosAuthentication;
