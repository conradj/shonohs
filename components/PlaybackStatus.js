import useSWR from "swr";
import fetch from "../lib/fetch";

const convertMillisTime1 = millis => {
  const date = new Date(millis); //.setMilliseconds(millis);
  console.log(date.toTimeString());
  return date.toTimeString();
};

const convertMillisTime = s => {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  //return hrs + ":" + mins + ":" + secs;
  return `${hrs > 0 ? `${hrs}:` : ``} ${mins}:${("00" + secs).slice(-2)}`;
};

export default props => {
  const { data, error } = useSWR(`/api/groups/status/${props.groupId}`, fetch, {
    refreshInterval: 2000
  });
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  const { playbackState = "", positionMillis } = data.playbackStatus;

  const trackDuration = convertMillisTime(props.durationMillis);
  const trackPosition = convertMillisTime(positionMillis);

  return (
    <div>
      <div className="text-xs">
        <div className="float-left">{trackPosition}</div>
        <div className="float-right">{trackDuration}</div>
      </div>
      <div className="clear-right">
        {playbackState === "PLAYBACK_STATE_PLAYING" ? "Now playing" : "Paused"}
      </div>
    </div>
  );
};
