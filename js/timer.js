/**
 * FlowMind — Timer Module
 * Minuterie visuelle type Time Timer avec anneau SVG
 */

const Timer = (() => {
  let _interval = null;
  let _totalSeconds = 25 * 60;
  let _remaining = 25 * 60;
  let _running = false;
  let _onEnd = null;
  let _onTick = null;

  const CIRCUMFERENCE = 2 * Math.PI * 76; // r=76

  function init(onEnd, onTick) {
    _onEnd = onEnd;
    _onTick = onTick;
    _bindUI();
  }

  function _bindUI() {
    const startBtn  = document.getElementById('focus-start-btn');
    const resetBtn  = document.getElementById('focus-reset-btn');
    const durationPills = document.querySelectorAll('.duration-pill:not(.duration-pill-custom)');
    const customBtn = document.getElementById('duration-custom-btn');
    const customRow = document.getElementById('duration-custom-row');
    const customInput = document.getElementById('duration-custom-input');
    const customConfirm = document.getElementById('duration-custom-confirm');

    if (startBtn) startBtn.addEventListener('click', toggle);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    durationPills.forEach(btn => {
      btn.addEventListener('click', () => {
        durationPills.forEach(b => b.classList.remove('active'));
        if (customBtn) customBtn.classList.remove('active');
        if (customRow) customRow.classList.add('hidden');
        btn.classList.add('active');
        setDuration(parseInt(btn.dataset.min));
      });
    });

    if (customBtn) {
      customBtn.addEventListener('click', () => {
        durationPills.forEach(b => b.classList.remove('active'));
        customBtn.classList.add('active');
        if (customRow) customRow.classList.remove('hidden');
        if (customInput) customInput.focus();
      });
    }

    const _applyCustom = () => {
      const min = parseInt(customInput?.value);
      if (min >= 1 && min <= 180) setDuration(min);
    };
    if (customConfirm) customConfirm.addEventListener('click', _applyCustom);
    if (customInput) customInput.addEventListener('keydown', e => { if (e.key === 'Enter') _applyCustom(); });
  }

  function setDuration(minutes) {
    const secs = minutes * 60;
    _totalSeconds = secs;
    _remaining = secs;
    _running = false;
    clearInterval(_interval);
    _updateUI();
    const startBtn = document.getElementById('focus-start-btn');
    if (startBtn) startBtn.textContent = '▶ Démarrer';
  }

  function toggle() {
    if (_running) pause();
    else start();
  }

  function start() {
    if (_remaining <= 0) reset();
    _running = true;
    const startBtn = document.getElementById('focus-start-btn');
    if (startBtn) startBtn.textContent = '⏸ Pause';

    clearInterval(_interval);
    _interval = setInterval(() => {
      _remaining--;
      _updateUI();
      if (_onTick) _onTick(_remaining, _totalSeconds);
      if (_remaining <= 0) {
        clearInterval(_interval);
        _running = false;
        _playSound();
        if (_onEnd) _onEnd();
      }
    }, 1000);
  }

  function pause() {
    _running = false;
    clearInterval(_interval);
    const startBtn = document.getElementById('focus-start-btn');
    if (startBtn) startBtn.textContent = '▶ Reprendre';
  }

  function reset() {
    clearInterval(_interval);
    _running = false;
    _remaining = _totalSeconds;
    _updateUI();
    const startBtn = document.getElementById('focus-start-btn');
    if (startBtn) startBtn.textContent = '▶ Démarrer';
  }

  function stop() {
    clearInterval(_interval);
    _running = false;
    _remaining = _totalSeconds;
    _updateUI();
    const startBtn = document.getElementById('focus-start-btn');
    if (startBtn) startBtn.textContent = '▶ Démarrer';
  }

  function _updateUI() {
    const ringEl  = document.getElementById('ring-progress');
    const timeEl  = document.getElementById('ring-time');

    const min = Math.floor(_remaining / 60);
    const sec = _remaining % 60;
    const timeStr = `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;

    if (timeEl) timeEl.textContent = timeStr;

    if (ringEl) {
      const progress = _remaining / _totalSeconds;
      const offset = CIRCUMFERENCE * (1 - progress);
      ringEl.style.strokeDashoffset = offset;

      // Couleur urgence (rouge les 2 dernières minutes)
      if (_remaining <= 120 && _remaining > 0) {
        ringEl.style.stroke = '#ef4444';
        ringEl.style.filter = 'drop-shadow(0 0 8px rgba(239,68,68,0.6))';
      } else if (_remaining <= _totalSeconds * 0.25) {
        ringEl.style.stroke = '#f59e0b';
        ringEl.style.filter = 'drop-shadow(0 0 8px rgba(245,158,11,0.5))';
      } else {
        ringEl.style.stroke = 'var(--accent)';
        ringEl.style.filter = 'drop-shadow(0 0 8px var(--accent-glow))';
      }
    }
  }

  function _playSound() {
    const sound = Config.get('sound');
    if (sound === 'none') return;

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = sound === 'bell'
        ? [{ f: 880, d: 0.4, t: 0 }, { f: 660, d: 0.3, t: 0.5 }]
        : [{ f: 523, d: 0.2, t: 0 }, { f: 659, d: 0.2, t: 0.25 }, { f: 784, d: 0.4, t: 0.5 }];

      notes.forEach(({ f, d, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = f;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + d);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + d);
      });
    } catch (e) { /* Web Audio non dispo */ }
  }

  function getRemaining() { return _remaining; }
  function isRunning() { return _running; }

  return { init, setDuration, start, pause, reset, stop, toggle, getRemaining, isRunning };
})();
