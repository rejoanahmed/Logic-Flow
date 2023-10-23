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
import { useAtomValue } from 'jotai'

const LogicBoard = () => {
  const size = useWindowSize()
  const sidebarOpen = useAtomValue(SidebarAtom)
  const [canvasRef, setCanvasElRef] = useCanvas((canvas) => {
    // Panning
    document.addEventListener('contextmenu', (event) => event.preventDefault())
    let isPanning = false
    let lastX: number, lastY: number

    canvas.on('mouse:down', (event) => {
      console.log(event.e.button)
      event.e.preventDefault()
      if (event.e.button === 1) {
        isPanning = true
        lastX = event.e.clientX
        lastY = event.e.clientY
      } else if (event.e.button === 2 && event.target?.data?.id) {
        const x = event.e.clientX
        const y = event.e.clientY

        // Show the context menu with options
        const contextMenu = document.createElement('div')
        contextMenu.className = 'context-menu'
        contextMenu.style.left = x + 'px'
        contextMenu.style.top = y + 'px'

        // Add delete option
        const deleteOption = document.createElement('div')
        deleteOption.className = 'context-menu-option'
        deleteOption.textContent = 'Delete'
        deleteOption.addEventListener('click', function () {
          // Delete the selected object
          canvas.remove(event.target!)
          canvas.renderAll()
        })

        contextMenu.appendChild(deleteOption)

        document.body.appendChild(contextMenu)
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
    for (let i = 0; i < 10; i++) {
      const circle = new fabric.Circle({
        radius: 5,
        data: {
          id: i
        },
        // generate random fill color
        fill: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        stroke: 'rgba(3,9,5,0.5)',
        strokeWidth: 3,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        left: 20,
        lockMovementX: true,
        lockMovementY: true
      })
      const text = new fabric.Text(String.fromCharCode(65 + i), {
        fontSize: 30,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false
      })
      const group = new fabric.Group([circle, text], {
        top: 10 + i * 50,
        left: 20,
        hasControls: false,
        hasBorders: false,
        data: {
          id: String.fromCharCode(65 + i)
        },
        hoverCursor: 'pointer'
      })
      canvas.add(group)
    }
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
      }
    })

    return () => {
      document.removeEventListener('keydown', () => {})
    }
  }, [canvasRef])
  return (
    <BoardLayout>
      <div className='flex justify-center items-center'>
        <canvas className='' ref={setCanvasElRef} />
      </div>
    </BoardLayout>
  )
}

export default LogicBoard
