const fs = require('fs');
const { Canvas, Image } = require('canvas');
const jimp = require('jimp');
const piexif = require('piexifjs');

const data = {
  background: require('../assets/traits/bgs'),
  bits: require('../assets/traits/bits'),
  plate: require('../assets/traits/plates')
}

// TODO: extract to utils.js
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 

function snake_case(str) {
  return str && str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');
}

(async () => {

  let out = [{}];
  { // combine

  for (const trait in data) {
    const aux = [];
    for (const type of data[trait]) {
      for (const obj of out) {
        const o = {};
        o[capitalize(trait)] = type;
        aux.push({...obj, ...o});
      }
    }
    out = aux;
  }
  console.log('combinations', out.length);

  } // - combine

  { // merge
    for (const nft of out){
      console.log(nft);

      const bg = snake_case(nft.Background);
      const plate = snake_case(nft.Plate);
      const bits = snake_case(nft.Bits);

      const bgImg = await jimp.read(`./assets/bgs/${bg}.png`);
      const plateImg = await jimp.read(`./assets/bits/${bits}.png`);
      const bitsImg = await jimp.read(`./assets/plates/${plate}.png`);

      bgImg.blit(bitsImg, 0, 0).blit(plateImg, 0, 0);
      
      const jpeg = await bgImg.getBufferAsync(jimp.MIME_JPEG);
      const data = jpeg.toString("binary");
      
      // Zeroth mode
      const zeroth = {};
      zeroth[piexif.ImageIFD.ImageDescription] = JSON.stringify(nft);
      const obj = {"0th": zeroth};
      
      const cooked_jpeg = Buffer.from(piexif.insert(piexif.dump(obj), data), "binary");
      const merged_file = `./out/${bg}_${plate}_plate_${bits}.jpg`;
      fs.writeFileSync(`${merged_file}`, cooked_jpeg);
    }
  }
  
})()


