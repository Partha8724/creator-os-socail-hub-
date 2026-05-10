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
    .replace(/bg-white\/10 text-\[\#F5F5F7\] hover:bg-white\/20 transition-all border border-apple-glass-border/g, 'bg-[#1C1C1E] border border-apple-glass-border')
    .replace(/bg-white\/5 border border-white\/5 border-white\/10/g, 'bg-[#151515] border border-apple-glass-border')
    .replace(/bg-white\/5 border border-white\/5/g, 'bg-[#151515] border border-apple-glass-border')
    .replace(/bg-white\/5 border border-apple-glass-border/g, 'bg-[#151515] border border-apple-glass-border')
    ;
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed buttons in ' + file);
  }
});
