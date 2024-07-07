'use client'

import Hud from './Hud'

export default function Bg() {
  return <div className={`
    isolate fixed z-0 inset-0`}>
    <Hud />
  </div>
}
