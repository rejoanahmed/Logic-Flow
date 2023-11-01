'use client'
import { fabric } from 'fabric'
import { useEffect, useRef } from 'react'
import useWindowSize from 'hooks/useWindowSize'
import BoardLayout from './Layout'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import SelectModal from './SelectModal'
import ActiveObjectInfoModal from './SelectedObjectInfoModal'
import { ActiveObjectAtom } from 'state/LogicBoard'
import { BoardElementType, ObjectType, WIRE_WIDTH } from 'lib/LogicBoardClass'
import {
  CanvasAtom,
  LogicBoardAtom,
  SelectModalAtom,
  SidebarAtom,
  WorkspaceAtom,
  selectedToolAtom
} from '@/state'
import {
  RANDOM_MOUSE_COLOR,
  SIDEBAR_WIDTH,
  TOGGLE_SIDEBAR_WIDTH
} from 'lib/constants'
import { useSpace } from '@ably/spaces/dist/mjs/react'
import { AND, NAND, NOR, NOT, OR, XNOR, XOR } from 'lib/gates'
import { updateWorkspace } from '@/services/firebase/firestore'
import LogicboardClass from 'lib/LogicBoardClass'

const LogicBoard = () => {
  const { space } = useSpace()
  const size = useWindowSize()
  const sidebarOpen = useAtomValue(SidebarAtom)
  const setSelectModal = useSetAtom(SelectModalAtom)
  const setActiveObject = useSetAtom(ActiveObjectAtom)
  const gate = useAtomValue(selectedToolAtom)
  const boardFromDB = useAtomValue(WorkspaceAtom)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [canvas, setCanvas] = useAtom(CanvasAtom)
  const [LogicBoard, setLogicBoard] = useAtom(LogicBoardAtom)

  // initialize the canvas
  useEffect(() => {
    if (!space) return
    if (!boardFromDB) return
    console.log(canvasRef.current)
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: 'rgb(238,231,220)',
        fireRightClick: true, // enable firing of right click events
        fireMiddleClick: true,
        preserveObjectStacking: true
      })
      const board = new LogicboardClass(canvas, space, boardFromDB.elements)
      setLogicBoard(board)
      setCanvas(canvas)
    }

    return () => {
      console.log('cleaning up')
      canvas && canvas?.dispose()
      setCanvas(null)
      setLogicBoard(null)
    }
  }, [canvasRef.current, space, boardFromDB])

  // initialize the canvas events and logic
  useEffect(() => {
    console.log(canvas, LogicBoard, space)
    if (!space || !LogicBoard || !canvas) return
    document.addEventListener('contextmenu', (event) => event.preventDefault())
    document.addEventListener('keydown', (event) => {
      if (canvas !== null && event.code === 'Backspace') {
        //  editing textbox
        if (canvas?.getActiveObject()?.type === 'textbox') return

        setActiveObject((prev) => {
          const id = prev?.data?.parent || prev?.data?.id
          id && LogicBoard?.remove(id)
          return undefined
        })
      }
    })
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
    canvas?.add(line)

    canvas?.on('mouse:down', (event) => {
      const target = canvas?.findTarget(event.e, false)
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
    canvas?.on('mouse:move', async (event) => {
      const pointer = canvas?.getPointer(event.e)
      const x = pointer.x
      const y = pointer.y

      // update cursor position
      const userConnectionId = await space?.members.getSelf()
      if (userConnectionId) {
        console.log('updating cursor position')
        space?.cursors.set({
          position: { x, y },
          data: {
            color: RANDOM_MOUSE_COLOR,
            connectionId: userConnectionId.connectionId
          }
        })
      }

      if (isPanning) {
        const deltaX = event.e.clientX - lastX
        const deltaY = event.e.clientY - lastY
        lastX = event.e.clientX
        lastY = event.e.clientY
        canvas?.relativePan(new fabric.Point(deltaX, deltaY))
      }

      if (wireStart) {
        line.set({
          x1: wireStart.left!,
          y1: wireStart.top!,
          x2: x,
          y2: y
        })
        line.setCoords()
        canvas?.renderAll()
      }
    })

    canvas?.on('mouse:up', (event) => {
      isPanning = false
      if (wireStart) {
        const obj = canvas?.findTarget(event.e, false)
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
      canvas?.renderAll()
    })

    // Zooming with the mouse wheel
    canvas?.on('mouse:wheel', (event) => {
      const delta = event.e.deltaY
      const zoomFactor = 1.05 // Adjust this value for your preferred zoom sensitivity
      const zoomPoint = new fabric.Point(
        canvas?.getCenter().top,
        canvas?.getCenter().left
      )
      if (delta > 0) {
        // Zoom out
        canvas?.zoomToPoint(
          zoomPoint,
          Math.min(1.2, canvas?.getZoom() * zoomFactor)
        )
      } else {
        // Zoom in
        canvas?.zoomToPoint(
          zoomPoint,
          Math.max(0.2, canvas?.getZoom() / zoomFactor)
        )
      }
      event.e.preventDefault() // Prevent the page from scrolling
    })

    space.cursors.subscribe('update', async (cursorUpdate) => {
      const members = await space.members.getOthers()
      const member = members.find(
        (member) => member.connectionId === cursorUpdate.data!.connectionId
      )
      if (!member) return
      if (LogicBoard.objectsMap.get(member.connectionId + 'cursor')) {
        const cursor = LogicBoard.objectsMap.get(member.connectionId + 'cursor')
        cursor?.set({
          left: cursorUpdate.position.x,
          top: cursorUpdate.position.y
        })
        canvas?.renderAll()
      } else {
        const cursor = new fabric.Circle({
          radius: 5,
          fill: cursorUpdate.data!.color as string,
          left: cursorUpdate.position.x,
          top: cursorUpdate.position.y,
          hasControls: false,
          hasBorders: false,
          selectable: false,
          hoverCursor: 'pointer',
          data: {
            type: ObjectType.Cursor,
            id: member.connectionId + 'cursor'
          }
        })

        LogicBoard?.objectsMap.set(member.connectionId + 'cursor', cursor)

        canvas?.add(cursor)
        canvas?.renderAll()
      }
    })

    space.channel.subscribe('add', async (update) => {
      console.log('add event')
      const owner = await space.members.getSelf()
      console.log(update, owner)
      if (owner && owner.connectionId === update.connectionId) return
      const data = update.data
      console.log('adding from remote')
      LogicBoard.add(data, false)
    })

    space.channel.subscribe('remove', async (update) => {
      console.log('remove event')
      const owner = await space.members.getSelf()
      if (owner && owner.connectionId === update.connectionId) return
      const data = update.data
      console.log('removing from remote')
      LogicBoard.remove(data, false)
    })

    space.channel.subscribe('move', async (update) => {
      console.log('move event')
      const owner = await space.members.getSelf()
      if (owner && owner.connectionId === update.connectionId) return
      const data = update.data
      console.log('moving from remote')
      LogicBoard.move({ id: data.id, x: data.x, y: data.y })
    })

    const f = async () => {
      space.subscribe('update', async (update) => {
        console.log('update event')
        if (!LogicBoard) return
        const lastUpdate = update.members.sort(
          (a, b) => b.lastEvent.timestamp - a.lastEvent.timestamp
        )[0]
        const self =
          (await space.members.getSelf())?.connectionId ===
          lastUpdate.connectionId

        console.log(lastUpdate, self)
        if (lastUpdate.lastEvent.name === 'present' && !self) {
          console.log('saving workspace')
          updateWorkspace(space.name, LogicBoard.board)
        }

        if (lastUpdate.lastEvent.name === 'leave' && !self) {
          console.log('saving workspace')
          updateWorkspace(space.name, LogicBoard.board)
        }
      })
    }
    f()

    return () => {
      space.unsubscribe()
      document.removeEventListener('contextmenu', () => {})
      document.removeEventListener('keydown', () => {})
      space.cursors.unsubscribe()
      canvas?.off('mouse:down')
      canvas?.off('mouse:move')
      canvas?.off('mouse:up')
      canvas?.off('mouse:wheel')
      space.channel.unsubscribe()
    }
  }, [space, LogicBoard, canvas])

  // resizing the canvas
  useEffect(() => {
    if (canvas !== undefined && canvas !== null && size.width && size.height) {
      canvas?.setDimensions({
        width:
          size.width - (sidebarOpen ? SIDEBAR_WIDTH : TOGGLE_SIDEBAR_WIDTH),
        height: size.height - 64
      })
    }
  }, [canvas, size, sidebarOpen])

  // drop event
  useEffect(() => {
    if (LogicBoard && canvas) {
      canvas?.on('drop', (event) => {
        const canvasPosition = canvas?.getPointer(event.e)

        const left = canvasPosition.x
        const top = canvasPosition.y
        let g
        switch (gate) {
          case 'AND':
            g = AND
            break
          case 'OR':
            g = OR
            break
          case 'NOT':
            g = NOT
            break
          case 'NAND':
            g = NAND
            break
          case 'NOR':
            g = NOR
            break
          case 'XOR':
            g = XOR
            break
          case 'XNOR':
            g = XNOR
            break
          default:
            g = AND
            break
        }

        LogicBoard?.add(g(left, top))
      })
    }

    return () => {
      canvas?.off('drop')
    }
  }, [canvas, gate, LogicBoard])

  return (
    <BoardLayout>
      <div className='flex justify-center items-center relative'>
        <canvas className='' ref={canvasRef} />
        <ActiveObjectInfoModal />
        <SelectModal />
      </div>
    </BoardLayout>
  )
}

export default LogicBoard
