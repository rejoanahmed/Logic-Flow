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
const uid = new ShortUniqueId({ length: 8 })

const LogicBoard = () => {
  const size = useWindowSize()
  const sidebarOpen = useAtomValue(SidebarAtom)
  const setSelectModal = useSetAtom(SelectModalAtom)
  const setActiveObject = useSetAtom(ActiveObjectAtom)
  const gate = useAtomValue(selectedToolAtom)
  const [canvas, setCanvasElRef, LogicBoard] = useCanvas((canvas) => {
    // Panning
    document.addEventListener('contextmenu', (event) => event.preventDefault())
    let isPanning = false
    let lastX: number, lastY: number

    canvas.on('mouse:down', (event) => {
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
      } else if (event.e.button === 2 && event.target) {
        console.log('right click')
        setSelectModal((prev) => ({
          ...prev,
          show: true,
          top: event.e.clientY,
          left: event.e.clientX,
          target: event.target
        }))
      } else {
        setSelectModal((prev) => ({
          ...prev,
          show: false
        }))
        setActiveObject(event.target)
      }

      console.log(canvas.getActiveObject())
    })

    canvas.on('mouse:move', (event) => {
      if (isPanning) {
        const deltaX = event.e.clientX - lastX
        const deltaY = event.e.clientY - lastY
        lastX = event.e.clientX
        lastY = event.e.clientY
        canvas.relativePan(new fabric.Point(deltaX, deltaY))
        // updateGrid() // Update the grid when panning
      }

      let pointer = canvas.getPointer(event.e)
      pointer = new fabric.Point(pointer.x, pointer.y)
    })

    canvas.on('mouse:up', () => {
      isPanning = false
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
  })

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
          booleanFunction: 'A&&B',
          x: left,
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
            { id: uid.randomUUID(), label: 'X' },
            { id: uid.randomUUID(), label: 'Y' },
            { id: uid.randomUUID(), label: 'Z' }
          ]
        })
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
        if (canvas.getActiveObject() === null) return
        // delete selected object from canvas
        canvas.remove(canvas.getActiveObject()!)

        setActiveObject(undefined)
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
