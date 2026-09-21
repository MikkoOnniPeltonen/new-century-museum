const INTRO_KEY = 'cm:intro-seen'

export function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    // Storage can be unavailable (private mode); the intro simply plays again.
  }
}

export function resetIntro(): void {
  try {
    sessionStorage.removeItem(INTRO_KEY)
  } catch {
    // ignore
  }
}
