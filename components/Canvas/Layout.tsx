'use client'

import { SidebarAtom, selectedToolAtom } from '@/state'
import { useCanvas } from 'hooks/useFabric'
import { useAtom, useSetAtom } from 'jotai'
import {
  SIDEBAR_WIDTH,
  TOGGLE_SIDEBAR_WIDTH,
  NAVBAR_HEIGHT
} from 'lib/constants'
import { useEffect } from 'react'

function BoardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useAtom(SidebarAtom)
  const [canvas] = useCanvas()
  const setSelectedTool = useSetAtom(selectedToolAtom)

  useEffect(() => {
    console.log(canvas)
  }, [canvas])

  return (
    <div className='flex'>
      <aside
        className={`relative transition-all duration-300 overflow-y-scroll no-scrollbar`}
        style={{
          width: !open ? 0 : SIDEBAR_WIDTH - TOGGLE_SIDEBAR_WIDTH,
          minWidth: !open ? 0 : SIDEBAR_WIDTH - TOGGLE_SIDEBAR_WIDTH,
          maxWidth: !open ? 0 : SIDEBAR_WIDTH - TOGGLE_SIDEBAR_WIDTH,
          maxHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`
        }}
      >
        {['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'].map((gate) => (
          <button
            key={gate}
            onClick={() => {
              setSelectedTool(gate)
            }}
            className='flex justify-center items-center w-full h-16 border-b border-slate-500'
          >
            <span draggable onDragStart={() => setSelectedTool(gate)}>
              {gate}
            </span>
          </button>
        ))}
      </aside>
      <div className='h-[calc(100vh - 64px)] w-2 bg-slate-500 relative'>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`absolute top-1/2 z-50  -right-0 h-10 w-2 bg-red-500 hover:bg-slate-400 transition-all duration-300`}
        ></button>
      </div>
      {children}
    </div>
  )
}

export default BoardLayout
