import useSWR from "swr";
import fetch from "../lib/fetch";
import Card from "./base/Card";

export default props => {
  const { data, error } = useSWR(`/api/groups/${props.groupId}`, fetch);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const {
    container: { name = "", imageUrl = "" }
  } = data.playbackMetadata;
  return (
    <div>
      <Card imageUrl={imageUrl} name={name}>
        {props.children}
      </Card>
    </div>
  );
};
