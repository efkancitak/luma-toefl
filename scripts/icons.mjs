// Rasterize the project's code-native mark without an image dependency.
import { deflateSync } from 'node:zlib';
import { writeFile, mkdir } from 'node:fs/promises';
const folder=new URL('../icons/',import.meta.url);
function crc32(buffer){let crc=0xffffffff;for(const n of buffer){crc^=n;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type);const size=Buffer.alloc(4),crc=Buffer.alloc(4);size.writeUInt32BE(data.length);crc.writeUInt32BE(crc32(Buffer.concat([t,data])));return Buffer.concat([size,t,data,crc]);}
function pointLine(x,y,x1,y1,x2,y2,w){const dx=x2-x1,dy=y2-y1,t=Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy)));return Math.hypot(x-x1-t*dx,y-y1-t*dy)<=w/2;}
function color(x,y){
  const cx=Math.max(112,Math.min(400,x)),cy=Math.max(112,Math.min(400,y));
  if(Math.hypot(x-cx,y-cy)>112)return [0,0,0,0];
  if((x>=160&&x<=224&&y>=130&&y<=424)||(x>=160&&x<=354&&y>=366&&y<=424))return [238,242,214,255];
  const rays=[[338,121,338,239],[279,180,397,180],[296,138,380,222],[296,222,380,138]];
  if(rays.some(line=>pointLine(x,y,...line,23)))return [200,230,160,255];
  return [24,61,54,255];
}
function png(size){const raw=Buffer.alloc((size*4+1)*size);for(let y=0;y<size;y++){const row=y*(size*4+1);for(let x=0;x<size;x++){const rgba=[0,0,0,0];for(const sy of [.25,.75])for(const sx of [.25,.75]){const p=color((x+sx)*512/size,(y+sy)*512/size);p.forEach((v,i)=>rgba[i]+=v/4);}for(let i=0;i<4;i++)raw[row+1+x*4+i]=Math.round(rgba[i]);}}
  const hdr=Buffer.alloc(13);hdr.writeUInt32BE(size,0);hdr.writeUInt32BE(size,4);hdr[8]=8;hdr[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',hdr),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
}
await mkdir(folder,{recursive:true});
for(const [name,size] of [['icon-192.png',192],['icon-512.png',512],['apple-touch-icon.png',180]])await writeFile(new URL(name,folder),png(size));
console.log('PWA icons generated.');
