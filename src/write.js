const fs = require('fs');
const piexif = require("piexifjs");
 
const ifile = `./assets/test.jpg`;
const ofile = `./out/test.jpg`;

// TODO: gen metadata from mint
// FIXME: bits or bit or meat
const metadata = {"bits": "Venison", "plate": "Ceramic", "bg": "Fire"};

const jpeg = fs.readFileSync(ifile);
const data = jpeg.toString("binary");

// Zeroth mode
const zeroth = {};
zeroth[piexif.ImageIFD.ImageDescription] = JSON.stringify(metadata);
const obj = {"0th": zeroth};
console.log('metadata', obj);

var cooked_jpeg = Buffer.from(piexif.insert(piexif.dump(obj), data), "binary");
fs.writeFileSync(ofile, cooked_jpeg);