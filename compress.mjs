import { Jimp } from 'jimp';
import { renameSync } from 'fs';

renameSync('public/poh-joan.jpg', 'public/poh-joan-orig.jpg');
const img = await Jimp.read('public/poh-joan-orig.jpg');
img.resize({ w: 900 });
await img.write('public/poh-joan.jpg');
console.log('done');
