import withSession from "../lib/session";
import SonosApi from "../lib/sonosApi";
import NowPlayingGroup from "../components/NowPlayingGroup";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  let errorMessage = "";
  const sonosApi = new SonosApi();
  await sonosApi.connect(req.session.get("sonos_token"));

  try {
    req.session.set("sonos_token", sonosApi.token);
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
