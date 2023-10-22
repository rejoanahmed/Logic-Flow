'use client'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState
} from 'react'

const FabricContext = createContext<{
  canvas: fabric.Canvas | null
  setCanvas: Dispatch<SetStateAction<fabric.Canvas | null>>
} | null>(null)

const FabricProvider = ({ children }: { children: React.ReactNode }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  return (
    <FabricContext.Provider value={{ canvas, setCanvas }}>
      {children}
    </FabricContext.Provider>
  )
}

export default FabricProvider

export const useFabricContext = () => {
  const context = useContext(FabricContext)
  if (!context) {
    throw new Error('useFabricContext must be used within a FabricProvider')
  }
  return context
}
