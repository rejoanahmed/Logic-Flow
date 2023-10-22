'use client'
import FabricProvider from '../context/canvas'
import LogicBoard from '../components/Canvas/Board'

function BoardPage() {
  return (
    <FabricProvider>
      <LogicBoard />
    </FabricProvider>
  )
}

export default BoardPage
