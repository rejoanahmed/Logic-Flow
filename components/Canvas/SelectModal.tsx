'use client'

import { useOnClickOutside } from 'hooks/useClickOutside'
import { useCanvas } from 'hooks/useFabric'
import { atom, useAtom } from 'jotai'
import { useEffect, useRef } from 'react'

export const SelectModalAtom = atom({
  show: false,
  top: 0,
  left: 0,
  target: undefined as fabric.Object | undefined
})

function SelectModal() {
  const [show, setShow] = useAtom(SelectModalAtom)
  const ref = useRef(null)
  const [canvas] = useCanvas()

  if (!canvas) return null
  console.log(show)
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
      <button onClick={() => canvas.remove(show.target!)}>delete</button>
    </div>
  )
}

export default SelectModal
