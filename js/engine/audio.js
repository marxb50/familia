class AudioManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicMuted = false;
    this.currentNarration = null;
    this.musicInterval = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch(e) {
      console.warn('AudioContext not supported', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playJump() {
    if (this.muted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  playHeartCollect(colorName) {
    if (this.muted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    
    const freqs = {
      'green': [523.25, 659.25],
      'yellow': [587.33, 739.99],
      'blue': [659.25, 830.61],
      'red': [698.46, 880.00],
      'pink': [783.99, 987.77],
      'rainbow': [523.25, 659.25, 783.99, 1046.50]
    }[colorName] || [523.25, 783.99];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.35);
    });
  }

  playSwitch() {
    if (this.muted || !this.ctx) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playVictoryFanfare() {
    if (this.muted || !this.ctx) return;
    this.resume();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = this.ctx.currentTime;

    notes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.1);

      gain.gain.setValueAtTime(0.22, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + (idx === notes.length - 1 ? 0.8 : 0.25));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + (idx === notes.length - 1 ? 0.8 : 0.25));
    });
  }

  playNarration(phaseIndex, onEndCallback) {
    this.stopNarration();
    const audioUrl = 'assets/audio/cutscene_' + phaseIndex + '.mp3';
    this.currentNarration = new Audio(audioUrl);
    this.currentNarration.volume = this.muted ? 0 : 1;

    if (onEndCallback) {
      this.currentNarration.addEventListener('ended', onEndCallback);
    }

    this.currentNarration.play().catch(e => {
      console.log('Audio autoplay prevented or file loading:', e);
      if (onEndCallback) onEndCallback();
    });

    return this.currentNarration;
  }

  stopNarration() {
    if (this.currentNarration) {
      this.currentNarration.pause();
      this.currentNarration.currentTime = 0;
      this.currentNarration = null;
    }
  }

  startFairytaleBGM() {
    if (this.musicInterval) return;
    const harpNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 659.25, 392.00];
    let noteIdx = 0;

    this.musicInterval = setInterval(() => {
      if (this.muted || this.musicMuted || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(harpNotes[noteIdx], now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.95);

      noteIdx = (noteIdx + 1) % harpNotes.length;
    }, 450);
  }

  stopFairytaleBGM() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.currentNarration) {
      this.currentNarration.volume = this.muted ? 0 : 1;
    }
    return this.muted;
  }
}

window.AudioManager = AudioManager;
window.SoundManager = AudioManager;



