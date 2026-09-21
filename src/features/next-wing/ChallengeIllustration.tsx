import type { ReactNode } from 'react'
import { SharedTomorrow } from './SharedTomorrow'
import { STORIES } from './stories'

function Scene({ label, children }: { label: string; children: ReactNode }) {
  return <svg className="future-exhibit__art" viewBox="0 0 720 300" role="img" aria-label={label}>
    <rect width="720" height="300" fill="#17343d" />
    <circle cx="536" cy="93" r="88" fill="#edce91" opacity=".06" />
    <circle cx="536" cy="93" r="62" fill="#edce91" opacity=".1" />
    <path d="M45 65h75m-52 8h40M594 47h67M44 244Q225 184 392 234T720 225V300H0Z" fill="#244c49" stroke="#759995" strokeOpacity=".25" />
    {children}
    <g fill="#e8d39c"><circle cx="52" cy="273" r="2" /><circle cx="68" cy="264" r="2" /><circle cx="665" cy="271" r="2" /></g>
  </svg>
}

function Person({ x, y, shirt, skin = '#dcb58b', flip = false, seated = false }: { x: number; y: number; shirt: string; skin?: string; flip?: boolean; seated?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} strokeLinecap="round" strokeLinejoin="round">
    <circle cy="-46" r="12" fill={skin} />
    <path d="M-12-49q0-19 17-12l8 15-13-6Z" fill="#102a32" />
    <path d="M0-22v38" stroke={shirt} strokeWidth="27" />
    <path d={seated ? 'M0 20h-24l-12 30h-10' : 'M-7 27l-5 37m20-37 9 37'} fill="none" stroke="#102a32" strokeWidth="10" />
    <path d="M5-21l21 17 18-7" fill="none" stroke={skin} strokeWidth="8" />
  </g>
}

function TrustIllustration() {
  return <Scene label="Neighbours piecing together reliable information at a warmly lit community reading desk">
    <rect x="261" y="40" width="207" height="138" rx="4" fill="#365b5c" stroke="#759995" />
    <g fill="#ddcfaa"><path d="M279 58h64v47h-64zM372 114h73v44h-73z" /><path d="M363 57h83v36h-83zM285 126h56v34h-56z" fill="#9ccaca" /></g>
    <g fill="none" stroke="#49716d" strokeWidth="3"><path d="M290 71h41m-41 9h31m-31 9h36M383 128h47m-47 9h35m-35 9h42M375 70h58m-58 10h34" /></g>
    <path d="m321 107 48 26m-18-58-22 52" stroke="#edce91" strokeWidth="2" />
    <path d="M105 98v80m0-65 32-26" stroke="#aad0ae" strokeWidth="3" /><g fill="#80b197"><ellipse cx="93" cy="104" rx="15" ry="28" transform="rotate(-28 93 104)" /><ellipse cx="126" cy="85" rx="15" ry="26" transform="rotate(35 126 85)" /></g>
    <path d="m86 168 7 37h27l7-37" fill="#aa795a" />
    <Person x={210} y={203} shirt="#e3ba77" />
    <Person x={506} y={202} shirt="#9ccaca" skin="#ad7656" flip />
    <path d="M260 209h207m-190 5-9 65m178-65 9 65" stroke="#aa795a" strokeWidth="10" />
    <path d="M301 199v-33q24-8 45 5 21-13 45-5v33q-25-8-45 3-21-11-45-3" fill="#eddfbb" />
    <path d="M346 171v29m-35-23 25 3m-25 6 25 3m20-9 25-3m-25 12 25-3" stroke="#759995" strokeWidth="2" />
    <path d="M431 202v-68l-23-23" fill="none" stroke="#c5c9a3" strokeWidth="4" /><path d="m390 124 28-27 14 21Z" fill="#e3ba77" />
    <path d="m405 125-40 66h80l-29-69" fill="#edce91" opacity=".1" />
    <g fill="none" stroke="#9ccaca" strokeWidth="2"><path d="M556 113h70v41h-43l-16 12v-12h-11Z" /><path d="m577 132 9 9 19-20" /></g>
  </Scene>
}

function BelongingIllustration() {
  return <Scene label="An open neighbourhood tea table with welcoming neighbours, warm lanterns and a spare chair">
    <path d="M93 39q260 89 542 0" fill="none" stroke="#759995" strokeWidth="2" />
    {[145, 251, 360, 470, 579].map((x, i) => <g key={x}><path d={`M${x} ${i === 0 || i === 4 ? 55 : 72}v22`} stroke="#759995" /><circle cx={x} cy={i === 0 || i === 4 ? 86 : 102} r="19" fill="#edce91" opacity=".08" /><rect x={x - 8} y={i === 0 || i === 4 ? 77 : 93} width="16" height="19" rx="5" fill="#edce91" /></g>)}
    <path d="M60 198V121h49v77m496 0v-83h46v83" fill="#294b50" stroke="#759995" />
    <Person x={207} y={199} shirt="#9ccaca" skin="#ad7656" />
    <Person x={510} y={199} shirt="#e3ba77" flip />
    <Person x={343} y={166} shirt="#c48d76" skin="#bd8969" />
    <ellipse cx="359" cy="214" rx="132" ry="27" fill="#aa795a" /><path d="m268 227-9 53m190-53 9 53" stroke="#aa795a" strokeWidth="10" />
    <ellipse cx="359" cy="207" rx="133" ry="25" fill="#d5bb8d" />
    <path d="M345 195v-19h28v19q-14 12-28 0m28-14q19-3 8 12" fill="#658e83" stroke="#658e83" strokeWidth="3" /><path d="m345 181-15-7 7 17" fill="#658e83" />
    <g fill="#f0dfb9"><path d="M283 204v-12h16v12q-8 7-16 0M420 205v-12h16v12q-8 7-16 0" /><ellipse cx="387" cy="212" rx="17" ry="5" /></g>
    <g stroke="#9ccaca" strokeWidth="6" fill="#365b5c"><path d="M334 252v-24h49v24Zm0 2v32m49-32v32m-51-33h54" /></g>
    <path d="M597 254v-60m0 30-22-18m22 5 19-22" stroke="#aad0ae" strokeWidth="3" /><g fill="#80b197"><ellipse cx="578" cy="195" rx="15" ry="25" transform="rotate(-35 578 195)" /><ellipse cx="612" cy="177" rx="16" ry="28" transform="rotate(30 612 177)" /></g>
    <path d="m578 243 7 30h26l7-30" fill="#aa795a" />
  </Scene>
}

function TechnologyIllustration() {
  return <Scene label="An inclusive design workshop where people test a digital service together, with accessible ways to take part">
    <rect x="289" y="45" width="163" height="124" rx="8" fill="#294b50" stroke="#759995" />
    <rect x="304" y="61" width="133" height="88" rx="4" fill="#9ccaca" /><rect x="315" y="72" width="39" height="66" rx="3" fill="#49716d" />
    <path d="M365 79h58m-58 13h43m-43 13h51" stroke="#49716d" strokeWidth="4" /><rect x="365" y="117" width="44" height="13" rx="6" fill="#edce91" />
    <path d="M360 171v24m-21 1h45" stroke="#759995" strokeWidth="6" />
    <Person x={213} y={198} shirt="#e3ba77" />
    <Person x={540} y={204} shirt="#9ccaca" skin="#ad7656" flip seated />
    <path d="M272 212h207m-189 0-8 65m180-65 8 65" stroke="#aa795a" strokeWidth="9" />
    <path d="m308 212-9-39h53l9 39Zm-8 0h68" fill="#365b5c" stroke="#a2bcb0" strokeWidth="3" />
    <path d="m320 191 8 7 14-15" fill="none" stroke="#edce91" strokeWidth="3" />
    <rect x="405" y="184" width="19" height="28" rx="3" fill="#9ccaca" /><path d="M411 191h7m-7 6h7" stroke="#49716d" strokeWidth="2" />
    <g stroke="#9ccaca" strokeWidth="5" fill="none"><circle cx="547" cy="249" r="26" /><path d="M523 208v32h34l18 28h17" /><path d="M547 224v50m-25-25h50" strokeWidth="2" /></g>
    <path d="M99 139h53v40H99Zm27 40v20m-19 0h38" fill="#294b50" stroke="#759995" strokeWidth="2" />
    <path d="M105 150q8-11 17 0t17 0" fill="none" stroke="#edce91" strokeWidth="3" />
    <g fill="#edce91"><rect x="570" y="84" width="29" height="29" transform="rotate(-8 570 84)" /><rect x="612" y="102" width="27" height="27" transform="rotate(6 612 102)" /></g>
    <path d="m577 97 5 4 8-10m29 25h12m-6-6v12" fill="none" stroke="#49716d" strokeWidth="2" />
  </Scene>
}

export function ChallengeIllustration({ challenge }: { challenge: string }) {
  const id = STORIES.find((story) => story.title === challenge)?.id
  if (id === 'trust') return <TrustIllustration />
  if (id === 'belonging') return <BelongingIllustration />
  if (id === 'technology') return <TechnologyIllustration />
  return <SharedTomorrow />
}
