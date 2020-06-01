import useSWR from "swr";
import fetch from "../lib/fetch";
import Card from "./base/Card";

export default props => {
  const { data, error } = useSWR(`/api/groups/${props.groupId}`, fetch);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const {
    container: { name = "", imageUrl }
  } = data.playbackMetadata;
  return (
    <div className="mr-6 mb-6">
      <Card
        imageUrl={imageUrl}
        name={name}
        tags={props.speakers.map(speaker => {
          return {
            id: speaker.id,
            name: speaker.name
          };
        })}
      >
        {props.children}
      </Card>
    </div>
  );
};
