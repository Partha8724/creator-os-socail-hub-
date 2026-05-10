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
    .replace(/bg-white text-black/g, 'bg-white/10 text-[#F5F5F7] hover:bg-white/20 transition-all border border-apple-glass-border')
    .replace(/bg-\[\#1C1C1E\]\/60/g, 'bg-[#1C1C1E]')
    // also remove backdrop-blurs if any were missed
    .replace(/backdrop-blur-md/g, '')
    .replace(/backdrop-blur-xl/g, '')
    .replace(/backdrop-blur-2xl/g, '')
    .replace(/backdrop-blur-3xl/g, '');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed cards in ' + file);
  }
});
