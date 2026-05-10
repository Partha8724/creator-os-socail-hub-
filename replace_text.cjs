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
    .replace(/text-deep-black/g, 'text-slate-900')
    .replace(/italic italic/g, 'italic')
    // Remove "futuristic" strings
    .replace(/Neural/g, 'Smart')
    .replace(/neural/g, 'smart')
    .replace(/Nexus/g, 'Hub')
    .replace(/nexus/g, 'hub')
    .replace(/Synthesis/g, 'Generation')
    .replace(/synthesis/g, 'generation')
    .replace(/Matrix/g, 'Platform')
    .replace(/matrix/g, 'platform');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated texts in ' + file);
  }
});
