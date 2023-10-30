'use client'
import { fabric } from 'fabric'
import { useCanvas } from 'hooks/useFabric'
import { useEffect } from 'react'
import useWindowSize from 'hooks/useWindowSize'
import BoardLayout, {
  SIDEBAR_WIDTH,
  SidebarAtom,
  TOGGLE_SIDEBAR_WIDTH,
  selectedToolAtom
} from './Layout'
import { useAtomValue, useSetAtom } from 'jotai'
import SelectModal, { SelectModalAtom } from './SelectModal'
import ActiveObjectInfoModal from './SelectedObjectInfoModal'
import { ActiveObjectAtom } from 'state/LogicBoard'
import ShortUniqueId from 'short-unique-id'
import { BoardElementType, ObjectType, WIRE_WIDTH } from 'lib/LogicBoardClass'

const uid = new ShortUniqueId({ length: 8 })

const LogicBoard = () => {
  const size = useWindowSize()
  const sidebarOpen = useAtomValue(SidebarAtom)
  const setSelectModal = useSetAtom(SelectModalAtom)
  const setActiveObject = useSetAtom(ActiveObjectAtom)
  const gate = useAtomValue(selectedToolAtom)
  const [canvas, setCanvasElRef, LogicBoard] = useCanvas(
    (canvas, LogicBoard) => {
      // Panning
      document.addEventListener('contextmenu', (event) =>
        event.preventDefault()
      )
      let isPanning = false
      let lastX: number, lastY: number
      let wireStart: fabric.Object | undefined
      let wireEnd: fabric.Object | undefined
      const line = new fabric.Line([0, 0, 0, 0], {
        strokeWidth: WIRE_WIDTH,
        stroke: 'grey',
        originX: 'center',
        originY: 'center',
        hasControls: false,
        moveCursor: 'pointer',
        hoverCursor: 'pointer'
      })
      canvas.add(line)

      canvas.on('mouse:down', (event) => {
        console.log(event.e.button)
        const target = canvas.findTarget(event.e, false)
        if (target?.data?.type === ObjectType.Wire) {
          setActiveObject(target)
        }
        // middle mouse button
        if (event.e.button === 1) {
          isPanning = true
          lastX = event.e.clientX
          lastY = event.e.clientY

          setSelectModal((prev) => ({
            ...prev,
            show: false
          }))

          // right mouse button
        } else if (
          (event.e.button === 2 || event.e.button === 0) &&
          event.target
        ) {
          if (event.e.button === 2) {
            setSelectModal((prev) => ({
              ...prev,
              show: true,
              top: event.e.clientY,
              left: event.e.clientX,
              target: event.target
            }))
          } else {
            setActiveObject(event.target)
          }
          // reset wire start and end
          wireStart = undefined
          wireEnd = undefined
          // wire start
          if (
            event.target?.data?.type === ObjectType.ComponentOutput ||
            event.target?.data?.type === ObjectType.ComponentInput
          ) {
            wireStart = event.target
          }
        } else {
          setSelectModal((prev) => ({
            ...prev,
            show: false
          }))
          setActiveObject(event.target)
        }
      })

      canvas.on('mouse:move', (event) => {
        if (isPanning) {
          const deltaX = event.e.clientX - lastX
          const deltaY = event.e.clientY - lastY
          lastX = event.e.clientX
          lastY = event.e.clientY
          canvas.relativePan(new fabric.Point(deltaX, deltaY))
        }

        if (wireStart) {
          const pointer = canvas.getPointer(event.e)
          const x = pointer.x
          const y = pointer.y
          line.set({ x1: wireStart.left!, y1: wireStart.top!, x2: x, y2: y })
          line.setCoords()
          canvas.renderAll()
        }
      })

      canvas.on('mouse:up', (event) => {
        isPanning = false
        if (wireStart) {
          const obj = canvas.findTarget(event.e, false)
          if (
            (wireStart.data.type === ObjectType.ComponentOutput &&
              obj?.data?.type === ObjectType.ComponentInput) ||
            (wireStart.data.type === ObjectType.ComponentInput &&
              obj?.data?.type === ObjectType.ComponentOutput)
          ) {
            wireEnd = obj
            console.log(wireStart, wireEnd)
            console.log(LogicBoard)
            LogicBoard?.add({
              id: wireEnd.data.id + 'wire',
              type: BoardElementType.Wire,
              from: wireStart.data.id,
              to: wireEnd.data.id
            })
          }
        }
        wireStart = undefined
        wireEnd = undefined
        line.set({ x1: 0, y1: 0, x2: 0, y2: 0 })
        canvas.renderAll()
      })

      // Zooming with the mouse wheel
      canvas.on('mouse:wheel', (event) => {
        const delta = event.e.deltaY
        const zoomFactor = 1.05 // Adjust this value for your preferred zoom sensitivity
        const zoomPoint = new fabric.Point(
          canvas.getCenter().top,
          canvas.getCenter().left
        )
        if (delta > 0) {
          // Zoom out
          canvas.zoomToPoint(
            zoomPoint,
            Math.min(1.2, canvas.getZoom() * zoomFactor)
          )
        } else {
          // Zoom in
          canvas.zoomToPoint(
            zoomPoint,
            Math.max(0.2, canvas.getZoom() / zoomFactor)
          )
        }
        event.e.preventDefault() // Prevent the page from scrolling
      })
    }
  )

  // resizing the canvas
  useEffect(() => {
    if (canvas !== undefined && canvas !== null && size.width && size.height) {
      canvas.setDimensions({
        width:
          size.width - (sidebarOpen ? SIDEBAR_WIDTH : TOGGLE_SIDEBAR_WIDTH),
        height: size.height - 64
      })
    }
  }, [canvas, size, sidebarOpen])

  // drop event
  useEffect(() => {
    if (LogicBoard && canvas) {
      canvas.on('drop', (event) => {
        const canvasPosition = canvas.getPointer(event.e)

        const left = canvasPosition.x
        const top = canvasPosition.y

        LogicBoard?.add({
          x: left,
          type: BoardElementType.Component,
          y: top,
          id: uid.randomUUID(),
          inputs: [
            { id: uid.randomUUID(), label: 'A' },
            { id: uid.randomUUID(), label: 'B' },
            { id: uid.randomUUID(), label: 'C' },
            { id: uid.randomUUID(), label: 'D' },
            { id: uid.randomUUID(), label: 'E' },
            { id: uid.randomUUID(), label: 'F' },
            { id: uid.randomUUID(), label: 'G' },
            { id: uid.randomUUID(), label: 'H' }
          ],
          label: '8X1 MUX',
          outputs: [
            { id: uid.randomUUID(), label: 'X', booleanFunction: 'A&&B' },
            { id: uid.randomUUID(), label: 'Y', booleanFunction: 'A&&B' },
            { id: uid.randomUUID(), label: 'Z', booleanFunction: 'A&&B' }
          ]
        })

        // LogicBoard?.add({
        //   x: left,
        //   y: top,
        //   id: uid.randomUUID(),
        //   label: 'A',
        //   value: 'X',
        //   type: BoardElementType.Input
        // })
      })
    }

    return () => {
      canvas?.off('drop')
    }
  }, [canvas, gate, LogicBoard])

  useEffect(() => {
    // listen to keydown events of delete key
    document.addEventListener('keydown', (event) => {
      if (canvas !== null && event.code === 'Backspace') {
        //  editing textbox
        if (canvas.getActiveObject()?.type === 'textbox') return

        setActiveObject((prev) => {
          const id = prev?.data?.parent || prev?.data?.id
          id && LogicBoard?.remove(id)
          return undefined
        })
      }
    })

    return () => {
      document.removeEventListener('keydown', () => {})
    }
  }, [canvas])

  return (
    <BoardLayout>
      <div className='flex justify-center items-center relative'>
        <canvas className='' ref={setCanvasElRef} />
        <ActiveObjectInfoModal />
        <SelectModal />
      </div>
    </BoardLayout>
  )
}

export default LogicBoard
