const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/bg-neutral-bg/g, 'bg-dark-bg')
    .replace(/bg-white(?![/a-zA-Z0-9\-])/g, 'bg-[#1C1C1E]/60 backdrop-blur-2xl border border-white/5')
    .replace(/bg-slate-50(?![/a-zA-Z0-9\-])/g, 'bg-white/5 border border-white/5')
    .replace(/bg-slate-100(?![/a-zA-Z0-9\-])/g, 'bg-white/10')
    .replace(/bg-slate-800(?![/a-zA-Z0-9\-])/g, 'bg-[#2C2C2E]')
    .replace(/bg-blue-50(?![/a-zA-Z0-9\-])/g, 'bg-glow-blue/10')
    .replace(/bg-indigo-50(?![/a-zA-Z0-9\-])/g, 'bg-glow-purple/10')
    .replace(/border-slate-200/g, 'border-white/10')
    .replace(/border-blue-200/g, 'border-glow-blue/30')
    .replace(/border-indigo-200/g, 'border-glow-purple/30')
    .replace(/text-slate-900/g, 'text-[#F5F5F7]')
    .replace(/text-slate-800/g, 'text-white')
    .replace(/text-slate-600/g, 'text-[#A1A1A6]')
    .replace(/text-slate-500/g, 'text-[#86868B]')
    .replace(/text-primary-blue/g, 'text-glow-blue')
    .replace(/text-primary-indigo/g, 'text-glow-purple')
    .replace(/bg-primary-blue/g, 'bg-glow-blue text-white')
    .replace(/text-black/g, 'text-[#1C1C1E]')
    .replace(/hover:bg-slate-50/g, 'hover:bg-white/10')
    .replace(/hover:text-slate-900/g, 'hover:text-white')
    .replace(/shadow-sm/g, 'shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]')
    .replace(/shadow-lg/g, 'shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]')
    .replace(/rounded-xl/g, 'rounded-3xl')
    .replace(/rounded-lg/g, 'rounded-2xl')
    .replace(/uppercase tracking-widest/g, 'tracking-tight')
    .replace(/uppercase/g, ''); // apple usually avoids widespread uppercase in UI
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
