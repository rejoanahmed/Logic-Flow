import { fabric } from 'fabric'
import { atom, useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import LogicBoard, {
  ComponentSchema,
  InputSchema,
  WireSchema
} from 'lib/LogicBoardClass'
const DEV_MODE = false

const canvasAtom = atom<fabric.Canvas | null>(null)

export function useCanvas(
  init?: (canvas: fabric.Canvas, LogicBoard: LogicBoard) => void,
  saveState = false,
  boardData?: (ComponentSchema | InputSchema | WireSchema)[],
  deps: any[] = []
) {
  const elementRef = useRef<HTMLCanvasElement>(null)
  const [fc, setFc] = useAtom(canvasAtom)
  const data = useRef<any>(null)
  const LogicBoardRef = useRef<LogicBoard | null>(null)

  const setRef = useCallback(
    (ref: HTMLCanvasElement | null) => {
      //@ts-ignore
      elementRef.current = ref

      // save state
      if (DEV_MODE && saveState && fc) {
        data.current = fc.toJSON()
      }
      // dispose canvas
      fc?.dispose()
      // set/clear ref
      if (!ref) {
        console.log('clearing ref')
        setFc(null)
        return
      }
      const canvas = new fabric.Canvas(ref, {
        backgroundColor: 'rgb(238,231,220)',
        fireRightClick: true, // enable firing of right click events
        fireMiddleClick: true,
        preserveObjectStacking: true
      })
      const board = new LogicBoard(canvas, boardData)
      LogicBoardRef.current = board
      console.log('setting ref')
      setFc(canvas)
      // invoke callback
      init && init(canvas, board)
      // restore state
      if (DEV_MODE && saveState && data.current) {
        canvas.loadFromJSON(data.current, () => {})
      }
    },
    [saveState, ...deps]
  )
  useEffect(() => {
    // disposer
    return () => {
      // save state
      console.log('disposing')
      if (DEV_MODE && saveState && fc) {
        data.current = fc.toJSON()
      }
      // we avoid unwanted disposing by doing so only if element ref is unavailable
      if (!elementRef.current) {
        fc?.dispose()
        console.log('disposing ref')
        setFc(null)
      }
    }
  }, [saveState])
  return [fc, setRef, LogicBoardRef.current] as const
}
