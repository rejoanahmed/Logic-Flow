'use client'
import { fabric } from 'fabric'
import { useCanvas } from 'hooks/useFabric'
import { useState, useLayoutEffect, useEffect } from 'react'
import useWindowSize from 'hooks/useWindowSize'

const LogicBoard = () => {
  const size = useWindowSize()
  const [canvasRef, setCanvasElRef] = useCanvas((canvas) => {
    canvas.setDimensions({
      width: 700,
      height: 300
    })
    const text = new fabric.Text('wth mansandbox how ', {
      originX: 'center',
      top: 20
    })
    canvas.add(text)
    text.centerH()
    function animate(toState: number) {
      text.animate('scaleX', Math.max(toState, 0.1) * 2, {
        onChange: () => canvas.renderAll(),
        onComplete: () => animate(toState ? 0 : 1),
        duration: 1000,
        easing: toState
          ? fabric.util.ease.easeInOutQuad
          : fabric.util.ease.easeInOutSine
      })
    }
    animate(1)
  })

  useEffect(() => {
    if (canvasRef.current && size.width && size.height) {
      canvasRef.current.setDimensions({
        width: size.width - 20,
        height: size.height - 20
      })
    }
  }, [canvasRef, size])

  return (
    <div className='border-4 border-black'>
      <canvas className='border-2 border-orange-400' ref={setCanvasElRef} />
    </div>
  )
}

export default LogicBoard
