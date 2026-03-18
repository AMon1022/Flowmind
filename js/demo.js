/**
 * FlowMind — Demo Data Seeder
 * Injecte des données de démonstration si l'application est vide.
 * N'écrase jamais des données existantes.
 */

const Demo = (() => {

  function shouldSeed(state) {
    return !state.projects || state.projects.length === 0;
  }

  function seed(state) {
    if (!shouldSeed(state)) return state;

    const now   = new Date();
    const d     = (offsetDays) => {
      const dt = new Date(now);
      dt.setDate(dt.getDate() + offsetDays);
      return dt.toISOString().slice(0, 10);
    };
    const ts    = (offsetDays, h, m) => {
      const dt = new Date(now);
      dt.setDate(dt.getDate() + offsetDays);
      dt.setHours(h || 10, m || 0, 0, 0);
      return dt.toISOString();
    };
    const id    = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const sub   = (title, status, min) => ({
      id: id(), title, estimateMin: min || 15,
      status: status || 'todo', completedAt: status === 'done' ? ts(-1) : null
    });

    // ── PROJETS ───────────────────────────────────────

    const p1 = { id: id(), name: 'Rapport Annuel TNE', color: '#4f8eff', createdAt: ts(-30) };
    const p2 = { id: id(), name: 'Refonte Site Web',   color: '#00d9a6', createdAt: ts(-20) };
    const p3 = { id: id(), name: 'Formation Python',   color: '#f59e0b', createdAt: ts(-10) };

    // ── TÂCHES PROJET 1 — Rapport Annuel TNE ─────────

    const tasks1 = [
      {
        id: id(), projectId: p1.id,
        title: 'Collecter les données financières Q4',
        description: 'Rassembler les bilans, comptes de résultat et tableaux de flux de trésorerie auprès de la comptabilité.',
        priority: 'high', status: 'done',
        dueDate: d(-5), completedAt: ts(-3),
        timeEstimate: 90, createdAt: ts(-15),
        subtasks: [
          sub('Contacter la comptabilité', 'done', 15),
          sub('Récupérer les fichiers Excel', 'done', 20),
          sub('Vérifier la cohérence des chiffres', 'done', 30),
          sub('Archiver les pièces justificatives', 'done', 15),
        ]
      },
      {
        id: id(), projectId: p1.id,
        title: 'Rédiger la synthèse exécutive',
        description: 'Résumé de 2 pages destiné aux membres du conseil d\'administration.',
        priority: 'high', status: 'inprogress',
        dueDate: d(2), completedAt: null,
        timeEstimate: 120, createdAt: ts(-10),
        subtasks: [
          sub('Définir le plan et les messages clés', 'done', 20),
          sub('Rédiger le premier jet', 'inprogress', 45),
          sub('Intégrer les indicateurs clés (KPI)', 'todo', 30),
          sub('Relecture et validation DG', 'todo', 20),
        ]
      },
      {
        id: id(), projectId: p1.id,
        title: 'Créer les graphiques et visualisations',
        description: 'Graphiques d\'évolution CA, répartition budgétaire et comparatif N-1.',
        priority: 'high', status: 'todo',
        dueDate: d(4), completedAt: null,
        timeEstimate: 90, createdAt: ts(-8),
        subtasks: [
          sub('Évolution du chiffre d\'affaires', 'todo', 25),
          sub('Répartition du budget par pôle', 'todo', 25),
          sub('Comparatif N vs N-1', 'todo', 25),
          sub('Export haute résolution', 'todo', 15),
        ]
      },
      {
        id: id(), projectId: p1.id,
        title: 'Préparer la présentation DG',
        description: 'Diaporama de 15 slides pour la réunion du 25 mars.',
        priority: 'medium', status: 'todo',
        dueDate: d(6), completedAt: null,
        timeEstimate: 120, createdAt: ts(-5),
        subtasks: [
          sub('Définir le fil conducteur', 'todo', 20),
          sub('Créer le template graphique', 'todo', 30),
          sub('Intégrer les graphiques', 'todo', 30),
          sub('Répétition et ajustements', 'todo', 40),
        ]
      },
      {
        id: id(), projectId: p1.id,
        title: 'Envoyer le rapport aux parties prenantes',
        description: 'Distribution par email + dépôt sur l\'intranet.',
        priority: 'medium', status: 'todo',
        dueDate: d(10), completedAt: null,
        timeEstimate: 30, createdAt: ts(-3),
        subtasks: [
          sub('Finaliser le PDF du rapport', 'todo', 15),
          sub('Rédiger l\'email d\'accompagnement', 'todo', 10),
          sub('Envoyer et confirmer les accusés', 'todo', 10),
        ]
      },
      {
        id: id(), projectId: p1.id,
        title: 'Réunion de revue avec le comité',
        description: 'Présentation des résultats et recueil des observations.',
        priority: 'low', status: 'deferred',
        dueDate: d(14), completedAt: null,
        timeEstimate: 60, createdAt: ts(-2),
        subtasks: [
          sub('Envoyer les convocations', 'todo', 10),
          sub('Préparer les supports de salle', 'todo', 15),
          sub('Rédiger le compte-rendu', 'todo', 30),
        ]
      },
    ];

    // ── TÂCHES PROJET 2 — Refonte Site Web ───────────

    const tasks2 = [
      {
        id: id(), projectId: p2.id,
        title: 'Audit UX de l\'existant',
        description: 'Analyse des points de friction et du parcours utilisateur actuel.',
        priority: 'high', status: 'done',
        dueDate: d(-10), completedAt: ts(-8),
        timeEstimate: 60, createdAt: ts(-20),
        subtasks: [
          sub('Heatmaps et enregistrements sessions', 'done', 20),
          sub('Interviews de 5 utilisateurs', 'done', 30),
          sub('Synthèse des insights', 'done', 20),
        ]
      },
      {
        id: id(), projectId: p2.id,
        title: 'Wireframes des nouvelles pages',
        description: 'Maquettes basse fidélité pour Home, Services, Contact.',
        priority: 'high', status: 'done',
        dueDate: d(-6), completedAt: ts(-5),
        timeEstimate: 90, createdAt: ts(-15),
        subtasks: [
          sub('Page d\'accueil', 'done', 30),
          sub('Page Services', 'done', 30),
          sub('Page Contact', 'done', 20),
          sub('Validation client', 'done', 15),
        ]
      },
      {
        id: id(), projectId: p2.id,
        title: 'Intégration HTML/CSS responsive',
        description: 'Développement front-end mobile-first.',
        priority: 'high', status: 'inprogress',
        dueDate: d(3), completedAt: null,
        timeEstimate: 180, createdAt: ts(-8),
        subtasks: [
          sub('Structure HTML sémantique', 'done', 40),
          sub('Styles CSS / variables', 'done', 40),
          sub('Responsive mobile', 'inprogress', 40),
          sub('Animations et transitions', 'todo', 30),
          sub('Cross-browser testing', 'todo', 30),
        ]
      },
      {
        id: id(), projectId: p2.id,
        title: 'Optimisation SEO on-page',
        description: 'Balises meta, structure H1-H6, performance Core Web Vitals.',
        priority: 'medium', status: 'todo',
        dueDate: d(5), completedAt: null,
        timeEstimate: 60, createdAt: ts(-4),
        subtasks: [
          sub('Audit des balises meta', 'todo', 20),
          sub('Optimisation des images', 'todo', 20),
          sub('Amélioration du score Lighthouse', 'todo', 25),
        ]
      },
      {
        id: id(), projectId: p2.id,
        title: 'Recette et mise en production',
        description: 'Tests finaux et déploiement sur le serveur de production.',
        priority: 'high', status: 'todo',
        dueDate: d(8), completedAt: null,
        timeEstimate: 90, createdAt: ts(-2),
        subtasks: [
          sub('Tests fonctionnels complets', 'todo', 30),
          sub('Sauvegarde de l\'ancien site', 'todo', 15),
          sub('Déploiement et DNS', 'todo', 20),
          sub('Vérification post-déploiement', 'todo', 25),
        ]
      },
    ];

    // ── TÂCHES PROJET 3 — Formation Python ───────────

    const tasks3 = [
      {
        id: id(), projectId: p3.id,
        title: 'Module 1 — Bases du langage',
        description: 'Variables, types, conditions, boucles.',
        priority: 'high', status: 'done',
        dueDate: d(-7), completedAt: ts(-6),
        timeEstimate: 120, createdAt: ts(-10),
        subtasks: [
          sub('Lire la documentation officielle', 'done', 30),
          sub('Exercices variables et types', 'done', 30),
          sub('TP conditions et boucles', 'done', 45),
        ]
      },
      {
        id: id(), projectId: p3.id,
        title: 'Module 2 — Fonctions et modules',
        description: 'Définir des fonctions, importer des bibliothèques.',
        priority: 'high', status: 'inprogress',
        dueDate: d(1), completedAt: null,
        timeEstimate: 120, createdAt: ts(-5),
        subtasks: [
          sub('Fonctions : def, return, arguments', 'done', 30),
          sub('Modules : import, pip', 'inprogress', 30),
          sub('TP mini-calculatrice', 'todo', 45),
          sub('Quiz de validation', 'todo', 15),
        ]
      },
      {
        id: id(), projectId: p3.id,
        title: 'Module 3 — Manipulation de données',
        description: 'Pandas, lecture CSV, nettoyage de données.',
        priority: 'medium', status: 'todo',
        dueDate: d(8), completedAt: null,
        timeEstimate: 150, createdAt: ts(-2),
        subtasks: [
          sub('Installer Pandas et NumPy', 'todo', 15),
          sub('Lire et explorer un DataFrame', 'todo', 30),
          sub('Nettoyer les données manquantes', 'todo', 30),
          sub('Agréger et filtrer', 'todo', 30),
          sub('TP sur dataset réel', 'todo', 45),
        ]
      },
      {
        id: id(), projectId: p3.id,
        title: 'Module 4 — Visualisation avec Matplotlib',
        description: 'Graphiques, personnalisation, export.',
        priority: 'low', status: 'todo',
        dueDate: d(15), completedAt: null,
        timeEstimate: 90, createdAt: ts(-1),
        subtasks: [
          sub('Courbes et nuages de points', 'todo', 25),
          sub('Histogrammes et barres', 'todo', 25),
          sub('Personnalisation et thèmes', 'todo', 20),
          sub('Export PNG / SVG', 'todo', 20),
        ]
      },
      {
        id: id(), projectId: p3.id,
        title: 'Projet final — Analyse de données TNE',
        description: 'Appliquer les compétences Python sur des données réelles du projet TNE.',
        priority: 'medium', status: 'deferred',
        dueDate: d(21), completedAt: null,
        timeEstimate: 180, createdAt: ts(-1),
        subtasks: [
          sub('Définir le périmètre d\'analyse', 'todo', 20),
          sub('Collecter les données source', 'todo', 30),
          sub('Nettoyage et préparation', 'todo', 45),
          sub('Analyse exploratoire', 'todo', 45),
          sub('Rapport et visualisations', 'todo', 40),
        ]
      },
    ];

    // ── HISTORIQUE ACCOMPLI ───────────────────────────

    const completedHistory = [];
    [...tasks1, ...tasks2, ...tasks3]
      .filter(t => t.status === 'done')
      .forEach(t => {
        completedHistory.unshift({
          taskId:      t.id,
          title:       t.title,
          projectId:   t.projectId,
          completedAt: t.completedAt
        });
      });

    // ── INJECTION ─────────────────────────────────────

    state.projects         = [p1, p2, p3];
    state.tasks            = [...tasks1, ...tasks2, ...tasks3];
    state.completedHistory = completedHistory;
    state.xp               = 120;
    state.level            = 2;
    state.streak           = 3;
    state.lastActiveDate   = new Date().toISOString().slice(0, 10);

    console.log('[FlowMind Demo] Données de démonstration chargées :', {
      projets: state.projects.length,
      tâches:  state.tasks.length,
      faites:  state.tasks.filter(t => t.status === 'done').length,
    });

    return state;
  }

  return { seed, shouldSeed };
})();
