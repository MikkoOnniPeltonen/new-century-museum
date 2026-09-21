// Original, deterministic ambient composition. No samples or external recordings.
// macOS: node scripts/build-next-wing-music.mjs
import { execFileSync } from 'node:child_process'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rate = 44100
const beat = 60 / 84
const duration = 32 * 4 * beat
const frames = Math.ceil(duration * rate)
const channels = [new Float32Array(frames), new Float32Array(frames)]
const frequency = (note) => 440 * 2 ** ((note - 69) / 12)

function note(midi, start, length, level, pan, pad = false) {
  const hz = frequency(midi)
  const count = Math.floor(length * rate)
  for (let i = 0; i < count; i++) {
    const t = i / rate
    const envelope = pad
      ? Math.min(1, t / 1.2) * Math.min(1, (length - t) / 1.6)
      : (1 - Math.exp(-t * 65)) * Math.exp(-t * 2.4) * Math.min(1, (length - t) / .15)
    const phase = 2 * Math.PI * hz * t
    const value = (Math.sin(phase) + .22 * Math.sin(phase * 2) + .06 * Math.sin(phase * 3)) * envelope * level
    // Wrap note tails around the loop, including delayed echoes.
    const index = (Math.floor(start * rate) + i) % frames
    channels[0][index] += value * Math.sqrt((1 - pan) / 2)
    channels[1][index] += value * Math.sqrt((1 + pan) / 2)
    if (!pad) {
      const echo = (index + Math.floor(beat * .75 * rate)) % frames
      channels[0][echo] += value * .22 * Math.sqrt((1 + pan) / 2)
      channels[1][echo] += value * .22 * Math.sqrt((1 - pan) / 2)
    }
  }
}

// Cmaj9 / Gadd9 / Am7 / Fmaj9: warm pads, rounded bass, a light repeating motif.
const chords = [[48, 55, 59, 62, 64], [43, 55, 57, 62, 67], [45, 55, 60, 64, 67], [41, 53, 57, 60, 67]]
for (let bar = 0; bar < 32; bar++) {
  const chord = chords[Math.floor(bar / 2) % chords.length]
  const start = bar * 4 * beat
  if (bar % 2 === 0) chord.slice(1).forEach((pitch, i) => note(pitch, start, beat * 9, .036, (i - 1.5) / 3, true))
  note(chord[0], start, beat * 3.5, .11, 0)
  for (let step = 0; step < 8; step++) {
    if ((step + bar) % 5 === 0) continue
    const pitch = chord[1 + [0, 2, 1, 3, 2, 1, 3, 0][step]] + 12
    note(pitch, start + step * beat / 2, beat * 2.8, .038, Math.sin(step + bar) * .55)
  }
}
let peak = 0
let sum = 0
for (const channel of channels) for (const value of channel) { peak = Math.max(peak, Math.abs(value)); sum += value * value }
const gain = Math.min(.85 / peak, .1 / Math.sqrt(sum / (frames * 2)))
const wav = Buffer.alloc(44 + frames * 4)
wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8)
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22)
wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34)
wav.write('data', 36); wav.writeUInt32LE(frames * 4, 40)
for (let i = 0; i < frames; i++) for (let c = 0; c < 2; c++) wav.writeInt16LE(Math.round(channels[c][i] * gain * 32767), 44 + i * 4 + c * 2)
const temporary = await mkdtemp(join(tmpdir(), 'next-wing-music-'))
try {
  const source = join(temporary, 'tomorrow.wav')
  await writeFile(source, wav)
  const output = fileURLToPath(new URL('../public/audio/next-wing.m4a', import.meta.url))
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '128000', source, output])
  console.log(`Created Tomorrow, Together: ${duration.toFixed(1)}s, 84 BPM, stereo. Peak ${(peak * gain).toFixed(3)}.`)
} finally {
  await rm(temporary, { recursive: true, force: true })
}
