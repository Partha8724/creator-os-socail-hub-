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
    // Remove individual glassy inline classes entirely to ensure components are solid
    .replace(/bg-\[\#1C1C1E\]\/60 backdrop-blur-2xl border border-apple-glass-border/g, 'bg-white text-black')
    .replace(/bg-white text-black text-\[\#F5F5F7\]/g, 'bg-white text-black')
    .replace(/backdrop-blur-md|backdrop-blur-xl|backdrop-blur-2xl|backdrop-blur-3xl/g, '')
    // Re-apply a backdrop blur specifically to the main container or root if it matches certain things
    // Actually, I'll do the root background blur manually in the files (Landing, SmartShell)
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed glass in ' + file);
  }
});
