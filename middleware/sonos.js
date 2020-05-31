//import simpleOauthModule from "simple-oauth2";

export default function withSonos1(handler) {
  return async (req, res) => {
    console.log("middleware");
    // const sonosApi = SonosApi();
    // const connected = sonosApi.connect(req.session);
    // req.sonos = connected ? sonosApi : null;
    return handler(req, res);
  };
}

const withSonos = async req => {
  const sonosApi = SonosApi;
  console.log(JSON.stringify(sonosApi));
  const connected = sonosApi.connect(req.session);
  // req.sonos = connected ? sonosApi : null;
  req.sonos = "middleware";
  //return handler(req, res);
};

const useSonos = async req => {
  req.sonos = "test";
};

module.exports = withSonos;
