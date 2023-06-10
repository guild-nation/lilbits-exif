const fs = require('fs');
const seedrandom = require('seedrandom');

const SHUFFLE_SEED = '8532854071842439';
const SHUFFLE_DEPTH = 3;

const data = {
  background: require('../assets/traits/bgs'),
  bits: require('../assets/traits/bits'),
  plate: require('../assets/traits/plates'),
}
const metadata = require('../assets/metadata/list');

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
    console.log('[~~ COMBINING ~~]');

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

  { // - prune
    console.log('[~~ PRUNING ~~]');

    let pruned = [];

    for (const nft of out){
      const bg = snake_case(nft.Background);
      const plate = snake_case(nft.Plate);
      const bits = snake_case(nft.Bits);
      
      nft.file = `${bg}_${plate}_plate_${bits}`;
      
      if(metadata.indexOf(nft.file) > -1) {
        pruned.push(nft);
      }
    }
    out = pruned;
    console.log('pruned', pruned.length)
    console.log(out[0]);
  }

  { // -- shuffle
    console.log('[~~ SHUFFLING ~~]');

    const rng = seedrandom(SHUFFLE_SEED);
    const range = out.length;
    
    for (let s = 0; s < SHUFFLE_DEPTH; s++) {
      for (let i = out.length - 1; i > 0; i--) {
        let j = Math.floor(rng() * range);
        [out[i], out[j]] = [out[j], out[i]];
      }
    }

    console.log('shuffled');
    console.log(out[0]);
  }

  { // write metadata
    console.log('[~~ WRITING ~~]');

    let id = 1;
    for (const nft of out){
      const file = nft.file;
      
      nft.Collection = "Lil' Bits";
      nft.Id = id++;
      nft.Total = out.length;

      delete nft.file;

      fs.writeFileSync(`./out/json/${file}.json`, JSON.stringify(nft));
    }
  }
  
})()


