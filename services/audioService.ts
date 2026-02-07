
// Synthesizer for High-Fidelity Sci-Fi UI sounds
// Aesthetic: Glassy, Holographic, Precise

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;

const initAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.2; // Slightly louder master for clearer tones
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  if (masterGain) {
    masterGain.gain.value = isMuted ? 0 : 0.2;
  }
  return isMuted;
};

// 1. Hover: Subtle, high-frequency "glass" tick
export const playHoverSound = () => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(masterGain);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

// 2. Click: Soft, futuristic "confirmation" chirp
export const playClickSound = () => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.type = 'triangle';
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3000, audioCtx.currentTime);

  // Pitch envelope
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);

  // Amplitude envelope
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
};

// 3. Message: Pleasant 2-note chime (Major 3rd interval)
export const playMessageSound = () => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const now = audioCtx.currentTime;

  // Note 1
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.connect(gain1);
  gain1.connect(masterGain);
  
  osc1.type = 'sine';
  osc1.frequency.value = 880; // A5
  gain1.gain.setValueAtTime(0.1, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc1.start(now);
  osc1.stop(now + 0.3);

  // Note 2 (Delayed)
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.connect(gain2);
  gain2.connect(masterGain);

  osc2.type = 'sine';
  osc2.frequency.value = 1108.73; // C#6 (Major 3rd up)
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.setValueAtTime(0.1, now + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc2.start(now);
  osc2.stop(now + 0.4);
};

// 4. Ambience: Very subtle, warm data hum (Pink noise filtered)
let humNode: AudioBufferSourceNode | null = null;
let humGain: GainNode | null = null;

export const startAmbience = () => {
  if (isMuted || humNode) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  // Create Pink Noise buffer
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0, b1, b2, b3, b4, b5, b6;
  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11; // (roughly) compensate for gain
    b6 = white * 0.115926;
  }

  humNode = audioCtx.createBufferSource();
  humNode.buffer = buffer;
  humNode.loop = true;

  // Filter it down to a low rumble
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 80;
  
  humGain = audioCtx.createGain();
  humGain.gain.value = 0.05; // Very quiet

  humNode.connect(filter);
  filter.connect(humGain);
  humGain.connect(masterGain);

  humNode.start();
};
