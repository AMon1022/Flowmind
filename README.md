# ⚡ FlowMind — Gestionnaire de tâches adapté TDA

Application web conçue spécifiquement pour les travailleurs avec un profil TDA (Trouble du Déficit de l'Attention). Fonctionne entièrement dans le navigateur, sans serveur, sans base de données.

## ✨ Fonctionnalités

### 🧠 Adapté TDA
- **Mode Focus** : N'affiche qu'une tâche à la fois pour éviter la paralysie par l'analyse
- **Décomposition automatique** : Divise une tâche complexe en micro-étapes (< 15 min) selon son contenu
- **Minuterie Time Timer** : Anneau SVG visuel avec alerte couleur progressive (cyan → orange → rouge)
- **Gamification dopaminergique** : XP, niveaux, streaks et animation de récompense à chaque validation

### 📁 Gestion multi-projets
- Projets avec couleurs personnalisées
- Tâches avec priorité, échéance, durée estimée
- Sous-tâches avec coches individuelles
- Historique complet des accomplissements

### 📅 Intégration Zimbra / iCal
- Import via URL `.ics` (avec proxy CORS)
- Import direct depuis un fichier `.ics` téléchargé
- Affichage des événements à venir et passés

### 📊 Rapports d'activité
- Filtre par projet et période (semaine / mois / tout)
- Export en Markdown prêt pour la documentation
- Vue statistique : tâches, projets actifs, streak

### ⚙ Personnalisation complète
- Couleur d'accentuation et de succès
- 3 thèmes (Sombre, Atténué, Clair)
- Durée Pomodoro configurable
- Sons de minuterie (cloche / carillon / aucun)

---

## 🚀 Déploiement sur GitHub Pages

### Étape 1 — Préparer le dépôt

```bash
# Cloner ou créer un dépôt
git init flowmind
cd flowmind

# Copier tous les fichiers du projet dans ce dossier
# Structure attendue :
# flowmind/
# ├── index.html
# ├── config.json
# ├── css/
# │   └── main.css
# └── js/
#     ├── storage.js
#     ├── config.js
#     ├── gamification.js
#     ├── timer.js
#     ├── projects.js
#     ├── tasks.js
#     ├── ical.js
#     ├── reports.js
#     └── app.js
```

### Étape 2 — Pousser sur GitHub

```bash
git add .
git commit -m "feat: FlowMind MVP v1.0"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM/flowmind.git
git push -u origin main
```

### Étape 3 — Activer GitHub Pages

1. Aller dans votre dépôt sur [github.com](https://github.com)
2. **Settings** → **Pages**
3. Source : **Deploy from a branch**
4. Branch : `main` / `/ (root)`
5. Cliquer **Save**

✅ Votre application sera accessible à :  
`https://VOTRE-NOM.github.io/flowmind/`

---

## 💡 Utilisation avec Zimbra

### Via URL iCal (recommandé)

1. Connectez-vous à votre Zimbra
2. **Préférences** → **Calendriers**
3. Cliquez sur le calendrier souhaité → **Partager**
4. Copiez l'URL iCal (format `.ics`)
5. Dans FlowMind → **Agenda** → Collez l'URL et cliquez **Importer**

> ⚠ Si vous obtenez une erreur CORS, utilisez la méthode par fichier.

### Via fichier .ics

1. Dans Zimbra : **Fichier** → **Exporter**
2. Format : **iCalendar (.ics)**
3. Dans FlowMind → **Agenda** → **Importer un fichier .ics**

---

## 🔄 Mises à jour et améliorations

Toutes les données sont stockées dans le `localStorage` du navigateur.  
Pour soumettre des retours d'usage, cliquez sur le bouton 💬 dans la barre supérieure.  
Le fichier Markdown généré peut être soumis lors de la prochaine session de développement.

### Évolutions prévues (v2)

- [ ] Synchronisation optionnelle via Firebase / Supabase
- [ ] Mode hors-ligne (PWA avec Service Worker)
- [ ] Notifications bureau (Web Push)
- [ ] Partage de projets entre utilisateurs
- [ ] Intégration API REST Zimbra directe

---

## 📦 Structure des fichiers

```
flowmind/
├── index.html          ← Point d'entrée, structure HTML
├── config.json         ← Configuration par défaut (documentation)
├── README.md           ← Ce fichier
├── css/
│   └── main.css        ← Styles, thèmes, animations
└── js/
    ├── storage.js      ← Abstraction localStorage
    ├── config.js       ← Gestion configuration & thème
    ├── gamification.js ← XP, niveaux, récompenses, streaks
    ├── timer.js        ← Minuterie Time Timer (anneau SVG)
    ├── projects.js     ← CRUD projets, rendu
    ├── tasks.js        ← CRUD tâches, décomposition, rendu
    ├── ical.js         ← Parser iCal, import Zimbra
    ├── reports.js      ← Rapports, export Markdown
    └── app.js          ← Contrôleur principal, routage
```

---

## 📝 Licence

Projet personnel — libre d'usage et de modification.
