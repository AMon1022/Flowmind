/**
 * FlowMind — Gamification Module
 * XP, niveaux, récompenses dopaminergiques, streaks
 */

const Gamification = (() => {
  const LEVEL_THRESHOLDS = [0,100,250,450,700,1000,1400,1900,2500,3200,4000];
  const TASK_EMOJIS   = ['⚡','🎯','✅','🚀','💡','🔥','🌟','💎','🏆','⚡'];
  const STREAK_MSGS   = ['En route !','Continue !','Sur la lancée !','Incroyable !','Inarrêtable !'];

  let _state = null;
  let _onUpdate = null;

  const REWARD_MESSAGES = [
    'Tâche accomplie !',
    'Excellent travail !',
    'Bravo, continue !',
    'Dans le flux !',
    'Tu envoies du lourd !',
    'Mission accomplie !'
  ];

  function init(state, onUpdate) {
    _state = state;
    _onUpdate = onUpdate;
    _checkStreak();
    renderSidebar();
  }

  function _checkStreak() {
    if (!_state) return;
    const today = _todayStr();
    if (!_state.lastActiveDate) { _state.lastActiveDate = today; return; }

    const last = new Date(_state.lastActiveDate);
    const diff = Math.floor((new Date(today) - last) / 86400000);
    if (diff === 1) {
      // Consécutif
    } else if (diff > 1) {
      _state.streak = 0;
    }
  }

  function _todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function awardTask(isSubtask = false) {
    if (!_state) return;
    const xpGain = isSubtask
      ? (Config.get('xpPerSubtask') || 5)
      : (Config.get('xpPerTask') || 10);

    _state.xp += xpGain;
    _state.lastActiveDate = _todayStr();

    // Streak
    if (!_state.streak) _state.streak = 1;
    else _state.streak++;

    // Level up check
    const newLevel = _computeLevel(_state.xp);
    const leveledUp = newLevel > _state.level;
    _state.level = newLevel;

    if (_onUpdate) _onUpdate();
    renderSidebar();

    // Affichage récompense
    if (Config.get('animations') !== false) {
      const emoji = TASK_EMOJIS[Math.floor(Math.random() * TASK_EMOJIS.length)];
      const msg = leveledUp
        ? `🎉 Niveau ${newLevel} atteint !`
        : REWARD_MESSAGES[Math.floor(Math.random() * REWARD_MESSAGES.length)];
      showReward(emoji, msg, `+${xpGain} XP`);
    }

    return xpGain;
  }

  function _computeLevel(xp) {
    let level = 1;
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    }
    return level;
  }

  function _xpForNextLevel(level) {
    return LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  }

  function _xpForCurrentLevel(level) {
    return LEVEL_THRESHOLDS[level - 1] || 0;
  }

  function renderSidebar() {
    if (!_state) return;
    const xp = _state.xp;
    const level = _state.level;
    const streak = _state.streak;

    const levelEl = document.getElementById('sidebar-level');
    const xpEl = document.getElementById('sidebar-xp');
    const fillEl = document.getElementById('sidebar-xp-fill');
    const streakEl = document.getElementById('sidebar-streak');

    if (levelEl) levelEl.textContent = level;
    if (xpEl) xpEl.textContent = xp;
    if (streakEl) streakEl.textContent = streak;

    if (fillEl) {
      const low = _xpForCurrentLevel(level);
      const high = _xpForNextLevel(level);
      const pct = Math.min(100, ((xp - low) / (high - low)) * 100);
      fillEl.style.width = `${pct}%`;
    }
  }

  function showReward(emoji, text, xpText) {
    const overlay = document.getElementById('reward-overlay');
    const emojiEl = document.getElementById('reward-emoji');
    const textEl = document.getElementById('reward-text');
    const xpEl = document.getElementById('reward-xp');
    const particles = document.getElementById('reward-particles');

    if (!overlay) return;

    emojiEl.textContent = emoji;
    textEl.textContent = text;
    xpEl.textContent = xpText;

    // Particles
    particles.innerHTML = '';
    const colors = ['#00d4ff', '#10b981', '#f59e0b', '#a78bfa', '#f472b6'];
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const angle = (i / 16) * 360;
      const dist = 60 + Math.random() * 60;
      const rad = (angle * Math.PI) / 180;
      p.style.cssText = `
        left: 50%; top: 50%;
        background: ${colors[i % colors.length]};
        --tx: ${Math.cos(rad) * dist}px;
        --ty: ${Math.sin(rad) * dist}px;
        animation-delay: ${Math.random() * 0.2}s;
      `;
      particles.appendChild(p);
    }

    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('hidden'), 1800);
  }

  return { init, awardTask, renderSidebar, showReward };
})();
