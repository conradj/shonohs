const Phea = require("phea");

const lightSettings = () => {
  return (
    <div className="p-4 shadow rounded bg-white">
      <h1 className="text-gray-500 leading-normal">
        Setup the show! (Though maybe not needed, just use echonest attributes)
      </h1>
      <p>Please wait, getting song attributes...</p>
      <p>Please wait, getting song signature...</p>
      <p>Time offset</p>
      <h2>You need to set up an entertainment area in the app</h2>
      <p>
        <button>I've done that now</button>
      </p>
      <h2>Entertainment area found.</h2>
      <div className="p-4">
        <button className="btn btn-blue" onClick={() => Profile()}>
          Group 1
        </button>
      </div>
      <div className="p-4">
        <button className="btn btn-blue">Group 2</button>
      </div>
    </div>
  );
};

const getEntertainmentArea = () => {
  // get all groups and find the entertainment one
  // /api/bmEGJf8Z4v9Rkwp4TMwpP0GGnVd8kjFlwZyLqR68/groups.filter(groups => {})
  // get the entertainment one
  // /api/bmEGJf8Z4v9Rkwp4TMwpP0GGnVd8kjFlwZyLqR68/groups/3
  // turn on streaming on the entertainment one
  // PUT /api/bmEGJf8Z4v9Rkwp4TMwpP0GGnVd8kjFlwZyLqR68/groups/3
  // {"stream":{"active":true}}
};

export default lightSettings;

function Profile() {
  //const { data, error } = useSWR('/api/user', fetch)

  //if (error) return <div>failed to load</div>
  //if (!data) return <div>loading...</div>
  //return <div>hello {data.name}!</div>
  console.log(1);
  return { test: true };
}
