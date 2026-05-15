const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../../pages');
const viewsDir = path.join(__dirname, '../src/views');

if (!fs.existsSync(viewsDir)) {
  fs.mkdirSync(viewsDir, { recursive: true });
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html') && !f.includes('footer') && f !== 'login.html');

function toPascalCase(str) {
  return str.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();}).replace(/-/g, '');
}

files.forEach(file => {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const match = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  
  let mainContent = '';
  if (match) {
    mainContent = match[1];
  } else {
    // If no main, just take body
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    mainContent = bodyMatch ? bodyMatch[1] : content;
    // Strip header and footer if possible
    mainContent = mainContent.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '').replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  }

  // Remove script tags
  mainContent = mainContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  let baseName = file.replace('.html', '');
  let viewName = toPascalCase(baseName) + 'View';
  
  const vueContent = `<template>
  <div class="${baseName}-view">
${mainContent}
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
/* Estilos específicos de la vista */
</style>
`;

  fs.writeFileSync(path.join(viewsDir, viewName + '.vue'), vueContent);
  console.log('Created ' + viewName + '.vue');
});
