// fetcher.js

const request = require('request');
const fs = require('fs');
const readline = require('readline');

const url = process.argv[2];
const path = process.argv[3];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const main = () => {
  checkDirectoryForFile(path);
};

const checkDirectoryForFile = (dirPath) => {
  const dirArray = dirPath.split('/')
  const fileName = dirArray.pop();
  const dirStr = dirArray.join('/');

  fs.readdir(dirStr, (err, files) => {
    if (err) {
      throw err;
    } else if (files.indexOf(fileName) !== -1) {
      verifyOverride();
    } else {
      getFileFromURL();
    }
  });
};

const verifyOverride = () => {
  rl.question("File already exists. Would you like to overwrite it?    ", (answer) => {
    if (answer.toLowerCase() === 'y') {
      getFileFromURL();
    } else {
      rl.close();
    }
  });
};

const getFileFromURL = () => {
  request(url, (error, response, body) => {
    if (error) {
      console.log(error);
    } else if (response.statusCode === 200) {
      writeFile(body);
    } else {
      console.log(response);
      rl.close()
    }
  });
};

const writeFile = (data) => {
  const textLength = data.length;
  fs.writeFile(path, data, (err) => {
    if (err) throw err;
    console.log(`Downloaded and saved ${textLength} bytes to ${path}`);
    rl.close();
  });
};

main();
