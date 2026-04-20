export const playSound = (type: 'correct' | 'wrong', enabled: boolean) => {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'correct') {
      // Light click sound
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); 
      osc.stop(ctx.currentTime + 0.1);
    } else {
      // Error buzzer sound
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(); 
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};
