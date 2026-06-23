#!/usr/bin/env node
// Simple helper: move/copy files from a local folder into the repo `media/` folder,
// add them to git and push. Usage:
//  node tools/import_media_to_repo.js /path/to/source/folder

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = process.argv[2];
if (!src) {
  console.error('Uso: node tools/import_media_to_repo.js <source-folder>');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const targetDir = path.join(repoRoot, 'media');

if (!fs.existsSync(src)) {
  console.error('Fonte não encontrada:', src);
  process.exit(1);
}

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const files = fs.readdirSync(src).filter((f) => fs.statSync(path.join(src, f)).isFile());
if (!files.length) {
  console.log('Nenhum arquivo encontrado em', src);
  process.exit(0);
}

files.forEach((f) => {
  const srcPath = path.join(src, f);
  const destName = `${Date.now()}_${f.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const destPath = path.join(targetDir, destName);
  fs.copyFileSync(srcPath, destPath);
  console.log('Copiado:', f, '->', destPath);
});

try {
  execSync('git add media', { cwd: repoRoot, stdio: 'inherit' });
  execSync('git commit -m "Import media files"', { cwd: repoRoot, stdio: 'inherit' });
  execSync('git push', { cwd: repoRoot, stdio: 'inherit' });
  console.log('Arquivos adicionados ao repositório em /media e push realizado.');
} catch (err) {
  console.error('Erro ao commitar/push:', err.message);
  console.error('Se necessário, rode manualmente: git add media && git commit -m "Import media files" && git push');
  process.exit(1);
}
