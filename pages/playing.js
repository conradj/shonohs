import withSession from "../lib/session";
//import withSonos from "../middleware/sonos";
import SonosApi from "../lib/sonosApi";
import NowPlayingGroup from "../components/NowPlayingGroup";
const simpleOauthModule = require("simple-oauth2");

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  let errorMessage = "";
  const sonosApi = new SonosApi();
  await sonosApi.connect(req.session.get("sonos_token"));
  req.session.set("sonos_token", sonosApi.token);

  try {
    await req.session.save();
  } catch (err) {
    console.error("sonos connect session save error", err);
  }
  const { groups, players } = await sonosApi.getGroups();
  return {
    props: { errorMessage, groups }
  };
});

const NowPlaying = ({ errorMessage, groups }) => (
  <div>
    <div className="connection-status">CONNECTION STATUS HEADER</div>
    <div>{errorMessage}</div>
    <div className="content">
      {groups.map(group => (
        <NowPlayingGroup key={group.id} groupId={group.id}>
          {group.name}
        </NowPlayingGroup>
      ))}
    </div>
  </div>
);

export default NowPlaying;
