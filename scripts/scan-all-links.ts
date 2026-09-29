import fs from 'fs';
import path from 'path';

function getFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getFiles(path.join(__dirname, '../src'));
const hrefPattern = /href=\{?([`"'][^`"'}]+[`"']|\{[^}]+\})\}?/g;

const allHrefs: { file: string; val: string }[] = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefPattern.exec(content)) !== null) {
    const val = match[1];
    allHrefs.push({ file: path.relative(path.join(__dirname, '..'), file), val });
  }
}

// Find unique string literals or templates
const hrefMap = new Map<string, string[]>();
for (const item of allHrefs) {
  if (!hrefMap.has(item.val)) hrefMap.set(item.val, []);
  hrefMap.get(item.val)!.push(item.file);
}

console.log('Total unique href expressions:', hrefMap.size);
for (const [expr, occ] of Array.from(hrefMap.entries()).sort()) {
  if (expr.includes('http') || expr.includes('mailto:') || expr.includes('tel:')) continue;
  console.log(`${expr} -> ${occ[0]} (${occ.length} times)`);
}
