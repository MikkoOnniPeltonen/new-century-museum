import { useNavigate } from 'react-router'
import { resetIntro } from '../../lib/session'

export function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="footer">
      <p>Century Museum · Twenty lives across four centuries</p>
      <div className="footer__links">
        <button
          type="button"
          className="footer__link"
          onClick={() => {
            resetIntro()
            navigate('/', { state: { replayIntro: Date.now() } })
          }}
        >
          Replay intro
        </button>
        <a
          className="footer__link"
          href="https://github.com/MikkoOnniPeltonen/new-century-museum/blob/main/CREDITS.md"
          target="_blank"
          rel="noreferrer"
        >
          Credits
        </a>
      </div>
    </footer>
  )
}
