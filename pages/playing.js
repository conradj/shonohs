import withSession from "../lib/session";
import SonosApi from "../lib/sonosApi";
import NowPlayingGroup from "../components/NowPlayingGroup";

export const getServerSideProps = withSession(async function({
  req,
  res,
  query
}) {
  const sonosApi = new SonosApi();
  const sonosConnected = await sonosApi.connect(req.session.get("sonos_token"));

  try {
    req.session.set("sonos_token", sonosApi.token);
    await req.session.save();
  } catch (err) {
    console.error("sonos connect session save error", err);
    return <div>sonos connect session save error</div>;
  }
  const { groups, players } = await sonosApi.getGroups();
  return {
    props: { groups, players }
  };
});

const NowPlaying = ({ errorMessage, groups, players }) => {
  return (
    <div className="container">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(group => (
          <NowPlayingGroup
            key={group.id}
            groupId={group.id}
            speakers={players.filter(player =>
              group.playerIds.includes(player.id)
            )}
          >
            {group.name}
          </NowPlayingGroup>
        ))}
      </div>
    </div>
  );
};

export default NowPlaying;
