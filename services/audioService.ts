// Simple synth for Sci-Fi UI sounds using Web Audio API
// No external assets required.

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;

const initAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.1; // Keep it subtle
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  if (masterGain) {
    masterGain.gain.value = isMuted ? 0 : 0.1;
  }
  return isMuted;
};

// 1. High-pitched chirp for hover
export const playHoverSound = () => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(masterGain);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

// 2. Mechanical latch for clicks
export const playClickSound = () => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(masterGain);

  osc.type = 'square';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};

// 3. Data packet sound for incoming messages
export const playMessageSound = () => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(masterGain);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
};

// 4. Low ambience hum
let humOsc: OscillatorNode | null = null;

export const startAmbience = () => {
  if (isMuted || humOsc) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  humOsc = audioCtx.createOscillator();
  const humGain = audioCtx.createGain();

  humOsc.connect(humGain);
  humGain.connect(masterGain);

  humOsc.type = 'sine';
  humOsc.frequency.value = 60; // 60Hz mains hum
  humGain.gain.value = 0.02; // Very quiet

  humOsc.start();
};
