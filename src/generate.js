const fs = require('fs');
const igen = require('js-image-generator');
const piexif = require("piexifjs");
 
const file = `./out/${Date.now()}.jpg`;

// gen rnd img
igen.generateImage(800, 600, 80, function(err, image) {
  fs.writeFileSync(file, image.data);
});

// read file 
const jpeg = fs.readFileSync(file);
var data = jpeg.toString("binary");

var zeroth = {};
var exif = {};
zeroth[piexif.ImageIFD.ImageDescription] = '{"type": "Cold Cut"}';
//exif[piexif.ExifIFD.UserComment] = '{"type": "Cold Cut"}';

//const obj = piexif.load(data);
const obj = {"0th": zeroth, "Exif":exif};
console.log(obj);

var bytes = piexif.dump(obj);
var newData = piexif.insert(bytes, data);
var newJpeg = Buffer.from(newData, "binary");

/*exif[piexif.ImageIFD.] = "{type: 'cold cut'}";
var exifObj = {"Exif": exif};*/

const exifFile = `./out/${Date.now()}.exif.jpg`;
fs.writeFileSync(exifFile, newJpeg);
