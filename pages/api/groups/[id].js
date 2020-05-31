import withSession from "../../../lib/session";
import SonosApi from "../../../lib/sonosApi";

export default withSession(async (req, res) => {
  const {
    query: { id }
  } = req;

  const sonosApi = new SonosApi();
  await sonosApi.connect(req.session.get("sonos_token"));

  const playbackMetadata = await sonosApi.getPlaybackMetadata(id);
  console.log("playbackMetadata", playbackMetadata);

  res.status(200).json({ playbackMetadata });
  res.end();

  return;
});
