import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const dir=new URL('./assets/formulas/',import.meta.url);
const formulas=JSON.parse(await fs.readFile(new URL('index.json',dir),'utf8'));
for(const id of Object.keys(formulas)){
 const svg=await fs.readFile(new URL(id+'.svg',dir));
 await sharp(svg,{density:384}).flatten({background:'#ffffff'}).png().toFile(fileURLToPath(new URL(id+'.png',dir)));
}
console.log('Rasterized '+Object.keys(formulas).length+' LaTeX formulas at 384 dpi');
