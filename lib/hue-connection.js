const Phea = require("phea");

const discoverBridges = async () => {
  return await Phea.discover();
};

const registerHue = async ip => {
  try {
    const credentials = await Phea.register(ip);
    return credentials;
    // {
    //   ip: '192.168.1.8',
    //   username: 'hYEtgHddPxZC5HZABICVRB5Sjwww2XiN5qVyW7cO',
    //   psk: '029210899B6FDACE71B6EF33755848AC'
    // }
  } catch (err) {
    return null;
  }
};

const getHueEntertainmentGroup = async credentials => {
  try {
    const bridge = await Phea.bridge(credentials);
    if (bridge) {
      console.log("here 2", bridge);
      const groups = await bridge.getGroup(0); // 0 will fetch all groups.
      const entertainmentGroup = Object.keys(groups).find(key => {
        return groups[key].type.toLowerCase() === "entertainment";
      });
      console.log("here 2.5 ent group", entertainmentGroup);

      return entertainmentGroup;
    }
    console.log("here4");
    return null;
  } catch (err) {
    return null;
  }
};

module.exports = { discoverBridges, registerHue, getHueEntertainmentGroup };
