const Phea = require("phea");
const eyeOfTheTiger = require("./api/trackanalysiseyeoftiger.json");

let options = {
  address: "192.168.1.8",
  username: "bmEGJf8Z4v9Rkwp4TMwpP0GGnVd8kjFlwZyLqR68",
  psk: "798B571B27D5ED93B59E7F21B4EE68C4"
};

export async function getStaticProps(context) {
  //basicExample();
  //cyclePatternTransition();
  return patternFromSong(eyeOfTheTiger);
  //   return {
  //     props: {} // will be passed to the page component as props
  //   };
}

async function basicExample() {
  let running = true;
  //   process.on("SIGINT", () => {
  //     // Stop example with ctrl+c
  //     console.log("SIGINT Detected. Shutting down...");
  //     running = false;
  //   });

  let groupId = 3;
  let transitionTime = 250; // milliseconds

  let bridge = await Phea.bridge(options);
  let groups = await bridge.getGroup(groupId); // 0 will fetch all groups.
  console.log(groups);
  await bridge.start(groupId);

  while (running) {
    let color = [
      // Generate Random RGB Color Array
      Math.floor(55 + Math.random() * Math.floor(200)),
      Math.floor(55 + Math.random() * Math.floor(200)),
      Math.floor(55 + Math.random() * Math.floor(200))
    ];

    // Set all lights to random color.
    //[2,1,4]
    bridge.transition(2, color, transitionTime);

    // Sleep until next color update is needed.
    await new Promise(resolve => setTimeout(resolve, transitionTime));
  }

  bridge.stop();
  return {
    props: {} // will be passed to the page component as props
  };
}

async function cyclePatternTransition() {
  let running = true;
  let groupId = 3;
  let transitionTime = 100; // milliseconds

  let colors = [
    [0, 180, 180],
    [0, 128, 255],
    [0, 0, 255],
    [64, 0, 255],
    [127, 0, 255],
    [64, 0, 255],
    [0, 0, 255],
    [0, 128, 255],
    [0, 0, 0],
    [255, 0, 0],
    [0, 0, 0],
    [255, 0, 0],
    [0, 0, 0],
    [255, 0, 0],
    [0, 0, 0],
    [255, 0, 0]
  ];

  let bridge = await Phea.bridge(options);
  let groupInfo = await bridge.getGroup(groupId);
  let numberOfLights = groupInfo.lights.length;

  await bridge.start(groupId);

  let i = 0;
  while (running) {
    for (let id = 0; id < numberOfLights; id++) {
      bridge.transition(
        id + 1,
        colors[(i + id) % colors.length],
        transitionTime
      );
      bridge.transition(
        id + 1,
        colors[(i + id) % colors.length],
        transitionTime
      );
      bridge.transition(
        id + 1,
        colors[(i + id) % colors.length],
        transitionTime
      );
    }

    await new Promise(resolve => setTimeout(resolve, transitionTime));

    i++;
  }

  bridge.stop();

  return {
    props: {} // will be passed to the page component as props
  };
}

async function patternFromSong({
  track,
  bars,
  beats,
  sections,
  segments,
  tatums
}) {
  // todo, set colour palette from song attributes

  console.log(sections);
  const startTime; // time the track startedplaying
  sections.forEach(({start, duration}) => {
      while(Date.now() <  startTime + start + duration) {
        
      };
  });

  return {
    props: {} // will be passed to the page component as props
  };
}

const BasicExample = () => {
  //basicExample();

  return <span>Word</span>;
};

export default BasicExample;
