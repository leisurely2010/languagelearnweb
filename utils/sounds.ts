let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioCtx
}

export function playCorrectSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.15, now)
    masterGain.connect(ctx.destination)

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15)
    osc.connect(masterGain)
    osc.start(now)
    osc.stop(now + 0.15)

    const noise = ctx.createBufferSource()
    const bufferSize = ctx.sampleRate * 0.08
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3)
    }
    noise.buffer = buffer
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.3, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)
  } catch {
    // Audio not available
  }
}

export function playIncorrectSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.12, now)
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    masterGain.connect(ctx.destination)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(200, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3)
    osc.connect(masterGain)
    osc.start(now)
    osc.stop(now + 0.3)
  } catch {
    // Audio not available
  }
}

export function playCompleteSound() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.12, now)
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8)
    masterGain.connect(ctx.destination)

    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + i * 0.15)
      const noteGain = ctx.createGain()
      noteGain.gain.setValueAtTime(0, now + i * 0.15)
      noteGain.gain.linearRampToValueAtTime(0.12, now + i * 0.15 + 0.02)
      noteGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.4)
      osc.connect(noteGain)
      noteGain.connect(ctx.destination)
      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.4)
    })
  } catch {
    // Audio not available
  }
}
