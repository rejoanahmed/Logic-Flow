import Chip from './chip/chip'
import ChipBinaryDisplay from './chip/chip-binary-display'
import ChipBinaryInput from './chip/chip-binary-input'
import ChipOutput from './chip/chip-output'
import ChipSwitch from './chip/chip-switch'
import Draggable from './draggable'

import React, { useEffect, useState } from 'react'
import Wire from '../wire/wire'

import '../styles/board.scss'
import ChipInstance from '@borrowed/model/chip-instance'
import {
  WireModel,
  CircuitBuilderContext,
  Vector2,
  Tool,
  ChipRole
} from '@borrowed/model/circuit-builder.types'
import { Gate } from '@borrowed/simulation/simulator.types'
import EventHandlerHelper from '@borrowed/utilities/EventHandlerHelper'

interface BoardProps {
  chips: ChipInstance[]
  wires: WireModel[]
  context: CircuitBuilderContext

  onPinClicked: (gate: Gate) => void
  onChipDelete: (chip: ChipInstance) => void
  onWireDelete: (id: WireModel) => void

  redraw: () => void
}

interface BoardState {
  translation: Vector2

  isSelecting: boolean
  selectionStart: Vector2
  selectionEnd: Vector2

  selectedChips: ChipInstance[]
  selectedDragChipId?: string
  selectedDragDelta?: Vector2
}

export default function Board(props: BoardProps) {
  const [state, setState] = useState<BoardState>({
    translation: { x: 0, y: 0 },

    isSelecting: false,
    selectionStart: { x: 0, y: 0 },
    selectionEnd: { x: 0, y: 0 },

    selectedChips: [],
    selectedDragChipId: undefined,
    selectedDragDelta: undefined
  })

  const boardRef = React.createRef<HTMLDivElement>()

  const {
    context,
    chips,
    wires,
    onPinClicked,
    onChipDelete,
    onWireDelete,
    redraw
  } = props
  const {
    translation,
    selectedChips,
    selectedDragChipId,
    selectedDragDelta,
    isSelecting,
    selectionStart,
    selectionEnd
  } = state

  const { tool, setTool } = context

  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.addEventListener('touchstart', onSelectionStart, {
        passive: false
      })
      boardRef.current.addEventListener('touchmove', onSelectionDrag, {
        passive: false
      })
      boardRef.current.addEventListener('touchend', onSelectionEnd, {
        passive: false
      })
    } else {
      console.log('no board ref')
    }

    return () => {
      if (boardRef.current) {
        boardRef.current.removeEventListener('touchstart', onSelectionStart)
        boardRef.current.removeEventListener('touchmove', onSelectionDrag)
        boardRef.current.removeEventListener('touchend', onSelectionEnd)
      } else {
        console.log('no board ref')
      }
    }
  }, [])

  function onDragCallback(translation: Vector2) {
    setState((prev) => ({ ...prev, translation: translation }))
    context.boardTranslation = translation
  }

  //#region Selection box
  function onSelectionStart(e: any) {
    if (context.activeTool === Tool.Select) {
      const clientPos = EventHandlerHelper.GetEventClientPos(e, 'touchstart')

      const startPos: Vector2 = {
        x: clientPos.x - context.boardTranslation.x,
        y: clientPos.y - context.boardTranslation.y
      }
      setState((prev) => ({
        ...prev,
        selectionStart: startPos,
        selectionEnd: startPos,
        isSelecting: true
      }))
    }
  }

  function onSelectionDrag(e: any) {
    if (!isSelecting) return

    const clientPos = EventHandlerHelper.GetEventClientPos(e, 'touchmove')
    const selectionEnd: Vector2 = {
      x: clientPos.x - context.boardTranslation.x,
      y: clientPos.y - context.boardTranslation.y
    }

    const top = Math.min(selectionStart.y, selectionEnd.y)
    const bottom = Math.max(selectionStart.y, selectionEnd.y)
    const left = Math.min(selectionStart.x, selectionEnd.x)
    const right = Math.max(selectionStart.x, selectionEnd.x)

    let selectedChips: ChipInstance[] = []

    chips.forEach((chip) => {
      if (isInSelection(chip, top, bottom, left, right))
        selectedChips.push(chip)
    })

    setState((prev) => ({
      ...prev,
      selectionEnd: selectionEnd,
      selectedChips: selectedChips
    }))
  }

  function onSelectionEnd(e: any) {
    if (!isSelecting) return

    setState((prev) => ({ ...prev, isSelecting: false }))
  }

  function isInSelection(
    chip: ChipInstance,
    top: number,
    bottom: number,
    left: number,
    right: number
  ): boolean {
    if (
      chip.position.y + chip.size.y > top &&
      chip.position.y < bottom &&
      chip.position.x + chip.size.x > left &&
      chip.position.x < right
    )
      return true
    else return false
  }
  //#endregion

  //#region render helper
  function getSelectionBox(): JSX.Element {
    if (isSelecting)
      return (
        <svg className='selection-box'>
          <rect
            x={Math.min(selectionStart.x, selectionEnd.x)}
            y={Math.min(selectionStart.y, selectionEnd.y)}
            width={Math.abs(selectionStart.x - selectionEnd.x)}
            height={Math.abs(selectionStart.y - selectionEnd.y)}
          ></rect>
        </svg>
      )
    else return <></>
  }
  //#endregion

  function getDetla(position: Vector2, translation: Vector2): Vector2 {
    return { x: translation.x - position.x, y: translation.y - position.y }
  }

  function getChipComponent(
    chip: ChipInstance,
    isSelected: boolean
  ): JSX.Element {
    if (chip.blueprint.role === ChipRole.BinaryDisplay)
      return (
        <ChipBinaryDisplay
          isSelected={isSelected}
          context={context}
          key={chip.id}
          chip={chip}
          onChipDelete={onChipDelete}
          onPinClicked={onPinClicked}
          redraw={redraw}
        ></ChipBinaryDisplay>
      )
    else if (chip.blueprint.role === ChipRole.BinaryInput)
      return (
        <ChipBinaryInput
          isSelected={isSelected}
          context={context}
          key={chip.id}
          chip={chip}
          onChipDelete={onChipDelete}
          onPinClicked={onPinClicked}
          redraw={redraw}
        ></ChipBinaryInput>
      )
    if (chip.blueprint.role === ChipRole.Switch)
      return (
        <ChipSwitch
          isSelected={isSelected}
          context={context}
          key={chip.id}
          chip={chip}
          onChipDelete={onChipDelete}
          onPinClicked={onPinClicked}
          redraw={redraw}
        ></ChipSwitch>
      )
    else if (chip.blueprint.role === ChipRole.Output)
      return (
        <ChipOutput
          isSelected={isSelected}
          context={context}
          key={chip.id}
          chip={chip}
          onChipDelete={onChipDelete}
          onPinClicked={onPinClicked}
          redraw={redraw}
        ></ChipOutput>
      )

    return (
      <Chip
        isSelected={isSelected}
        context={context}
        key={chip.id}
        chip={chip}
        onChipDelete={onChipDelete}
        onPinClicked={onPinClicked}
        redraw={redraw}
      ></Chip>
    )
  }

  let className = 'board board-size '
  if (context.activeTool === Tool.Pan) className += 'board-tool-pan '

  return (
    <Draggable
      className='board-size'
      confine='fullscreen'
      enabled={context.activeTool === Tool.Pan}
      onDragCallback={onDragCallback}
    >
      <div
        ref={boardRef}
        className={className}
        onMouseDown={onSelectionStart}
        onMouseMove={onSelectionDrag}
        onMouseUp={onSelectionEnd}
        onContextMenuCapture={(e) => {
          setState((prev) => ({
            ...prev,
            selectionStart: { x: 0, y: 0 },
            selectionEnd: { x: 0, y: 0 },
            selectedChips: []
          }))
          e.preventDefault()
          return false
        }}
      >
        {getSelectionBox()}
        {wires.map((wire) => {
          return (
            <Wire
              context={context}
              key={`${wire.fromId}_${wire.toId}`}
              wire={wire}
              onWireDelete={onWireDelete}
            ></Wire>
          )
        })}
        {chips.map((chip) => {
          const isSelected = state.selectedChips.includes(chip)
          let delta = undefined

          if (isSelected && state.selectedDragChipId !== chip.id)
            delta = state.selectedDragDelta

          return (
            <Draggable
              key={chip.id}
              confine='parent'
              delta={delta}
              className='absolute'
              enabled={
                context.activeTool === Tool.Move && !context.isSimulationRunning
              }
              startPosition={chip.position}
              onDragCallback={(translation) => {
                setState((prev) => ({
                  ...prev,
                  selectedDragDelta: getDetla(chip.position, translation),
                  selectedDragChipId: chip.id
                }))
                chip.position = translation
              }}
              onDragEnd={() =>
                setState((prev) => ({
                  ...prev,
                  selectedDragDelta: undefined,
                  selectedDragChipId: undefined
                }))
              }
            >
              {getChipComponent(chip, isSelected)}
            </Draggable>
          )
        })}
      </div>
    </Draggable>
  )
}
