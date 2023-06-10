const fs = require('fs');
const piexif = require("piexifjs");

const metadata = require('../assets/metadata/list');

for (const file of metadata){
  const json = require(`../out/json/${file}.json`);
  const jpeg = fs.readFileSync(`./out/jpgs/${file}.jpg`);
  const data = jpeg.toString('binary');

  const zeroth = {};
  zeroth[piexif.ImageIFD.ImageDescription] = JSON.stringify(json);
  const obj = {"0th": zeroth};

  var cooked = Buffer.from(piexif.insert(piexif.dump(obj), data), "binary");
  fs.writeFileSync(`./out/final/${file}.jpg`, cooked);
}


