#!/bin/bash
# Ushbu skript faqat DentaCRM loyihasiga tegishli fayllarni Git-ga joylashtiradi (Agent fayllarisiz)
set -e

PROJECT_DIR="/home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main"

echo "DentaCRM loyihasini Git-ga yuklash boshlanmoqda..."

# 1. Hujjatlarni docs/ papkasiga nusxalash
mkdir -p "$PROJECT_DIR/dentacrm/docs"
cp "$PROJECT_DIR/PROJECT_BRIEF.md" "$PROJECT_DIR/dentacrm/docs/"
cp "$PROJECT_DIR/loyiha_haqida.md" "$PROJECT_DIR/dentacrm/docs/"

# 2. dentacrm ichiga kirish
cd "$PROJECT_DIR/dentacrm"

# 3. Git-ni sozlash
if [ ! -d ".git" ]; then
    git init
fi

# 4. Masofaviy repozitoriyani sozlash
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Seymonbek/DentaCRM.git

# 5. Branch nomini main qilish
git branch -M main

# 6. Fayllarni sahnaga qo'shish va commit qilish
git add .
git commit -m "feat(project): initialize DentaCRM project repository" || echo "O'zgarishlar yo'q yoki allaqachon commit qilingan."

# 7. Masofaviy repozitoriyaga yuborish (force-push orqali agent fayllarini tozalaydi)
echo "GitHub-ga push qilinmoqda..."
git push -u -f origin main

echo "Muvaffaqiyatli yakunlandi! Loyiha https://github.com/Seymonbek/DentaCRM.git manziliga faqat loyihaga tegishli fayllar bilan yuklandi."
