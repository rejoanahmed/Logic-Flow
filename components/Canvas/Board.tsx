'use client'
import { fabric } from 'fabric'
import { useCanvas } from 'hooks/useFabric'
import { useEffect } from 'react'
import useWindowSize from 'hooks/useWindowSize'
import BoardLayout, {
  SIDEBAR_WIDTH,
  SidebarAtom,
  TOGGLE_SIDEBAR_WIDTH
} from './Layout'
import { useAtomValue, useSetAtom } from 'jotai'
import SelectModal, { SelectModalAtom } from './SelectModal'
import ActiveObjectInfoModal from './SelectedObjectInfoModal'
import { ActiveObjectAtom } from 'state/LogicBoard'

const LogicBoard = () => {
  const size = useWindowSize()
  const sidebarOpen = useAtomValue(SidebarAtom)
  const setSelectModal = useSetAtom(SelectModalAtom)
  const setActiveObject = useSetAtom(ActiveObjectAtom)
  const [canvasRef, setCanvasElRef] = useCanvas((canvas) => {
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
      } else if (event.e.button === 2 && event.target?.data?.id) {
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
      console.log(event.target?.data?.id)
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

    // add 26 circles each with letter A - Z inside and make them not draggable and no controls or borders and all in a vertical line
    const masterControl = new fabric.Rect({
      width: 100,
      height: 50,
      fill: 'lightblue',
      left: 20,
      top: 10,
      hasControls: false
    })

    const inputCircle1 = new fabric.Circle({
      radius: 5,
      fill: 'red',
      left: 5,
      top: 20,
      selectable: false
    })

    const inputCircle2 = new fabric.Circle({
      radius: 5,
      fill: 'green',
      left: 5,
      top: 40,
      selectable: false
    })

    const outputCircle = new fabric.Circle({
      radius: 5,
      fill: 'blue',
      left: 130,
      top: 25,
      selectable: false
    })

    // Add the group to the canvas
    canvas.add(masterControl)
    canvas.add(inputCircle1)
    canvas.add(inputCircle2)
    canvas.add(outputCircle)

    // Drag event for the master control (body)
    masterControl.on('moving', function () {
      // Update the position of the circles
      inputCircle1.set({
        left: masterControl.left! - 20,
        top: masterControl.top! + 20
      })
      inputCircle2.set({
        left: masterControl.left! - 20,
        top: masterControl.top! + 40
      })
      outputCircle.set({
        left: masterControl.left! + 130,
        top: masterControl.top! + 25
      })
    })
  })

  useEffect(() => {
    if (canvasRef && size.width && size.height) {
      const canvas = canvasRef
      canvas.setDimensions({
        width:
          size.width - (sidebarOpen ? SIDEBAR_WIDTH : TOGGLE_SIDEBAR_WIDTH),
        height: size.height - 64
      })
    }
  }, [canvasRef, size, sidebarOpen])

  useEffect(() => {
    // listen to keydown events of delete key
    document.addEventListener('keydown', (event) => {
      console.log(event.code)
      if (canvasRef !== null && event.code === 'Backspace') {
        console.log('delete pressed')
        // delete selected object from canvas
        canvasRef.remove(canvasRef.getActiveObject()!)

        setActiveObject(undefined)
      }
    })

    return () => {
      document.removeEventListener('keydown', () => {})
    }
  }, [canvasRef])

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
