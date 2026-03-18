/**
 * FlowMind — Config Module
 * Gestion de la configuration et du thème
 */

const Config = (() => {
  let _state = null;

  function init(state) {
    _state = state;
    applyTheme(state.config.theme);
    applyAccentColor(state.config.accentColor);
    applySuccessColor(state.config.successColor);
  }

  function get(key) {
    return _state ? _state.config[key] : null;
  }

  function set(key, value) {
    if (!_state) return;
    _state.config[key] = value;

    // Effets immédiats
    if (key === 'theme') applyTheme(value);
    if (key === 'accentColor') applyAccentColor(value);
    if (key === 'successColor') applySuccessColor(value);
  }

  function setAll(configObj) {
    if (!_state) return;
    Object.assign(_state.config, configObj);
    applyTheme(configObj.theme);
    applyAccentColor(configObj.accentColor);
    applySuccessColor(configObj.successColor);
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  function applyAccentColor(color) {
    if (!color) return;
    document.documentElement.style.setProperty('--accent', color);
    // Derive dim and glow versions
    document.documentElement.style.setProperty('--accent-dim', hexToRgba(color, 0.15));
    document.documentElement.style.setProperty('--accent-glow', hexToRgba(color, 0.4));
    document.documentElement.style.setProperty('--border-focus', hexToRgba(color, 0.4));
  }

  function applySuccessColor(color) {
    if (!color) return;
    document.documentElement.style.setProperty('--success', color);
    document.documentElement.style.setProperty('--success-dim', hexToRgba(color, 0.15));
    document.documentElement.style.setProperty('--success-glow', hexToRgba(color, 0.35));
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function loadSettingsUI() {
    if (!_state) return;
    const c = _state.config;
    const fields = {
      'cfg-accent-color': c.accentColor,
      'cfg-success-color': c.successColor,
      'cfg-pomodoro': c.pomodoroMin,
      'cfg-break-short': c.breakShortMin,
      'cfg-sound': c.sound,
      'cfg-one-task': c.oneTaskFocus,
      'cfg-microstep-max': c.microstepMaxMin,
      'cfg-notif': c.notifications,
      'cfg-xp-task': c.xpPerTask,
      'cfg-xp-subtask': c.xpPerSubtask,
      'cfg-animations': c.animations
    };

    for (const [id, val] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.type === 'checkbox') el.checked = val;
      else el.value = val;
    }
  }

  function readSettingsUI() {
    const read = id => {
      const el = document.getElementById(id);
      if (!el) return null;
      if (el.type === 'checkbox') return el.checked;
      if (el.type === 'number') return parseInt(el.value);
      return el.value;
    };

    return {
      accentColor: read('cfg-accent-color'),
      successColor: read('cfg-success-color'),
      theme: 'light',
      pomodoroMin: read('cfg-pomodoro'),
      breakShortMin: read('cfg-break-short'),
      sound: read('cfg-sound'),
      oneTaskFocus: read('cfg-one-task'),
      microstepMaxMin: read('cfg-microstep-max'),
      notifications: read('cfg-notif'),
      xpPerTask: read('cfg-xp-task'),
      xpPerSubtask: read('cfg-xp-subtask'),
      animations: read('cfg-animations')
    };
  }

  return { init, get, set, setAll, loadSettingsUI, readSettingsUI };
})();
