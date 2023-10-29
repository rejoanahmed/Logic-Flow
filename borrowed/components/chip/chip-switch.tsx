import React from 'react'
import '../../styles/chip-output.scss'
import {
  CircuitBuilderContext,
  Gate,
  GateRole
} from '@borrowed/model/circuit-builder.types'
import Chip from './chip'
import ChipInstance from '@borrowed/model/chip-instance'
interface ChipSwitchProps {
  chip: ChipInstance
  context: CircuitBuilderContext
  isSelected: boolean
  onPinClicked: (gate: Gate) => void
  onChipDelete: (chip: ChipInstance) => void
  redraw: () => void
}
const ChipSwitch = (props: ChipSwitchProps) => {
  let className = ''
  let clickEvent = () => {}

  if (props.context.isSimulationRunning) {
    className += 'chip-role-switch'

    let switchGate = props.chip.graph.nodes.find(
      (gate) => gate.role === GateRole.Switch && gate.firstLayer
    )
    clickEvent = () => {
      switchGate!.state = switchGate!.state ? false : true
    }
  }

  return (
    <Chip
      chip={props.chip}
      context={props.context}
      isSelected={props.isSelected}
      onChipDelete={props.onChipDelete}
      onPinClicked={props.onPinClicked}
      extraClassName={className}
      extraClickEvent={clickEvent}
      redraw={props.redraw}
    ></Chip>
  )
}

export default ChipSwitch
