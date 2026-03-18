/**
 * FlowMind — Storage Module
 * Abstraction localStorage avec schéma structuré
 */

const Storage = (() => {
  const KEY = 'flowmind_data';

  const DEFAULT_STATE = {
    version: 1,
    projects: [],
    tasks: [],
    completedHistory: [],
    calendarEvents: [],
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    feedbacks: [],
    config: {
      accentColor: '#00d4ff',
      successColor: '#10b981',
      theme: 'light',
      pomodoroMin: 25,
      breakShortMin: 5,
      sound: 'bell',
      oneTaskFocus: true,
      microstepMaxMin: 15,
      notifications: true,
      xpPerTask: 10,
      xpPerSubtask: 5,
      animations: true
    }
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      let state;
      if (!raw) {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      } else {
        const data = JSON.parse(raw);
        state = deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), data);
      }
      // Injecter les données de démo si l'app est vide
      if (typeof Demo !== 'undefined' && Demo.shouldSeed(state)) {
        state = Demo.seed(state);
        save(state);
      }
      // Injecter les données TNE si le projet n'existe pas encore
      if (typeof DemoTNE !== 'undefined' && DemoTNE.shouldSeed(state)) {
        state = DemoTNE.seed(state);
        save(state);
      }
      return state;
    } catch (e) {
      console.error('[Storage] Load error:', e);
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('[Storage] Save error:', e);
      return false;
    }
  }

  function reset() {
    localStorage.removeItem(KEY);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  return { load, save, reset, generateId, DEFAULT_STATE };
})();
