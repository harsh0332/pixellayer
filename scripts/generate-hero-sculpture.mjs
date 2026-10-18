// Offline vector fallback from the same mesh as the live WebGL sculpture.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import ts from 'typescript';
import Module from 'node:module';
import sharp from 'sharp';
const source = path.resolve(__dirname, '../lib/hero-sculpture.ts');
const loaded = new Module(source);
loaded._compile(ts.transpileModule(fs.readFileSync(source, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText, source);
const {ribbonPoint} = loaded.exports;
const rotate = p => {
  const yaw=-.24, pitch=.42, roll=-.14;
  const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw), z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw);
  const y=p[1]*Math.cos(pitch)-z*Math.sin(pitch), depth=p[1]*Math.sin(pitch)+z*Math.cos(pitch);
  return [x*Math.cos(roll)-y*Math.sin(roll), x*Math.sin(roll)+y*Math.cos(roll), depth];
};
const project = p => [720+p[0]/(2.1*3)*(1+p[2]*.055)*720,240-p[1]/2.1*(1+p[2]*.055)*240];
const faces=[];
for(let layer=0;layer<3;layer++)for(let i=0;i<224;i++)for(let j=0;j<48;j++){
  const uv=[[i/224,j/48],[(i+1)/224,j/48],[(i+1)/224,(j+1)/48],[i/224,(j+1)/48]];
  const pts=uv.map(([u,v])=>rotate(ribbonPoint(u,v*Math.PI*2,layer)));
  const a=pts[1].map((v,k)=>v-pts[0][k]),b=pts[3].map((v,k)=>v-pts[0][k]);
  let n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const length=Math.hypot(...n)||1;n=n.map(v=>v/length);if(n[2]<0)n=n.map(v=>-v);
  const light=Math.max(0,n[0]*-.24+n[1]*.50+n[2]*.83);
  const spec=Math.pow(Math.max(0,n[0]*-.13+n[1]*.26+n[2]*.956),45);
  const rim=Math.pow(1-Math.max(0,n[2]),3)*.48;
  const base=[.035+layer*.034,.15+layer*.07,.30+layer*.105];
  let color=base.map((v,k)=>(v*(.55+light*.85)+[.66,.82,.94][k]*spec*.9)*(1-rim)+[.62,.79,.91][k]*rim);
  if(layer===2 && (j===0||j===23||j===24||j===47)) color=color.map((v,k)=>v*.45+[.72,.86,.36][k]*(.65+light*.4)*.55);
  const fill='#'+color.map(v=>Math.round(Math.min(1,Math.max(0,v))*255).toString(16).padStart(2,'0')).join('');
  faces.push({z:pts.reduce((s,p)=>s+p[2],0)/4,svg:`<path d="M${pts.map(p=>project(p).map(v=>v.toFixed(2)).join(',')).join('L')}Z" fill="${fill}" stroke="${fill}" stroke-width=".5"/>`});
}
faces.sort((a,b)=>a.z-b.z);
const output=path.resolve(__dirname,'../public/brand');fs.mkdirSync(output,{recursive:true});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 480">${faces.map(f=>f.svg).join('')}</svg>`;
await sharp(Buffer.from(svg)).resize(1440,480).webp({quality:92,alphaQuality:100}).toFile(path.join(output,'hero-sculpture.webp'));
console.log('Generated sculpture fallback');
