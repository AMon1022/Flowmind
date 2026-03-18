# FlowMind — Analyse & Conseils d'Amélioration

## Contexte
FlowMind est une SPA (Single Page Application) de gestion de tâches conçue pour les personnes avec TDA/H. L'app est entièrement client-side (localStorage, vanilla JS, CSS glassmorphism). L'analyse couvre architecture, qualité de code, UX, sécurité et performance.

---

## Liste des améliorations recommandées

### 🔴 Priorité haute

1. **Sécurité XSS — cohérence de `_esc()`**
   - `_esc()` est défini 2 fois dans app.js (lignes ~579 et ~740) mais pas appliqué partout
   - Certains titres de tâches et noms de projets sont insérés via `.innerHTML` sans échappement
   - → Centraliser `_esc()` dans `storage.js` ou un `utils.js`, l'appliquer systématiquement

2. **Gestion des erreurs manquante**
   - Aucun `try-catch` autour des opérations localStorage
   - En cas de quota dépassé → échec silencieux, données perdues sans avertissement
   - → Wrapper les `Storage.save()` / `Storage.load()` avec gestion d'erreur + notification utilisateur

3. **Timer : désynchronisation UI**
   - Le timer continue si le modal Focus est fermé manuellement
   - L'état pause/reprend n'est pas persisté (perdu au reload)
   - → Ajouter un `clearInterval` sur fermeture du modal ; sauvegarder l'état timer dans le state

4. **Validation des entrées**
   - Aucune limite de longueur sur les champs texte (titre, description)
   - L'URL iCal n'est pas validée avant la requête fetch
   - → Ajouter `maxlength` HTML + vérification regex URL dans `ical.js`

---

### 🟠 Priorité moyenne

5. **Champs inutilisés (recurrence, tags)**
   - Définis dans le modèle de tâche (`tasks.js` ligne ~53) mais jamais exploités
   - → Implémenter ou supprimer pour alléger le modèle et éviter la confusion

6. **Fonction `_esc()` dupliquée**
   - 2 définitions identiques dans `app.js`
   - → Supprimer le doublon, extraire dans `utils.js`

7. **Accessibilité (a11y)**
   - Boutons emoji sans `aria-label`
   - Modal Focus n'emprisonne pas le focus clavier (Tab sort du modal)
   - SVG du timer non lisible par lecteur d'écran (`aria-hidden` manquant ou description absente)
   - Indicateurs de priorité visuels (couleur seule) sans libellé texte
   - → Ajouter `aria-label`, `role="dialog"`, `aria-live` sur le timer

8. **Performance : re-render complet à chaque action**
   - `App.refresh()` re-rend tous les modules sans cibler uniquement ce qui a changé
   - La liste de tâches est re-créée entièrement à chaque mise à jour
   - → Introduire des fonctions de mise à jour partielles (ex: `_refreshTaskRow(id)`)

9. **CSS monolithique (2602 lignes)**
   - Un seul fichier `main.css` difficile à maintenir
   - → Organiser en sections commentées ou séparer en fichiers (`timer.css`, `gamification.css`, `focus.css`)

10. **Système de feedback incomplet**
    - Bouton "💬 Feedback" visible dans l'UI mais les données collectées ne sont jamais consultables
    - → Ajouter une vue ou export des feedbacks, ou supprimer le bouton si non utilisé

---

### 🟡 Priorité basse / Évolutions

11. **PWA (Progressive Web App)**
    - Pas de Service Worker → pas d'accès offline garanti, pas d'installation sur écran d'accueil
    - → Ajouter `manifest.json` + Service Worker minimal pour cache-first

12. **Recherche et filtre textuel sur le dashboard**
    - Les tâches sont triables mais pas filtrables par texte
    - → Ajouter un champ de recherche rapide avec debounce (300ms)

13. **i18n / Internationalisation**
    - Tous les textes sont en dur en français dans les modules JS
    - → Extraire les strings dans un objet `STRINGS` ou fichier `fr.json` pour faciliter la traduction future

14. **Gestion multi-onglets**
    - Deux onglets ouverts simultanément = corruption possible du state localStorage
    - → Utiliser l'événement `storage` ou un `BroadcastChannel` pour synchroniser les onglets

15. **IndexedDB pour les gros volumes**
    - localStorage limité à ~5-10MB
    - Avec historique important (500+ tâches complètes), approche de la limite
    - → Migrer `completedHistory` vers IndexedDB comme archive

16. **Démo : deux fichiers redondants (demo.js / demo-tne.js)**
    - Logique identique, données différentes
    - → Unifier en un seul fichier avec paramètre ou jeu de données configurables

17. **Sécurité : proxy iCal public**
    - `ical.js` utilise un proxy public CORS pour importer des flux iCal externes
    - Risque si l'URL redirige vers du contenu malveillant
    - → Valider l'URL, afficher un avertissement utilisateur sur le risque proxy

---

## Fichiers critiques concernés

| Fichier | Lignes | Priorité |
|---------|--------|----------|
| [js/app.js](js/app.js) | 839 | XSS, re-render, _esc() dupliqué |
| [js/tasks.js](js/tasks.js) | 436 | Champs inutilisés, validation |
| [js/storage.js](js/storage.js) | 95 | Gestion erreurs localStorage |
| [js/timer.js](js/timer.js) | 159 | Désync UI, état non persisté |
| [js/ical.js](js/ical.js) | 218 | Proxy public, validation URL |
| [css/main.css](css/main.css) | 2602 | Organisation, taille |
| [index.html](index.html) | 333 | ARIA, accessibilité |

---

## Vérification
- Tester l'application manuellement dans le navigateur après chaque modification
- Vérifier localStorage dans les DevTools (Application > Storage)
- Tester le mode focus avec fermeture prématurée du modal
- Tester avec un lecteur d'écran (NVDA ou VoiceOver) pour l'accessibilité
