/**
 * FlowMind — Reports Module
 * Génération de rapports d'activité par projet et période
 */

const Reports = (() => {
  let _state = null;

  function init(state) {
    _state = state;
    _bindUI();
  }

  function _bindUI() {
    document.getElementById('generate-report-btn')?.addEventListener('click', generate);
    document.getElementById('export-report-btn')?.addEventListener('click', exportMarkdown);
  }

  function generate() {
    if (!_state) return;

    const projectFilter = document.getElementById('report-project-filter')?.value || 'all';
    const period = document.getElementById('report-period')?.value || 'week';
    const container = document.getElementById('report-output');
    if (!container) return;

    const history = _filterHistory(projectFilter, period);
    const stats   = _computeStats(history, projectFilter);

    if (!history.length) {
      container.innerHTML = '<div class="empty-state">Aucune tâche accomplie sur cette période. Continuez, vous y êtes presque !</div>';
      return;
    }

    container.innerHTML = '';
    container.appendChild(_buildReportDOM(history, stats, projectFilter, period));
  }

  function _filterHistory(projectFilter, period) {
    const history = _state.completedHistory || [];
    const now = new Date();
    let since;

    if (period === 'week') {
      since = new Date(now);
      since.setDate(since.getDate() - 7);
    } else if (period === 'month') {
      since = new Date(now);
      since.setMonth(since.getMonth() - 1);
    } else {
      since = null;
    }

    return history.filter(h => {
      if (since && new Date(h.completedAt) < since) return false;
      if (projectFilter !== 'all' && h.projectId !== projectFilter) return false;
      return true;
    });
  }

  function _computeStats(history, projectFilter) {
    const byProject = {};
    history.forEach(h => {
      if (!byProject[h.projectId]) byProject[h.projectId] = [];
      byProject[h.projectId].push(h);
    });
    return { total: history.length, byProject };
  }

  function _buildReportDOM(history, stats, projectFilter, period) {
    const frag = document.createDocumentFragment();
    const periodLabels = { week: '7 derniers jours', month: '30 derniers jours', all: 'Tout l\'historique' };

    // Header
    const header = document.createElement('div');
    header.className = 'report-section';
    header.innerHTML = `
      <h2>📊 Rapport d'activité — ${periodLabels[period]}</h2>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px">
        <div class="stat-report-pill">
          <div style="font-size:28px;font-weight:700;color:var(--success);font-family:var(--font-mono)">${stats.total}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">tâches accomplies</div>
        </div>
        <div class="stat-report-pill">
          <div style="font-size:28px;font-weight:700;color:var(--accent);font-family:var(--font-mono)">${Object.keys(stats.byProject).length}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">projets actifs</div>
        </div>
        <div class="stat-report-pill">
          <div style="font-size:28px;font-weight:700;color:var(--amber);font-family:var(--font-mono)">${_state.streak || 0}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">jours consécutifs</div>
        </div>
      </div>
    `;
    frag.appendChild(header);

    // Par projet
    for (const [projectId, tasks] of Object.entries(stats.byProject)) {
      const project = Projects.getById(projectId);
      const projectName = project?.name || 'Projet supprimé';
      const color = project?.color || 'var(--text-muted)';

      const section = document.createElement('div');
      section.className = 'report-section';

      const grouped = _groupByDate(tasks);
      let html = `<h3 style="border-left:3px solid ${color};padding-left:10px">${_esc(projectName)} (${tasks.length})</h3>`;

      for (const [date, dateTasks] of Object.entries(grouped)) {
        html += `<div style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono);margin:8px 0 4px">${date}</div>`;
        dateTasks.forEach(t => {
          html += `
            <div class="report-task-row">
              <span class="report-done-mark">✓</span>
              <span class="report-task-name">${_esc(t.title)}</span>
              <span class="report-task-time">${_formatTime(t.completedAt)}</span>
            </div>`;
        });
      }

      section.innerHTML = html;
      frag.appendChild(section);
    }

    return frag;
  }

  function _groupByDate(tasks) {
    const groups = {};
    tasks.forEach(t => {
      const dateKey = new Date(t.completedAt).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return groups;
  }

  function exportMarkdown() {
    if (!_state) return;
    const projectFilter = document.getElementById('report-project-filter')?.value || 'all';
    const period = document.getElementById('report-period')?.value || 'week';
    const history = _filterHistory(projectFilter, period);
    const stats   = _computeStats(history, projectFilter);

    const periodLabels = { week: '7 derniers jours', month: '30 derniers jours', all: 'Tout l\'historique' };
    const now = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });

    let md = `# Rapport d'activité FlowMind\n\n`;
    md += `**Généré le :** ${now}  \n`;
    md += `**Période :** ${periodLabels[period]}  \n`;
    md += `**Tâches accomplies :** ${stats.total}  \n`;
    md += `**Jours consécutifs :** ${_state.streak || 0} 🔥\n\n`;
    md += `---\n\n`;

    for (const [projectId, tasks] of Object.entries(stats.byProject)) {
      const project = Projects.getById(projectId);
      const projectName = project?.name || 'Projet supprimé';

      md += `## ${projectName} (${tasks.length} tâche${tasks.length > 1 ? 's' : ''})\n\n`;

      const grouped = _groupByDate(tasks);
      for (const [date, dateTasks] of Object.entries(grouped)) {
        md += `### ${date}\n\n`;
        dateTasks.forEach(t => {
          md += `- [x] ${t.title} *(${_formatTime(t.completedAt)})*\n`;
        });
        md += '\n';
      }
    }

    _downloadFile(`rapport-activite-${new Date().toISOString().slice(0,10)}.md`, md, 'text/markdown');
  }

  function _downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function _formatTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  }

  function _esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { init, generate, exportMarkdown };
})();
