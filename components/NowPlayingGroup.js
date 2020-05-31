import useSWR from "swr";
import fetch from "../lib/fetch";
import Card from "./base/Card";

export default props => {
  const { data, error } = useSWR(`/api/groups/${props.groupId}`, fetch);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log("card", data.playbackMetadata);

  const {
    container: { name = "", imageUrl = "" }
  } = data.playbackMetadata;

  if (data.playbackMetadata.container.imageUrl) {
    console.log(data.playbackMetadata.container.imageUrl);
  }

  return (
    <div>
      <Card imageUrl={imageUrl} name={name}>
        {props.children}
      </Card>
    </div>
  );
};
