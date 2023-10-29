import React from 'react'
import '../../styles/chip-output.scss'
import Chip from './chip'
import {
  CircuitBuilderContext,
  Gate,
  GateRole
} from '@borrowed/model/circuit-builder.types'
import ChipInstance from '@borrowed/model/chip-instance'

interface ChipOutputProps {
  chip: ChipInstance
  context: CircuitBuilderContext
  isSelected: boolean
  onPinClicked: (gate: Gate) => void
  onChipDelete: (chip: ChipInstance) => void
  redraw: () => void
}
const ChipOutput = (props: ChipOutputProps) => {
  let className = ''

  if (props.context.isSimulationRunning) {
    let outputGate = props.chip.graph.nodes.find(
      (gate) => gate.role === GateRole.Output && gate.firstLayer
    )

    if (outputGate?.state) {
      className += 'chip-role-output-true'
    } else {
      className += 'chip-role-output-false'
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
      redraw={props.redraw}
    ></Chip>
  )
}

export default ChipOutput
