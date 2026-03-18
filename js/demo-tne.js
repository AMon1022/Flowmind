/**
 * FlowMind — Données TNE extraites du document Word
 * Source : A_faire_TNE_formation_24012026 (pages 1-6, avant MEMO)
 * Statuts déduits du surlignage et du contexte :
 *   • Surligné + contexte "ok/fait/envoyé" → done
 *   • Surligné + action en cours           → inprogress
 *   • Non surligné / actions futures       → todo
 */

const DemoTNE = (() => {

  function getProject(state) {
    return (state.projects || []).find(p => p.name === 'TNE — Gestion Formation PAF') || null;
  }

  function shouldSeed(state) {
    return !getProject(state);
  }

  function seed(state) {
    if (!shouldSeed(state)) return state;

    const id  = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const now = new Date();
    const ts  = (offsetDays) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString();
    };
    const due = (offsetDays) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    };
    const sub = (title, status, min) => ({
      id: id(), title, estimateMin: min || 15,
      status: status || 'todo',
      completedAt: status === 'done' ? ts(-5) : null
    });

    // ── PROJET TNE ────────────────────────────────────────────────
    const pTNE = {
      id: id(),
      name: 'TNE — Gestion Formation PAF',
      color: '#c084fc',
      createdAt: ts(-60)
    };

    const tasks = [

      // ── 1. FORMATIONS VR LIEN — GESTION DES GROUPES ──────────
      {
        id: id(), projectId: pTNE.id,
        title: 'VR LIEN — Gestion et restructuration des groupes',
        description: 'Modules 70777, 70778, 70779 — passer en statut 2, gérer transferts et suppressions avec Joel et Sandrine.',
        priority: 'high', status: 'inprogress',
        dueDate: due(3), completedAt: null,
        timeEstimate: 120, createdAt: ts(-20),
        subtasks: [
          sub('Passer groupes 70778 en statut 2 (sauf 5,6,12,13)', 'done', 20),
          sub('Ajouter les CE et enlever Alexandra des intervenants', 'done', 15),
          sub('Envoyer validation à IVY', 'todo', 10),
          sub('70777 grp 9,10,11 — voir avec Joel : maintien ou transfert', 'inprogress', 20),
          sub('70679 grp 4 — voir avec Joel (+ Baron)', 'inprogress', 15),
          sub('Après validation Joel : appeler Sandrine', 'todo', 10),
          sub('Envoyer mail grp 9,10,11 puis Sandrine pour suppression', 'todo', 15),
          sub('Passer en statut 2 et écrire à Sandrine (N° module + groupes à supprimer)', 'todo', 15),
        ]
      },

      // ── 2. SÉMINAIRE IA 4 FÉVRIER 2026 (70752) ───────────────
      {
        id: id(), projectId: pTNE.id,
        title: 'Séminaire IA — 4 février 2026 (module 70752)',
        description: 'Créer le module désigné, gérer les 105 stagiaires, organiser le programme et la communication.',
        priority: 'high', status: 'inprogress',
        dueDate: due(10), completedAt: null,
        timeEstimate: 180, createdAt: ts(-15),
        subtasks: [
          sub('Créer le module et ajouter les 105 stagiaires', 'inprogress', 30),
          sub('Donner le lien de préinscription', 'todo', 10),
          sub('Voir pour module public désigné', 'todo', 15),
          sub('Demander à Sandrine : augmentation nb stagiaires + enveloppe financière', 'todo', 15),
          sub('Écrire aux intervenants séminaire IA pour temps + conditions déplacements', 'done', 20),
          sub('Définir les ateliers et le programme', 'todo', 30),
          sub('Identifier les formateurs (Romain ou Laeticia / chargés de missions)', 'todo', 20),
          sub('Communication : via EAFC + site DRANE + lettre CE (Caroline) + boîte TNE', 'todo', 20),
        ]
      },

      // ── 3. MODULE LIEN NIVEAU 1 — RESTRUCTURATION ────────────
      {
        id: id(), projectId: pTNE.id,
        title: 'LIEN Niveau 1 — Restructuration modules et groupes',
        description: 'Fermeture des groupes LIEN Niveau 1, création nouveau module DEP, regroupements géographiques.',
        priority: 'high', status: 'inprogress',
        dueDate: due(14), completedAt: null,
        timeEstimate: 150, createdAt: ts(-10),
        subtasks: [
          sub('70778 — Fermer groupes 8,9,10,11 + récupérer stagiaires + prévenir étab. accueil', 'inprogress', 30),
          sub('Créer nouveau module DEP 13 avec 4 groupes (dupliquer 70778)', 'todo', 30),
          sub('Supprimer groupe Étoile et Salon', 'done', 10),
          sub('La Crau 70778 grp 7 — intégrer à Salon', 'todo', 15),
          sub('Regrouper Camargues à Salon avec La Crau — voir Sandrine', 'todo', 15),
          sub('Regrouper groupes 8,9,10 le jeudi 29/01 sur Vieux Port', 'todo', 20),
          sub('Groupe 12 (05/02) Laura Miousset — établissement Matraja OK', 'done', 15),
          sub('Groupe 13 (11/02) Geoffroy — Collège Sophie Germain — à modifier 19/12', 'done', 15),
          sub('Basculer niveau 1 fermés sur dates du niveau 2', 'todo', 20),
        ]
      },

      // ── 4. MODULE LIEN NIVEAU 2 — CRÉATION SESSIONS ──────────
      {
        id: id(), projectId: pTNE.id,
        title: 'LIEN Niveau 2 — Création des 4 sessions Aix',
        description: 'Créer 4 groupes points cardinaux pour les formations Aix Niveau 2 (modules 70679, 70684, 70779).',
        priority: 'medium', status: 'todo',
        dueDate: due(21), completedAt: null,
        timeEstimate: 90, createdAt: ts(-5),
        subtasks: [
          sub('Groupe 01 — Aix Est (11/03)', 'todo', 20),
          sub('Groupe 02 — Aix Ouest (12/03)', 'todo', 20),
          sub('Groupe 03 — Aix Nord (25/03)', 'todo', 20),
          sub('Groupe 04 — Aix Sud (26/03)', 'todo', 20),
          sub('Module 74417 — Déc/Utilisation LIEN Dep13 (27/04 Lycée Vauvenargues)', 'todo', 15),
          sub('Module 74418 — Déc/Utilisation LIEN Dep84-04-05 (28/04 — chercher étab Pertuis/Meyragues)', 'todo', 15),
          sub('Envoyer tous les liens de préinscriptions une fois les modules créés', 'todo', 15),
        ]
      },

      // ── 5. NIVEAU 0 BIS — NOUVEAU MODULE LIEN LANGUES ────────
      {
        id: id(), projectId: pTNE.id,
        title: 'Niveau 0 bis — Nouveau module "Découverte LIEN Langues Immersives"',
        description: 'Créer nouveaux modules pour 13 (Dep) et 84-04-05 (Acad) — voir avec Philippe pour CSI Jacques Chirac PFE.',
        priority: 'medium', status: 'todo',
        dueDate: due(25), completedAt: null,
        timeEstimate: 60, createdAt: ts(-3),
        subtasks: [
          sub('Créer module 74417 "Déc. LIEN langue immersive - 13" (dupliquer 70777, 2 groupes Dep)', 'todo', 25),
          sub('Créer module 74418 "Déc. LIEN langue immersive - 84-04-05" (dupliquer 70679, 1 groupe Acad)', 'todo', 25),
          sub('Voir avec Philippe pour PFE CSI Jacques Chirac (04 + 05 + 84)', 'todo', 15),
          sub('Supprimer "pour raison hiérarchique" sur module 70683', 'todo', 10),
        ]
      },

      // ── 6. GT PERDIR IA — GESTION STAGIAIRES ─────────────────
      {
        id: id(), projectId: pTNE.id,
        title: 'GT Perdir IA — Création groupe et gestion stagiaires',
        description: 'Groupe avec 2 sessions (25/11/2025 et 02/04/2026), asynchrone jusqu\'au 30/06.',
        priority: 'medium', status: 'inprogress',
        dueDate: due(7), completedAt: null,
        timeEstimate: 60, createdAt: ts(-8),
        subtasks: [
          sub('Ajouter stagiaires (tous sauf en rouge)', 'done', 20),
          sub('Créer groupe avec 2 sessions (25/11 et 02/04/2026)', 'inprogress', 20),
          sub('Configurer asynchrone du 26/11 au 30/06', 'todo', 15),
          sub('GT en désigné / séminaires en inscription', 'todo', 10),
          sub('Créer nouveau module : 1 session Séminaire IA Niv.1 + 1 session désigné', 'todo', 20),
        ]
      },

      // ── 7. VR NIVEAU 0 — ACTIONS TERMINÉES ───────────────────
      {
        id: id(), projectId: pTNE.id,
        title: 'VR Niveau 0 — Gestion des formations et annulations',
        description: 'Actions suite aux annulations et réorganisations des groupes VR niveau 0.',
        priority: 'high', status: 'done',
        dueDate: due(-10), completedAt: ts(-7),
        timeEstimate: 90, createdAt: ts(-25),
        subtasks: [
          sub('03/11 — Transmettre listes stagiaires aux établissements', 'done', 20),
          sub('04/11 — Mail annulation aux stagiaires via SOFIA + mail établissement', 'done', 20),
          sub('Conserver les mails des stagiaires', 'done', 10),
          sub('07/11 — Trouver emails stagiaires niv.0 par dates de formation', 'done', 20),
          sub('Voir si création formations DEP (pas réseau) sur TNE 13 pour niveau 0', 'done', 15),
          sub('Voir avec Sandrine pour procédure de publication préinscription', 'done', 15),
        ]
      },

      // ── 8. VITROLLES — ÉVÉNEMENT 26 MAI - 2 JUIN ─────────────
      {
        id: id(), projectId: pTNE.id,
        title: 'Vitrolles — Préparation événement 26 mai au 2 juin',
        description: 'Webradio, stands VR, ateliers numériques. Intervention DRANE du 18 au 20 mai. Accueil à la médiathèque.',
        priority: 'low', status: 'todo',
        dueDate: due(60), completedAt: null,
        timeEstimate: 120, createdAt: ts(-2),
        subtasks: [
          sub('Contacter les 4 collèges de Vitrolles pour Webradio', 'todo', 20),
          sub('Lister les projets et ateliers potentiels (VR, Webradio, IA, fake-news...)', 'todo', 30),
          sub('Identifier les intervenants internes et externes', 'todo', 20),
          sub('Organiser le café IA (élèves, parents, spécialistes, enseignants)', 'todo', 20),
          sub('Coordonner avec la Ligue de l\'enseignement pour déploiement', 'todo', 15),
        ]
      },

      // ── 9. LP RENÉ CAILLÉ — FORMATION NUMÉRIQUE ──────────────
      {
        id: id(), projectId: pTNE.id,
        title: 'LP René Caillé — Formation numérique (70782 / 74028)',
        description: 'Formation prévue janvier/février un vendredi. Module 70782 Grp07 + 74028 Grp02.',
        priority: 'medium', status: 'inprogress',
        dueDate: due(14), completedAt: null,
        timeEstimate: 60, createdAt: ts(-12),
        subtasks: [
          sub('Clarifier : qui, combien, quand (vu avec Romain Estampes le 28/11)', 'done', 15),
          sub('Infos transmises à Frédéric Scotti', 'done', 10),
          sub('Confirmer la date (vendredi janvier ou février)', 'todo', 10),
          sub('Finaliser les modalités de déplacement', 'todo', 15),
        ]
      },

      // ── 10. COPIL — SÉMINAIRE TNE COSTRAT 12/02 ──────────────
      {
        id: id(), projectId: pTNE.id,
        title: 'COSTRAT 12/02 — Préparation chiffres et préinscrits séminaires',
        description: 'Préparer les données pour le COPIL : individuelle, PFE, séminaires. Gérer liste préinscrits séminaire IA niveau 2 (25/03).',
        priority: 'high', status: 'todo',
        dueDate: due(5), completedAt: null,
        timeEstimate: 90, createdAt: ts(-3),
        subtasks: [
          sub('Sortir chiffres individuelle/PFE : nb stagiaires, sessions, thématiques (2024-2025)', 'todo', 30),
          sub('Trouver les emails des mairies (COPIL séminaire TNE)', 'todo', 20),
          sub('Séminaire IA niv.2 25/03 — Retirer préinscrits : Stevens Covello, Delattre, Levêque, Buffard', 'todo', 15),
          sub('Retrouver volume vacations PAF 2024-2025 pour budget T2 (EAFC SB modules PSOP)', 'todo', 25),
        ]
      },

    ];

    // Historique des tâches terminées
    const completedHistory = [];
    tasks.filter(t => t.status === 'done').forEach(t => {
      completedHistory.push({
        taskId: t.id, title: t.title,
        projectId: t.projectId, completedAt: t.completedAt
      });
    });

    state.projects = [...(state.projects || []), pTNE];
    state.tasks    = [...(state.tasks || []), ...tasks];
    state.completedHistory = [...(state.completedHistory || []), ...completedHistory];

    console.log('[FlowMind DemoTNE] Projet TNE chargé :', {
      tâches: tasks.length,
      'sous-tâches': tasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0)
    });

    return state;
  }

  return { seed, shouldSeed, getProject };
})();
