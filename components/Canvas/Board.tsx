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
import { ANDGate } from 'lib/LogicBoardClass'

const LogicBoard = () => {
  const size = useWindowSize()
  const sidebarOpen = useAtomValue(SidebarAtom)
  const setSelectModal = useSetAtom(SelectModalAtom)
  const setActiveObject = useSetAtom(ActiveObjectAtom)
  const gate = useAtomValue(selectedToolAtom)
  const [canvas, setCanvasElRef] = useCanvas((canvas) => {
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

    const numberOfInputs = 2
    const labelText = new fabric.Text('AND', {
      fill: 'white',
      originX: 'center',
      originY: 'center',
      fontSize: 20
    })
    console.log(Math.max(numberOfInputs * 20 + 20, labelText.height! + 20))
    const labelBox = new fabric.Rect({
      width: labelText.width! + 20,
      height: Math.max(numberOfInputs * 10 + 20, labelText.height! + 20),
      originX: 'center',
      originY: 'center',
      fill: 'black'
    })

    const masterControl = new fabric.Group([labelBox, labelText], {
      left: 100,
      top: 100,
      hasControls: false
    })

    console.log(masterControl.width)

    const inputCircle1 = new fabric.Circle({
      radius: 5,
      fill: 'red',
      left: 5,
      top: 20,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'pointer'
    })

    const inputCircle2 = new fabric.Circle({
      radius: 5,
      fill: 'green',
      left: 5,
      top: 40,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'pointer'
    })

    const outputCircle = new fabric.Circle({
      radius: 5,
      fill: 'blue',
      left: 130,
      top: 25,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      hoverCursor: 'pointer'
    })

    // Add the group to the canvas
    canvas.add(masterControl)
    canvas.add(inputCircle1)
    canvas.add(inputCircle2)
    canvas.add(outputCircle)

    outputCircle.on('moving', function () {
      console.log('moving')
    })

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
        left: masterControl.left! + 120,
        top: masterControl.top! + 25,
        selectable: true
      })

      inputCircle1.setCoords()
      inputCircle2.setCoords()
      outputCircle.setCoords()
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
    if (canvas) {
      canvas.on('drop', (event) => {
        const canvasPosition = canvas.getPointer(event.e)

        const left = canvasPosition.x
        const top = canvasPosition.y

        const AND = new ANDGate(2, left, top)
        AND.draw(canvas)
      })
    }

    return () => {
      canvas?.off('drop')
    }
  }, [canvas, gate])

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
