import useSWR from "swr";
import fetch from "../lib/fetch";
import Card from "./base/Card";
import PlaybackStatus from "./PlaybackStatus";

export default props => {
  const { data, error } = useSWR(
    `/api/groups/metadata/${props.groupId}`,
    fetch,
    {
      refreshInterval: 1500
    }
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const {
    playbackMetadata,
    playbackMetadata: { errorCode }
  } = data;

  if (errorCode) return <div>Error...{errorCode}</div>;

  const {
    container: { name = "", imageUrl },
    currentItem
  } = playbackMetadata;

  const trackDetails =
    currentItem && currentItem.track
      ? `${currentItem.track?.artist?.name} · ${currentItem?.track?.album?.name}`
      : "";

  return (
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
      {trackDetails !== "" && (
        <marquee scrollamount={trackDetails.length > 45 ? 6 : 0}>
          {trackDetails}
        </marquee>
      )}
      <p>{name}</p>
    </Card>
  );
};
