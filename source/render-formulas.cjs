const fs=require('node:fs');
const path=require('node:path');
const {mathjax}=require('mathjax-full/js/mathjax.js');
const {TeX}=require('mathjax-full/js/input/tex.js');
const {SVG}=require('mathjax-full/js/output/svg.js');
const {liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js');
const {AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
const adaptor=liteAdaptor();RegisterHTMLHandler(adaptor);
const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const dir=path.resolve(__dirname,'assets/formulas');
const formulas=JSON.parse(fs.readFileSync(path.join(dir,'latex.json'),'utf8'));
for(const [id,m] of Object.entries(formulas)){
 const node=doc.convert(m.tex,{display:true});
 let svg=adaptor.outerHTML(adaptor.firstChild(node));
 if(svg.includes('data-mml-node="merror"'))throw Error(id+' failed LaTeX');
 const vb=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
 m.width=vb[2];m.height=vb[3];
 svg=svg.replace('currentColor',m.color).replaceAll('currentColor',m.color).replace(/width="[^"]+"/,'width="'+vb[2]/1000*36+'px"').replace(/height="[^"]+"/,'height="'+vb[3]/1000*36+'px"');
 fs.writeFileSync(path.join(dir,id+'.svg'),svg);
}
fs.writeFileSync(path.join(dir,'index.json'),JSON.stringify(formulas,null,2));
console.log('Rendered '+Object.keys(formulas).length+' formulas');
