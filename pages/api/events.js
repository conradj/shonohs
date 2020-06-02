import { mutate } from "swr";
import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  res.status(200);
  let latestData = null;
  const headers = JSON.stringify(req.headers);
  //console.log(headers);
  const {
    "x-sonos-type": sonosEventType,
    "x-sonos-namespace": sonosNameSpace,
    "x-sonos-target-type": sonosTargetType,
    "x-sonos-target-value": sonosTargetValue
  } = JSON.parse(JSON.stringify(req.headers));

  console.log("event posted", sonosNameSpace);
  switch (sonosNameSpace && sonosNameSpace.toLowerCase()) {
    case "playbackmetadata":
      //const sendPlayBackToClientResponse = sendPlayBackToClient(req.body);
      console.info(`supported sonos event ${sonosNameSpace}`, req.body);
      socket.on("data", data => {
        latestData = data;
        mutate(`/api/groups/${sonosTargetValue}`, data, false);
      });
      break;
    default:
      console.error(`unsupported sonos event ${sonosNameSpace}`);
  }
  //   res.status(200).json({ playbackMetadata });
  res.end();

  return;
});
