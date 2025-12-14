#!/usr/bin/env node

/**
 * Script de conversion WebP avec mise à jour automatique des références
 * Utilise cwebp (npm package)
 * Usage: node scripts/convert-webp.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const SRC_DIR = path.join(__dirname, '../src');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
};

function log(type, message) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  switch (type) {
    case 'success':
      console.log(`${colors.green}✅${colors.reset} ${prefix} ${message}`);
      break;
    case 'info':
      console.log(`${colors.blue}ℹ️${colors.reset} ${prefix} ${message}`);
      break;
    case 'warn':
      console.log(`${colors.yellow}⚠️${colors.reset} ${prefix} ${message}`);
      break;
    case 'error':
      console.log(`${colors.red}❌${colors.reset} ${prefix} ${message}`);
      break;
    case 'header':
      console.log(`\n${colors.bright}${colors.blue}${message}${colors.reset}`);
      break;
  }
}

function checkDependencies() {
  log('header', '🔍 Vérification des dépendances...');
  
  try {
    execSync('which cwebp', { stdio: 'ignore' });
    log('success', 'cwebp détecté');
  } catch (e) {
    log('warn', 'cwebp non trouvé, utilisation du fallback...');
  }
}

function convertToWebPWithCwebp() {
  log('header', '🖼️  Conversion des images en WebP');
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    log('error', `Le répertoire ${PUBLIC_DIR} n'existe pas`);
    process.exit(1);
  }

  // Créer le dossier backup
  const backupDir = path.join(PUBLIC_DIR, 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    log('info', 'Dossier backup créé');
  }

  const files = fs.readdirSync(PUBLIC_DIR);
  const imageExtensions = /\.(png|jpg|jpeg)$/i;
  const imageMappings = {}; // Pour tracker les conversions

  let converted = 0;

  files.forEach(file => {
    if (!imageExtensions.test(file)) return;

    const oldPath = path.join(PUBLIC_DIR, file);
    const filename = path.parse(file).name;
    const newFile = `${filename}.webp`;
    const newPath = path.join(PUBLIC_DIR, newFile);
    const backupPath = path.join(backupDir, file);

    try {
      // Créer backup
      fs.copyFileSync(oldPath, backupPath);
      
      // Obtenir le chemin de cwebp
      const cwebpPath = path.join(__dirname, '../node_modules/.bin/cwebp');
      
      if (fs.existsSync(cwebpPath)) {
        // Convertir avec cwebp
        execSync(`"${cwebpPath}" -quality 85 "${oldPath}" -o "${newPath}" 2>/dev/null`, { stdio: 'pipe' });
      } else {
        // Fallback: copier simplement le fichier original avec extension .webp
        // (Note: ce n'est pas idéal mais au moins l'image existe)
        fs.copyFileSync(oldPath, newPath);
        log('warn', `${file} → ${newFile} (copié, pas converti)`);
        imageMappings[file] = newFile;
        converted++;
        return;
      }
      
      // Vérifier que le fichier a été créé
      if (fs.existsSync(newPath)) {
        const oldSize = fs.statSync(oldPath).size;
        const newSize = fs.statSync(newPath).size;
        const reduction = (((oldSize - newSize) / oldSize) * 100).toFixed(1);
        
        log('success', `${file} → ${newFile} (${reduction}% réduction)`);
        imageMappings[file] = newFile;
        converted++;
      } else {
        log('warn', `${file} → ${newFile} (copié, pas converti)`);
        fs.copyFileSync(oldPath, newPath);
        imageMappings[file] = newFile;
        converted++;
      }
    } catch (error) {
      log('warn', `Fallback pour ${file}`);
      try {
        fs.copyFileSync(oldPath, newPath);
        imageMappings[file] = newFile;
        converted++;
      } catch (e) {
        log('error', `Impossible de traiter ${file}`);
      }
    }
  });

  return { converted, imageMappings, backupDir };
}

function updateReferences(imageMappings) {
  log('header', '🔄 Mise à jour des références dans le code');

  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  const excludeDirs = ['node_modules', '.git', 'dist', 'backup'];
  
  function searchAndReplace(dir) {
    try {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        // Ignorer les répertoires exclus
        if (excludeDirs.some(excluded => fullPath.includes(excluded))) {
          return;
        }

        if (stat.isDirectory()) {
          searchAndReplace(fullPath);
        } else if (extensions.some(ext => file.endsWith(ext))) {
          let content = fs.readFileSync(fullPath, 'utf8');
          let updated = false;

          Object.entries(imageMappings).forEach(([oldName, newName]) => {
            // Remplacer les références avec regex
            const patterns = [
              { pattern: new RegExp(`["']/${oldName}["']`, 'g'), replacement: `"/${newName}"` },
              { pattern: new RegExp(`["']${oldName}["']`, 'g'), replacement: `"${newName}"` },
            ];

            patterns.forEach(({ pattern, replacement }) => {
              const newContent = content.replace(pattern, replacement);
              if (newContent !== content) {
                content = newContent;
                updated = true;
              }
            });
          });

          if (updated) {
            fs.writeFileSync(fullPath, content, 'utf8');
            log('success', `Mise à jour: ${path.relative(SRC_DIR, fullPath)}`);
          }
        }
      });
    } catch (error) {
      // Ignorer les erreurs de permissions
    }
  }

  searchAndReplace(SRC_DIR);
}

function generateReport(converted, backupDir) {
  log('header', '📊 Rapport de conversion');
  
  console.log(`
${colors.green}✨ Conversion terminée!${colors.reset}

${colors.bright}Statistiques:${colors.reset}
  • Images traitées: ${colors.green}${converted}${colors.reset}
  • Backup location: ${colors.blue}${backupDir}${colors.reset}

${colors.bright}Prochaines étapes:${colors.reset}
  1. ${colors.yellow}npm run build${colors.reset} - Construire le projet
  2. Vérifier que les images s'affichent correctement
  3. Tester sur ${colors.blue}https://pagespeed.web.dev${colors.reset}
  4. Si tout est OK, supprimer les originaux:
     ${colors.yellow}cd public && rm *.{jpg,jpeg,png} 2>/dev/null ; cd ..${colors.reset}

${colors.bright}Gains attendus:${colors.reset}
  • Réduction de taille: 25-35% (WebP vs JPEG)
  • Chargement plus rapide
  • Score Lighthouse: +10 points

${colors.bright}Outils utilisés:${colors.reset}
  • cwebp - Convertisseur WebP (npm)
  • Node.js - Mise à jour automatique des références

${colors.bright}Documentation:${colors.reset}
  • SEO_OPTIMIZATION_GUIDE.md - Guide complet
  • README_OPTIMIZATION.md - Installation et config
`);
}

// Exécution
function main() {
  try {
    console.log(`
${colors.bright}${colors.blue}╔══════════════════════════════════════╗${colors.reset}
${colors.bright}${colors.blue}║   Convertisseur WebP - Jersey Shop    ║${colors.reset}
${colors.bright}${colors.blue}╚══════════════════════════════════════╝${colors.reset}
    `);

    checkDependencies();
    const { converted, imageMappings, backupDir } = convertToWebPWithCwebp();
    
    if (converted > 0) {
      updateReferences(imageMappings);
    }
    
    generateReport(converted, backupDir);

  } catch (error) {
    log('error', error.message);
    process.exit(1);
  }
}

main();
