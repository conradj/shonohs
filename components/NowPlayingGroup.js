import useSWR from "swr";
import fetch from "../lib/fetch";
import Card from "./base/Card";
import PlaybackStatus from "./PlaybackStatus";

export default props => {
  const { data, error } = useSWR(
    `/api/groups/metadata/${props.groupId}`,
    fetch,
    {
      refreshInterval: 1000
    }
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const {
    errorCode,
    container: { name = "", imageUrl },
    currentItem
  } = data.playbackMetadata;

  if (errorCode) return <div>Error...{errorCode}</div>;
  console.log(currentItem);
  return (
    <div className="mr-6 mb-6">
      <Card
        imageUrl={currentItem?.track?.imageUrl || imageUrl}
        name={currentItem?.track?.name || name}
        tags={props.speakers.map(speaker => {
          return {
            id: speaker.id,
            name: speaker.name
          };
        })}
      >
        {currentItem?.track && (
          <p>
            {currentItem?.track?.artist?.name} ·{" "}
            {currentItem?.track?.album?.name}
          </p>
        )}
        <p>{name}</p>
        {currentItem?.track && (
          <PlaybackStatus
            groupId={props.groupId}
            durationMillis={currentItem?.track.durationMillis}
          />
        )}
      </Card>
    </div>
  );
};
