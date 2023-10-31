'use client'

import { SelectModalAtom } from '@/state'
import { useCanvas } from 'hooks/useFabric'
import { useAtom } from 'jotai'
import { useRef } from 'react'

function SelectModal() {
  const [show, setShow] = useAtom(SelectModalAtom)
  const ref = useRef(null)
  const [canvas] = useCanvas()
  if (!canvas) return null

  return (
    <div
      className='absolute z-50 bg-white border border-gray-300 rounded-md shadow-md p-3'
      style={{
        top: show.top,
        left: show.left,
        display: show.show ? 'block' : 'none'
      }}
      ref={ref}
      onClick={() => setShow((prev) => ({ ...prev, show: false }))}
    >
      <button onClick={() => canvas.remove(show.target!)}>delete g</button>
    </div>
  )
}

export default SelectModal
