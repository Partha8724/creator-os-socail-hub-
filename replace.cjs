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
    .replace(/bg-deep-black(\/[0-9]+)?/g, 'bg-white')
    .replace(/text-neon-cyan/g, 'text-primary-blue')
    .replace(/border-neon-cyan(\/[0-9]+)?/g, 'border-blue-200')
    .replace(/bg-neon-cyan(\/[0-9]+)?/g, 'bg-blue-50')
    .replace(/from-neon-cyan/g, 'from-blue-500')
    .replace(/to-cyber-purple/g, 'to-indigo-500')
    .replace(/text-cyber-purple/g, 'text-primary-indigo')
    .replace(/border-cyber-purple(\/[0-9]+)?/g, 'border-indigo-200')
    .replace(/bg-cyber-purple(\/[0-9]+)?/g, 'bg-indigo-50')
    .replace(/bg-neural-gray(\/[0-9]+)?/g, 'bg-slate-50')
    .replace(/font-mono/g, 'font-medium')
    .replace(/tracking-\[.*?\]/g, 'tracking-normal')
    .replace(/tracking-widest/g, 'tracking-wide')
    .replace(/tracking-tighter/g, 'tracking-tight')
    .replace(/text-\[8px\]|text-\[9px\]|text-\[10px\]/g, 'text-xs')
    .replace(/text-\[11px\]/g, 'text-sm')
    .replace(/text-white(\/[0-9]+)?/g, 'text-slate-600')
    .replace(/hover:text-white/g, 'hover:text-slate-900')
    .replace(/border-white\/[0-9]+/g, 'border-slate-200')
    .replace(/bg-white\/[0-9]+/g, 'bg-slate-50')
    .replace(/bg-white\/\[.*?\]/g, 'bg-slate-50')
    .replace(/neural-card-premium/g, 'neural-card') // unify cards
    .replace(/shadow-neon/g, 'shadow-sm')
    .replace(/neon-glow-cyan/g, '')
    .replace(/neon-glow-purple/g, '');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
