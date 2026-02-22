/* ============================
   AlgoClassroom — main.js
   Shared utilities + search + theme toggle
   ============================ */

// ── THEME TOGGLE ──
(function initTheme() {
  const saved = localStorage.getItem('algo-theme') || 'dark';
  applyTheme(saved, false);
})();

function applyTheme(theme, animate) {
  const html = document.documentElement;
  if (animate) {
    html.style.setProperty('--transition-speed', '0.35s');
  }
  html.setAttribute('data-theme', theme);
  localStorage.setItem('algo-theme', theme);

  // Update toggle button state if present
  const icon = document.querySelector('.toggle-icon');
  const label = document.querySelector('.toggle-label');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';

  // Ripple animation from button
  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.classList.add('toggling');
    setTimeout(() => btn.classList.remove('toggling'), 400);
  }

  applyTheme(next, true);
}

// Inject the toggle button once DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const navInner = document.querySelector('.nav-inner');
  if (navInner && !document.querySelector('.theme-toggle')) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.setAttribute('title', 'Toggle light/dark mode');
    btn.innerHTML = `
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
      <span class="toggle-icon">${currentTheme === 'dark' ? '☀️' : '🌙'}</span>
      <span class="toggle-label">${currentTheme === 'dark' ? 'Light' : 'Dark'}</span>
    `;
    btn.addEventListener('click', toggleTheme);

    // Insert before nav-badge or at end
    const badge = navInner.querySelector('.nav-badge');
    if (badge) {
      navInner.insertBefore(btn, badge);
    } else {
      navInner.appendChild(btn);
    }
  }

  // Keyboard shortcut: Ctrl/Cmd + Shift + L
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      toggleTheme();
    }
  });
});

// ── LIVE SEARCH ──
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.algo-card');

    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const match = !q || title.includes(q) || desc.includes(q) || tags.includes(q);
      card.classList.toggle('hidden', !match);
    });

    // Hide section headers if all cards hidden
    document.querySelectorAll('.category-section').forEach(sec => {
      const visible = sec.querySelectorAll('.algo-card:not(.hidden)').length;
      sec.style.display = visible === 0 && q ? 'none' : '';
    });
  });
}

// ── SHARED ALGO PAGE UTILITIES ──
window.AlgoUtils = {

  // Delay helper
  delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  },

  // TTS
  speak(text, onEnd) {
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9; utt.pitch = 1.05; utt.volume = 1;
    const voices = synth.getVoices();
    const v = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('female'))
           || voices.find(v => v.lang === 'en-US')
           || voices.find(v => v.lang.startsWith('en'));
    if (v) utt.voice = v;
    utt.onstart = () => document.getElementById('speakBars')?.classList.add('on');
    utt.onend = utt.onerror = () => {
      document.getElementById('speakBars')?.classList.remove('on');
      if (onEnd) onEnd();
    };
    synth.speak(utt);
  },

  stopSpeech() {
    window.speechSynthesis.cancel();
    document.getElementById('speakBars')?.classList.remove('on');
  },

  // Update status bar fields
  setStatus(fields) {
    Object.entries(fields).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });
  },

  // Update progress bar
  setProgress(current, total) {
    const fill = document.getElementById('progFill');
    const ctr  = document.getElementById('stepCtr');
    if (fill) fill.style.width = `${((current + 1) / total) * 100}%`;
    if (ctr)  ctr.textContent = `Step ${current + 1} / ${total}`;
  },

  // Set phase badge
  setPhase(phase) {
    const el = document.getElementById('phaseBadge');
    if (!el) return;
    const map = {
      idle:    { cls: 'ph-idle',    label: 'Idle' },
      compare: { cls: 'ph-compare', label: 'Compare' },
      swap:    { cls: 'ph-swap',    label: 'Swap' },
      active:  { cls: 'ph-active',  label: 'Active' },
      done:    { cls: 'ph-done',    label: 'Complete ✓' },
    };
    const p = map[phase] || map.idle;
    el.className = `phase-badge ${p.cls}`;
    el.textContent = p.label;
  },

  // Parse int array from input
  parseArray(str) {
    return str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  },

  // Random int array
  randomArray(len = 12, min = 5, max = 99) {
    return Array.from({ length: len }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  },

  // Highlight lines in code block
  highlightLine(lineNum) {
    const lines = document.querySelectorAll('.code-line');
    lines.forEach((l, i) => l.classList.toggle('hl', i + 1 === lineNum));
  },

  // Hex to RGB string
  hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  },
};

// ── SPEED CONTROL (shared) ──
const SPEED_MS = [2200, 1600, 1100, 750, 400];
let currentSpeedIdx = 1; // default 2×

window.getSpeedMs = () => SPEED_MS[currentSpeedIdx];

const speedSlider = document.getElementById('speedSlider');
const speedVal = document.getElementById('speedVal');
if (speedSlider) {
  speedSlider.addEventListener('input', function () {
    currentSpeedIdx = parseInt(this.value) - 1;
    if (speedVal) speedVal.textContent = `${this.value}×`;
  });
}

// ── SMOOTH SCROLL FOR NAV ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── VOICES LOAD ──
window.speechSynthesis.onvoiceschanged = () => {};