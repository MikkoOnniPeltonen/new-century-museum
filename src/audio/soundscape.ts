import { onAudioRunning, peekAudioContext } from './context'

const FADE_SECONDS = 1.6
/** Music sits underneath the interface sounds. */
const MUSIC_LEVEL = 0.55

interface Channel {
  element: HTMLAudioElement
  gain: GainNode
  pauseTimer?: number
}

function rampTo(param: AudioParam, value: number, now: number) {
  param.cancelScheduledValues(now)
  param.setValueAtTime(param.value, now)
  param.linearRampToValueAtTime(value, now + FADE_SECONDS)
}

/**
 * One looping track per century, each routed through its own gain node so
 * changing century crossfades instead of cutting. Nothing plays until the
 * AudioContext has been unlocked by a user gesture.
 */
class Soundscape {
  private channels = new Map<string, Channel>()
  private master: GainNode | null = null
  private wanted: string | null = null
  private playing: string | null = null
  private volume = 0.6
  private hidden = false

  constructor() {
    onAudioRunning(() => this.sync())
  }

  setTrack(src: string | null) {
    this.wanted = src
    this.sync()
  }

  setVolume(volume: number) {
    this.volume = volume
    const ctx = peekAudioContext()
    if (ctx && this.master) this.master.gain.setTargetAtTime(volume * MUSIC_LEVEL, ctx.currentTime, 0.1)
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden
    this.sync()
  }

  private sync() {
    const ctx = peekAudioContext()
    if (!ctx || ctx.state !== 'running') return
    const target = this.hidden ? null : this.wanted
    if (target === this.playing) return
    if (this.playing) this.fadeOut(ctx, this.playing)
    this.playing = target
    if (target) this.fadeIn(ctx, target)
  }

  private masterGain(ctx: AudioContext) {
    if (!this.master) {
      this.master = ctx.createGain()
      this.master.gain.value = this.volume * MUSIC_LEVEL
      this.master.connect(ctx.destination)
    }
    return this.master
  }

  private channel(ctx: AudioContext, src: string): Channel {
    const existing = this.channels.get(src)
    if (existing) return existing
    const element = new Audio(src)
    element.loop = true
    element.preload = 'auto'
    const gain = ctx.createGain()
    gain.gain.value = 0
    ctx.createMediaElementSource(element).connect(gain).connect(this.masterGain(ctx))
    const channel: Channel = { element, gain }
    this.channels.set(src, channel)
    return channel
  }

  private fadeIn(ctx: AudioContext, src: string) {
    const channel = this.channel(ctx, src)
    window.clearTimeout(channel.pauseTimer)
    // A missing or blocked file simply stays silent.
    channel.element.play().catch(() => {})
    rampTo(channel.gain.gain, 1, ctx.currentTime)
  }

  private fadeOut(ctx: AudioContext, src: string) {
    const channel = this.channels.get(src)
    if (!channel) return
    rampTo(channel.gain.gain, 0, ctx.currentTime)
    channel.pauseTimer = window.setTimeout(() => channel.element.pause(), FADE_SECONDS * 1000 + 100)
  }
}

export const soundscape = new Soundscape()
