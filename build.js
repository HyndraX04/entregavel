// build.js - Script de build para a Vercel
const fs = require('fs');
const path = require('path');

console.log('Iniciando empacotamento para a Vercel...');

const distDir = path.join(__dirname, 'dist');

// Garante que a pasta dist esteja limpa e criada
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copia pastas estáticas
if (fs.existsSync('assets')) {
  fs.cpSync('assets', path.join(distDir, 'assets'), { recursive: true });
  console.log('-> assets/ copiado');
}

if (fs.existsSync('chatfn')) {
  fs.cpSync('chatfn', path.join(distDir, 'chatfn'), { recursive: true });
  console.log('-> chatfn/ copiado');
}

// Copia páginas HTML e ícone
const filesToCopy = ['index.html', 'login.html', 'obrigado.html', 'favicon.ico'];

for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(distDir, file));
    console.log(`-> ${file} copiado`);
  }
}

console.log('Sucesso: Pasta "dist" gerada com todos os arquivos estaticos!');
