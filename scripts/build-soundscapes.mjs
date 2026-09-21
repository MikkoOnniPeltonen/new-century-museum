// Builds the century soundscapes in public/audio from openly licensed recordings
// on Wikimedia Commons: download -> decode (afconvert) -> 80 s excerpt with fades
// and loudness matching (in Node) -> 96 kbps AAC (afconvert). macOS only.
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const USER_AGENT = 'CenturyMuseum/2.0 (https://github.com/MikkoOnniPeltonen/new-century-museum; educational)'
const EXCERPT_SECONDS = 80
const FADE_SECONDS = 2.5
const TARGET_RMS = 0.1 // about -20 dBFS
const PEAK_LIMIT = 0.9

const SOURCES = {
  '1600s': 'Charpentier, Te Deum (Prelude).ogg',
  '1700s': 'Kimiko Ishizaka - J.S. Bach- -Open- Goldberg Variations, BWV 988 (Piano) - 01 Aria.mp3',
  '1800s': 'Chopin - Nocturne No. 2 in E-flat major, Op. 9 No. 2 (Frank Levy).flac',
  '1900s': 'Clair de lune (Claude Debussy) Suite bergamasque.ogg',
}

async function commonsInfo(file) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: `File:${file}`,
    prop: 'videoinfo',
    viprop: 'url|mime|extmetadata|derivatives',
    viextmetadatafilter: 'LicenseShortName|Artist',
  })
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': USER_AGENT } })
  const page = Object.values((await response.json()).query.pages)[0]
  const info = page.videoinfo?.[0]
  if (!info) throw new Error(`Not found on Commons: ${file}`)
  // afconvert cannot read Ogg, so use the MP3 that Commons transcodes for those files.
  const mp3 = info.derivatives?.find((d) => d.src.endsWith('.mp3'))?.src
  const download = info.mime === 'audio/mpeg' || info.mime.includes('flac') ? info.url : mp3
  if (!download) throw new Error(`No decodable download for ${file}`)
  const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return {
    download,
    page: info.descriptionurl,
    license: info.extmetadata?.LicenseShortName?.value,
    artist: strip(info.extmetadata?.Artist?.value),
  }
}

/** Cuts a 16-bit PCM WAV to `seconds`, matches loudness and adds fade-in/out. */
function excerptWav(buffer, seconds) {
  let offset = 12
  let format
  let dataStart
  let dataSize
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString('ascii', offset, offset + 4)
    const size = buffer.readUInt32LE(offset + 4)
    if (id === 'fmt ') {
      format = {
        channels: buffer.readUInt16LE(offset + 10),
        sampleRate: buffer.readUInt32LE(offset + 12),
        bits: buffer.readUInt16LE(offset + 22),
      }
    } else if (id === 'data') {
      dataStart = offset + 8
      dataSize = size
      break
    }
    offset += 8 + size + (size % 2)
  }
  if (!format || format.bits !== 16 || dataStart === undefined) throw new Error('Expected 16-bit PCM WAV')

  const frameBytes = format.channels * 2
  const frames = Math.min(Math.floor(dataSize / frameBytes), Math.floor(seconds * format.sampleRate))
  const pcm = Buffer.from(buffer.subarray(dataStart, dataStart + frames * frameBytes))
  const samples = frames * format.channels

  let sumSquares = 0
  let peak = 0
  for (let i = 0; i < samples; i++) {
    const value = pcm.readInt16LE(i * 2) / 32768
    sumSquares += value * value
    peak = Math.max(peak, Math.abs(value))
  }
  const rms = Math.sqrt(sumSquares / samples) || 1
  const gain = Math.min(TARGET_RMS / rms, PEAK_LIMIT / (peak || 1))

  const fadeFrames = Math.floor(FADE_SECONDS * format.sampleRate)
  for (let frame = 0; frame < frames; frame++) {
    const fade = Math.min(1, frame / fadeFrames, (frames - 1 - frame) / fadeFrames)
    for (let channel = 0; channel < format.channels; channel++) {
      const index = (frame * format.channels + channel) * 2
      const value = Math.round(pcm.readInt16LE(index) * gain * fade)
      pcm.writeInt16LE(Math.max(-32768, Math.min(32767, value)), index)
    }
  }

  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(format.channels, 22)
  header.writeUInt32LE(format.sampleRate, 24)
  header.writeUInt32LE(format.sampleRate * frameBytes, 28)
  header.writeUInt16LE(frameBytes, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcm.length, 40)
  return { wav: Buffer.concat([header, pcm]), gain }
}

const work = await mkdtemp(join(tmpdir(), 'soundscapes-'))
const outDir = join(root, 'public/audio')
await mkdir(outDir, { recursive: true })

try {
  for (const [century, file] of Object.entries(SOURCES)) {
    const info = await commonsInfo(file)
    const extension = info.download.split('?')[0].split('.').pop()
    const original = join(work, `${century}.${extension}`)
    const response = await fetch(info.download, { headers: { 'User-Agent': USER_AGENT } })
    if (!response.ok) throw new Error(`Download failed (${response.status}) for ${file}`)
    await writeFile(original, Buffer.from(await response.arrayBuffer()))

    const decoded = join(work, `${century}.wav`)
    execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16@44100', '-c', '2', original, decoded])
    const { wav, gain } = excerptWav(await readFile(decoded), EXCERPT_SECONDS)
    const excerpt = join(work, `${century}-excerpt.wav`)
    await writeFile(excerpt, wav)

    const output = join(outDir, `${century}.m4a`)
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '96000', excerpt, output])
    const kb = Math.round((await stat(output)).size / 1024)
    console.log(`${century}: ${file}\n  ${info.license} · ${info.artist}\n  ${info.page}\n  -> public/audio/${century}.m4a (${kb} KB, gain ${gain.toFixed(2)})`)
  }
} finally {
  await rm(work, { recursive: true, force: true })
}
