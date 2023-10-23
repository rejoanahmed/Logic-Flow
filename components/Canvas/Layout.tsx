'use client'

import { useCanvas } from 'hooks/useFabric'
import { atom, useAtom } from 'jotai'
import { fabric } from 'fabric'
import { useEffect } from 'react'

export const SIDEBAR_WIDTH = 250
export const TOGGLE_SIDEBAR_WIDTH = 8

export const SidebarAtom = atom(true)

function BoardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useAtom(SidebarAtom)
  const [canvas] = useCanvas()
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
          maxHeight: 'calc(100vh - 64px)',
          minHeight: 'calc(100vh - 64px)',
          height: 'calc(100vh - 64px)'
        }}
      >
        {['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'].map((gate) => (
          <button
            key={gate}
            onClick={() => {
              canvas!.add(
                new fabric.Text(gate, {
                  left: 100,
                  top: 100,
                  hasControls: false,
                  hasBorders: false,
                  backgroundColor: 'white'
                })
              )
            }}
            className='flex justify-center items-center w-full h-16 border-b border-slate-500'
          >
            {gate}
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
