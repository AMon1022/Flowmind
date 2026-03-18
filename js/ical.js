/**
 * FlowMind — iCal Module
 * Import et parsing de calendriers Zimbra/iCal (.ics)
 */

const ICal = (() => {
  let _state = null;
  let _onUpdate = null;

  function init(state, onUpdate) {
    _state = state;
    _onUpdate = onUpdate;
    _bindUI();
    renderEvents();
  }

  function _bindUI() {
    const importBtn  = document.getElementById('ical-import-btn');
    const fileInput  = document.getElementById('ical-file-input');

    if (importBtn) {
      importBtn.addEventListener('click', () => {
        const url = document.getElementById('ical-url-input')?.value.trim();
        if (!url) { alert('Entrez une URL .ics valide.'); return; }
        importFromUrl(url);
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const events = parseICS(ev.target.result);
          _mergeEvents(events);
          renderEvents();
          alert(`✅ ${events.length} événement(s) importé(s).`);
        };
        reader.readAsText(file);
      });
    }
  }

  async function importFromUrl(url) {
    const btn = document.getElementById('ical-import-btn');
    if (btn) { btn.textContent = '⏳ Import…'; btn.disabled = true; }

    try {
      // Tentative directe (CORS peut bloquer)
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const resp = await fetch(proxyUrl);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      const events = parseICS(text);
      _mergeEvents(events);
      renderEvents();
      alert(`✅ ${events.length} événement(s) importé(s) depuis Zimbra.`);
    } catch (e) {
      alert(`⚠ Impossible d'importer directement (restrictions CORS).\n\nSolution : Téléchargez votre calendrier depuis Zimbra (Fichier → Exporter) et importez le fichier .ics.\n\nErreur : ${e.message}`);
    } finally {
      if (btn) { btn.textContent = 'Importer'; btn.disabled = false; }
    }
  }

  function parseICS(icsText) {
    const events = [];
    const lines  = icsText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

    let current = null;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      // Gestion des lignes dépliées (continuation avec espace)
      while (i + 1 < lines.length && (lines[i+1].startsWith(' ') || lines[i+1].startsWith('\t'))) {
        i++;
        line += lines[i].substring(1);
      }

      if (line === 'BEGIN:VEVENT') {
        current = {};
      } else if (line === 'END:VEVENT' && current) {
        if (current.title) events.push(current);
        current = null;
      } else if (current) {
        const colonIdx = line.indexOf(':');
        if (colonIdx < 0) continue;
        const key = line.substring(0, colonIdx).split(';')[0].toUpperCase();
        const val = line.substring(colonIdx + 1);

        switch (key) {
          case 'SUMMARY':
            current.title = _unescapeICS(val);
            break;
          case 'DESCRIPTION':
            current.description = _unescapeICS(val).substring(0, 200);
            break;
          case 'DTSTART':
            current.start = _parseICSDate(val);
            break;
          case 'DTEND':
            current.end = _parseICSDate(val);
            break;
          case 'LOCATION':
            current.location = _unescapeICS(val);
            break;
          case 'UID':
            current.uid = val;
            break;
        }
      }
    }

    return events;
  }

  function _parseICSDate(val) {
    // Format: 20240115T093000Z ou 20240115
    const clean = val.replace('Z', '').replace(/-/g, '');
    const year  = clean.substring(0, 4);
    const month = clean.substring(4, 6);
    const day   = clean.substring(6, 8);
    const hour  = clean.substring(9, 11) || '00';
    const min   = clean.substring(11, 13) || '00';
    return new Date(`${year}-${month}-${day}T${hour}:${min}:00`).toISOString();
  }

  function _unescapeICS(str) {
    return str
      .replace(/\\n/g, '\n')
      .replace(/\\,/g, ',')
      .replace(/\\;/g, ';')
      .replace(/\\\\/g, '\\');
  }

  function _mergeEvents(newEvents) {
    if (!_state) return;
    const existingUids = new Set((_state.calendarEvents || []).map(e => e.uid));
    const toAdd = newEvents.filter(e => !e.uid || !existingUids.has(e.uid)).map(e => ({
      ...e,
      id: Storage.generateId()
    }));
    if (!_state.calendarEvents) _state.calendarEvents = [];
    _state.calendarEvents.push(...toAdd);
    if (_onUpdate) _onUpdate();
  }

  function renderEvents() {
    const container = document.getElementById('calendar-events-list');
    if (!container || !_state) return;
    container.innerHTML = '';

    const events = (_state.calendarEvents || []).filter(e => e.start);
    if (!events.length) {
      container.innerHTML = '<div class="empty-state">Aucun agenda synchronisé. Utilisez les options ci-dessus.</div>';
      return;
    }

    // Trier par date, afficher les prochains 30 jours en priorité
    const now = new Date();
    const sorted = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
    const upcoming = sorted.filter(e => new Date(e.start) >= now).slice(0, 50);
    const past = sorted.filter(e => new Date(e.start) < now).slice(-10).reverse();

    if (upcoming.length) {
      const h = document.createElement('h3');
      h.style.cssText = 'font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-secondary);margin-bottom:8px';
      h.textContent = 'Prochains événements';
      container.appendChild(h);
      upcoming.forEach(e => container.appendChild(_buildEventCard(e)));
    }

    if (past.length) {
      const h = document.createElement('h3');
      h.style.cssText = 'font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin:16px 0 8px';
      h.textContent = 'Événements passés récents';
      container.appendChild(h);
      past.forEach(e => {
        const card = _buildEventCard(e);
        card.style.opacity = '0.5';
        container.appendChild(card);
      });
    }
  }

  function _buildEventCard(event) {
    const card = document.createElement('div');
    card.className = 'calendar-event fade-in';

    const startDate = event.start ? new Date(event.start) : null;
    const endDate   = event.end ? new Date(event.end) : null;

    const dateStr = startDate
      ? startDate.toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })
      : '—';
    const timeStr = startDate?.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }) || '';
    const endStr  = endDate?.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }) || '';

    card.innerHTML = `
      <div class="cal-event-date">
        <div>${dateStr}</div>
        <div style="margin-top:2px">${timeStr}${endStr ? '→'+endStr : ''}</div>
      </div>
      <div>
        <div class="cal-event-title">${_esc(event.title)}</div>
        ${event.location ? `<div class="cal-event-desc">📍 ${_esc(event.location)}</div>` : ''}
        ${event.description ? `<div class="cal-event-desc">${_esc(event.description.substring(0, 100))}</div>` : ''}
      </div>
    `;
    return card;
  }

  function _esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { init, parseICS, importFromUrl, renderEvents };
})();
