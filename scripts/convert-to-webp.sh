#!/bin/bash

# Script de conversion des images en WebP
# Usage: bash convert-to-webp.sh

set -e

echo "🖼️  Conversion des images en WebP..."
echo "======================================"

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé"
    echo "Installation sur macOS:"
    echo "  brew install imagemagick"
    exit 1
fi

# Répertoire public
PUBLIC_DIR="public"
CONVERTED=0
FAILED=0

# Créer un backup
echo "📦 Création d'un backup..."
if [ ! -d "$PUBLIC_DIR/backup" ]; then
    mkdir -p "$PUBLIC_DIR/backup"
fi

# Convertir PNG en WebP
echo ""
echo "📝 Conversion des PNG..."
for file in "$PUBLIC_DIR"/*.png; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .png)
        
        # Skip .htaccess et autres fichiers spéciaux
        if [[ "$filename" == ".htaccess" ]] || [[ "$filename" == "manifest" ]]; then
            continue
        fi
        
        output="$PUBLIC_DIR/${filename}.webp"
        
        # Copier en backup
        cp "$file" "$PUBLIC_DIR/backup/$(basename "$file")"
        
        # Convertir avec ImageMagick (qualité 85)
        convert "$file" -quality 85 -define webp:method=6 "$output"
        
        echo "  ✅ $filename.png → ${filename}.webp"
        ((CONVERTED++))
    fi
done

# Convertir JPEG/JPG en WebP
echo ""
echo "📝 Conversion des JPEG..."
for file in "$PUBLIC_DIR"/*.{jpg,jpeg}; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" | sed 's/\.[^.]*$//')
        
        output="$PUBLIC_DIR/${filename}.webp"
        
        # Copier en backup
        cp "$file" "$PUBLIC_DIR/backup/$(basename "$file")"
        
        # Convertir avec ImageMagick (qualité 85)
        convert "$file" -quality 85 -define webp:method=6 "$output"
        
        echo "  ✅ $filename.jpg(eg) → ${filename}.webp"
        ((CONVERTED++))
    fi
done

echo ""
echo "======================================"
echo "✨ Conversion terminée!"
echo "📊 Images converties: $CONVERTED"
echo "📁 Backups sauvegardés dans: $PUBLIC_DIR/backup"
echo ""
echo "⚠️  Prochaines étapes:"
echo "  1. Vérifier les images converties"
echo "  2. Mettre à jour les références dans le code"
echo "  3. Tester le site"
echo "  4. Supprimer les originaux si satisfait (optionnel)"
echo ""
