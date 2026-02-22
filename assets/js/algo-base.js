/* ============================
   AlgoClassroom — algo-base.js
   Shared logic for all algo pages
   Extend this via AlgoPage class
   ============================ */

class AlgoPage {
  constructor(config) {
    this.title = config.title || 'Algorithm';
    this.icon = config.icon || '🧮';
    this.steps = [];
    this.stepIdx = -1;
    this.isPlaying = false;
    this.playTimer = null;
    this.onRenderStep = config.onRenderStep || (() => {});
    this.onReset = config.onReset || (() => {});

    this._bindButtons();
  }

  _bindButtons() {
    const btnPlay = document.getElementById('btnPlay');
    const btnNext = document.getElementById('btnNext');
    const btnReset = document.getElementById('btnReset');

    if (btnPlay) btnPlay.addEventListener('click', () => this.togglePlay());
    if (btnNext) btnNext.addEventListener('click', () => this.nextStep());
    if (btnReset) btnReset.addEventListener('click', () => this.reset());
  }

  setSteps(steps) {
    this.steps = steps;
    const ctr = document.getElementById('stepCtr');
    if (ctr) ctr.textContent = `Step 0 / ${steps.length}`;
  }

  togglePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  play() {
    if (this.stepIdx >= this.steps.length - 1) this.stepIdx = -1;
    this.isPlaying = true;
    const btn = document.getElementById('btnPlay');
    if (btn) btn.innerHTML = '<span>⏸</span> Pause';
    this._advance();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.playTimer);
    AlgoUtils.stopSpeech();
    const btn = document.getElementById('btnPlay');
    if (btn) btn.innerHTML = '<span>▶</span> Play';
  }

  _advance() {
    if (!this.isPlaying) return;
    if (this.stepIdx >= this.steps.length - 1) { this.pause(); return; }
    this.stepIdx++;
    this._render(this.stepIdx);
    const text = this.steps[this.stepIdx]?.narration || '';
    AlgoUtils.speak(text, () => {
      if (this.isPlaying) this.playTimer = setTimeout(() => this._advance(), 300);
    });
  }

  nextStep() {
    if (this.isPlaying) this.pause();
    if (this.stepIdx >= this.steps.length - 1) return;
    this.stepIdx++;
    this._render(this.stepIdx);
    AlgoUtils.speak(this.steps[this.stepIdx]?.narration || '', null);
  }

  reset() {
    this.pause();
    this.stepIdx = -1;
    AlgoUtils.setStatus({ sCurrent: '—', sVisited: '0', sLevel: '0' });
    AlgoUtils.setPhase('idle');
    const fill = document.getElementById('progFill');
    if (fill) fill.style.width = '0%';
    const narText = document.getElementById('narText');
    if (narText) narText.textContent = 'Press ▶ Play to begin.';
    const btn = document.getElementById('btnPlay');
    if (btn) btn.innerHTML = '<span>▶</span> Play';
    this.onReset();
  }

  _render(idx) {
    if (idx < 0 || idx >= this.steps.length) return;
    const step = this.steps[idx];
    const narText = document.getElementById('narText');
    if (narText) narText.textContent = step.narration || '';
    AlgoUtils.setProgress(idx, this.steps.length);
    if (step.phase) AlgoUtils.setPhase(step.phase);
    this.onRenderStep(step, idx);
  }
}

window.AlgoPage = AlgoPage;
