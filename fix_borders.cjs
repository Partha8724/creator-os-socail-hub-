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
    .replace(/border border-white\/5 border border-white\/[0-9]+/g, 'border border-apple-glass-border')
    .replace(/bg-\[\#1C1C1E\]\/60 backdrop-blur-2xl border border-white\/5/g, 'bg-[#1C1C1E]/60 backdrop-blur-2xl border border-apple-glass-border')
    .replace(/text-slate-900/g, 'text-[#F5F5F7]')
    .replace(/shadow-\[0_4px_24px_-4px_rgba\(0,0,0,0\.5\)\]/g, '') // remove large manual shadows where inappropriate
    .replace(/premium-glass/g, 'smart-card-premium') // restore class name
    .replace(/premium-glass-card/g, 'smart-card'); // restore class name
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed borders in ' + file);
  }
});
