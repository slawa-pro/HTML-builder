//https://nodejs.org/api/stream.html#readable-streams
const path = require('path');
const fs = require('fs');

function f01() {
  const pathToFile = path.join(__dirname, 'text.txt');
  const readStream = fs.createReadStream(pathToFile, 'utf8');

  readStream.on('data', function (chunk){
    console.log(chunk);
  });
}

f01();