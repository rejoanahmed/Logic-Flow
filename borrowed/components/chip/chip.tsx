import NotificationManager, {
  NotificationType
} from '@borrowed/manager/notification-manager'
import ChipInstance from '@borrowed/model/chip-instance'
import {
  CircuitBuilderContext,
  Gate,
  PinSide,
  Tool
} from '@borrowed/model/circuit-builder.types'
import GateHelper from '@borrowed/utilities/GateHelper'
import { ReactNode, useEffect, useRef } from 'react'
import 'borrowed/styles/chip.scss'

interface ChipProps {
  chip: ChipInstance
  context: CircuitBuilderContext
  isSelected: boolean

  onChipDelete: (chip: ChipInstance) => void
  onPinClicked: (gate: Gate) => void
  redraw: () => void

  extraClassName?: string
  extraClickEvent?: () => void
  children?: ReactNode
}

interface ChipState {
  growableIndex: number
}

export default function Chip(props: ChipProps) {
  const chipRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chipRef.current) {
      const rect = chipRef.current.getBoundingClientRect()
      props.chip.size = { x: rect.width, y: rect.height }
    }
  }, [])

  function renamePin(gate: Gate) {
    // TODO: implement
  }

  const getPinElementsForSide = (side: PinSide): JSX.Element => {
    return (
      <div className={`pin-side pins-${side.toLowerCase()}`}>
        {GateHelper.getGatesForPinSide(props.chip.graph, side).map((gate) => {
          let className = 'pin '

          if (gate.error === true) className += 'pin-error '

          if (props.context.isSimulationRunning) {
            if (gate.state === true) className += 'pin-true '
            else className += 'pin-false '
          }

          let clickEvent = () => {}

          if (props.context.activeTool === Tool.Wire)
            clickEvent = () => props.onPinClicked(gate)
          else if (props.context.activeTool === Tool.Rename) {
            clickEvent = () => renamePin(gate)
            className += 'pin-tool-rename '
          }

          return (
            <div
              data-gateid={gate.id}
              key={gate.id}
              className={className}
              title={gate.name}
              onClick={clickEvent}
              onTouchStart={() => {
                if (gate.name)
                  NotificationManager.addNotification(
                    gate.name,
                    ' ',
                    NotificationType.default,
                    2000
                  )
              }}
            ></div>
          )
        })}
      </div>
    )
  }

  const minYSize =
    Math.max(
      GateHelper.getGatesForPinSide(props.chip.graph, PinSide.Left).length,
      GateHelper.getGatesForPinSide(props.chip.graph, PinSide.Right).length
    ) * 20
  const minXSize =
    Math.max(
      GateHelper.getGatesForPinSide(props.chip.graph, PinSide.Top).length,
      GateHelper.getGatesForPinSide(props.chip.graph, PinSide.Bottom).length
    ) * 20

  const style = {
    backgroundColor: props.chip.blueprint.color,
    minWidth: minXSize >= 100 ? minXSize : 100,
    minHeight: minYSize >= 50 ? minYSize : 50
  }

  let className = 'chip chip-on-board ' + props.extraClassName + ' '
  let clickEvent = props.extraClickEvent

  if (!props.context.isSimulationRunning) {
    if (props.context.activeTool === Tool.Delete) {
      className += 'chip-tool-delete '
      clickEvent = () => {
        props.onChipDelete(props.chip)
      }
    } else if (props.context.activeTool === Tool.Move)
      className += 'chip-tool-move '

    if (props.isSelected) className += 'selected '
  }

  return (
    <div
      ref={chipRef}
      data-chipid={props.chip.id}
      className={className}
      style={style}
      onClick={clickEvent}
    >
      <span>{props.chip.blueprint.name}</span>
      <></>
      {props.children}
      {getPinElementsForSide(PinSide.Top)}
      {getPinElementsForSide(PinSide.Left)}
      {getPinElementsForSide(PinSide.Bottom)}
      {getPinElementsForSide(PinSide.Right)}
    </div>
  )
}
