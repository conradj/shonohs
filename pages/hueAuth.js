import withSession from "../lib/session";
import { useRouter } from "next/router";
import { registerHue, getHueEntertainmentGroup } from "../lib/hue-connection";

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
  const ip = query.ip;

  if (!req.session.get("hue_credentials")) {
    const credentials = await registerHue(ip);
    if (credentials) {
      req.session.set("hue_credentials", {
        address: ip, // wtf
        username: credentials.username,
        psk: credentials.psk
      });
    }
  }

  const hueCredentials = req.session.get("hue_credentials");

  if (!hueCredentials) {
    state.connectionState = connectionStateTypes.NOT_CONNECTED;
  } else {
    const entertainmentGroup = await getHueEntertainmentGroup(hueCredentials);
    if (!entertainmentGroup) {
      state.connectionState = connectionStateTypes.NO_ENTERTAINMENT_GROUP;
    } else {
      req.session.set("hue_entertainment_group", entertainmentGroup);
      state.connectionState = connectionStateTypes.CONNECTED;
    }
  }

  await req.session.save();

  if (state.connectionState === connectionStateTypes.CONNECTED) {
    res.writeHead(302, { Location: "/connections" });
    res.end();
  }

  return { props: { ip, state } };
});

const HueAuthentication = ({ ip, state, message }) => {
  const router = useRouter();
  const connectHue = ip => {
    router.push(`/hueAuth?ip=${ip}&try=2`);
  };
  return (
    <div>
      <h1>Connect to Hue</h1>
      <h2>
        {state.connectionState ===
          connectionStateTypes.NO_ENTERTAINMENT_GROUP && (
          <>
            <p>
              1. Create an entertainment area in the Settings of your Philips
              Hue App.
            </p>
            <span>2. </span>
          </>
        )}
        Press the link button on your Hue Hub, then click OK
      </h2>
      <button className="btn" onClick={e => connectHue(ip, e)}>
        OK
      </button>
      <h3>Photosensitive Seizure Warning (via Phillips Hue Documentation)</h3>
      <small>
        A very small percentage of people may experience a seizure when exposed
        to certain visual images, including flashing lights or patterns that may
        appear in video games. Even people who have no history of seizures or
        epilepsy may have an undiagnosed condition that can cause these
        “photosensitive epileptic seizures” while watching video with the
        additional light effects.These seizures may have a variety of symptoms,
        including lightheadedness, altered vision, eye or face twitching,
        jerking or shaking of arms or legs, disorientation, confusion, or
        momentary loss of awareness. Seizures may also cause loss of
        consciousness or convulsions that can lead to injury from falling down
        or striking nearby objects. Immediately stop project participation and
        consult a doctor if you experience any of these symptoms. Parents should
        watch for or ask their children about the above symptoms. Children and
        teenagers are more likely than adults to experience these seizures. The
        risk of photosensitive epileptic seizures may be reduced by taking the
        following precautions: Use it in a well-lit room Do not use it if you
        are drowsy or fatigued If you or any of your relatives have a history of
        seizures or epilepsy, consult a doctor before participation.
      </small>
    </div>
  );
};

export default HueAuthentication;
