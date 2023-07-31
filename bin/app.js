const fs = require('fs');
const robot = require('robotjs');

const dataFolderPath = './data';
const dataFileName = 'strafes.json';

const createDataFolderIfNotExists = () => {
  if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath);
  }
};

const getCurrentDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const loadData = () => {
  const currentDate = getCurrentDate();
  const filePath = `${dataFolderPath}/${dataFileName}`;
  let data = {};

  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(rawData);
  }

  if (!data[currentDate]) {
    data[currentDate] = 0;
  }

  return data;
};

const saveData = (data) => {
  const currentDate = getCurrentDate();
  const filePath = `${dataFolderPath}/${dataFileName}`;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// object for keys status
let keyState = {};

const updateCount = (key, data) => {
  const currentDate = getCurrentDate();
  if (!keyState[key]) {
    keyState[key] = true;
    data[currentDate] += 1; // +1 for every A/D
    console.clear();
    console.log(`Strafes today: ${data[currentDate]}`);
    robot.keyTap(key.toUpperCase()); //  simulation for robotjs (to use in other apps)
  }
};

const resetKeyState = (key) => {
  keyState[key] = false;
};

const main = () => {
  createDataFolderIfNotExists();
  const data = loadData();

  console.clear();
  console.log('How much did you strafe today?');

  robot.setKeyboardDelay(0); // makes keyboard delay min

  process.stdin.setRawMode(true);
  process.stdin.resume();

  // a/d checker
  process.stdin.on('data', (chunk) => {
    const key = chunk.toString().toLowerCase();

    if (key === 'a' || key === 'd') {
      updateCount(key, data);
    } else if (key === 'q') {
      saveData(data);
      process.exit(0);
    }
  });

  // reset on keyup
  process.stdin.on('keyup', (chunk) => {
    const key = chunk.toString().toLowerCase();
    resetKeyState(key);
  });
};

main();
