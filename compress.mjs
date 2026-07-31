import { Jimp } from 'jimp';
import { writeFileSync } from 'fs';

for (const n of ['1', '2', '3']) {
  const img = await Jimp.read(`public/priest-${n}-orig.jpg`);
  console.log(`priest-${n} read, width: ${img.width}`);
  img.resize({ w: 900 });
  await img.write(`public/priest-${n}.jpg`);
  console.log(`priest-${n}.jpg saved`);
}
console.log('All done');
