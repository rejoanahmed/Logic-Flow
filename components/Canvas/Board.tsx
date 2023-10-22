'use client'
import { fabric } from 'fabric'
import { useCanvas } from 'hooks/useFabric'
import { useEffect } from 'react'
import useWindowSize from 'hooks/useWindowSize'
import BoardLayout, { SIDEBAR_WIDTH, SidebarAtom } from './Layout'
import { useAtomValue } from 'jotai'

const LogicBoard = () => {
  const size = useWindowSize()
  const sidebarOpen = useAtomValue(SidebarAtom)
  const [canvasRef, setCanvasElRef] = useCanvas((canvas) => {
    // Panning
    let isPanning = false
    let lastX: number, lastY: number

    canvas.on('mouse:down', (event) => {
      if (event.e.button === 1) {
        isPanning = true
        lastX = event.e.clientX
        lastY = event.e.clientY
      }
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
        canvas.zoomToPoint(zoomPoint, canvas.getZoom() * zoomFactor)
      } else {
        // Zoom in
        canvas.zoomToPoint(zoomPoint, canvas.getZoom() / zoomFactor)
      }
      event.e.preventDefault() // Prevent the page from scrolling
    })
  })

  useEffect(() => {
    if (canvasRef && size.width && size.height) {
      const canvas = canvasRef
      canvas.setDimensions({
        width: size.width - (sidebarOpen ? SIDEBAR_WIDTH : 0) - 10,
        height: size.height - 64
      })
    }
  }, [canvasRef, size, sidebarOpen])

  return (
    <BoardLayout>
      <div className='flex justify-center items-center'>
        <canvas className='' ref={setCanvasElRef} />
      </div>
    </BoardLayout>
  )
}

export default LogicBoard
