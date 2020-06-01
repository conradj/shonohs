import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  res.status(200);
  const headers = JSON.stringify(req.headers);
  //console.log(headers);
  const {
    "x-sonos-type": sonosEventType,
    "x-sonos-namespace": sonosNameSpace
  } = JSON.parse(JSON.stringify(req.headers));

  console.log("event posted", sonosNameSpace);
  switch (sonosNameSpace && sonosNameSpace.toLowerCase()) {
    case "playbackmetadata":
      //const sendPlayBackToClientResponse = sendPlayBackToClient(req.body);
      console.info(`supported sonos event ${sonosNameSpace}`, req.body);
      break;
    default:
      console.error(`unsupported sonos event ${sonosNameSpace}`);
  }
  //   res.status(200).json({ playbackMetadata });
  res.end();

  return;
});
