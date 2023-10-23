import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { ActiveObjectAtom } from 'state/LogicBoard'

function ActiveObjectInfoModal() {
  const activeObject = useAtomValue(ActiveObjectAtom)
  const [show, setShow] = useState(true)
  useEffect(() => {
    setShow(true)
  }, [activeObject])
  return (
    <div
      className='bg-white border border-gray-300 rounded-md shadow-md p-3 z-30 absolute bottom-5 right-5 overflow-hidden w-40 h-24'
      style={{
        display: activeObject && show ? 'block' : 'none'
      }}
    >
      <div className='relative'>
        <button
          className='absolute top-0 right-0 bg-slate-400'
          onClick={() => setShow((p) => !p)}
        >
          x
        </button>
      </div>
    </div>
  )
}

export default ActiveObjectInfoModal
