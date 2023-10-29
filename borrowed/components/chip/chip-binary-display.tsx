import ChipGrowable from './chip-growable.tsx'
import React from 'react'
import '../../styles/chip-binary-display.scss'
import ChipInstance from '@borrowed/model/chip-instance'
import {
  CircuitBuilderContext,
  Gate
} from '@borrowed/model/circuit-builder.types'

interface ChipBinaryDisplayProps {
  chip: ChipInstance
  context: CircuitBuilderContext
  isSelected: boolean
  onPinClicked: (gate: Gate) => void
  onChipDelete: (chip: ChipInstance) => void
  redraw: () => void
}

export default function ChipBinaryDisplay({
  chip,
  context,
  isSelected,
  onChipDelete,
  onPinClicked,
  redraw
}: ChipBinaryDisplayProps) {
  function getBinaryDisplay(): JSX.Element {
    let result = 0

    chip.graph.nodes.forEach((gate) => {
      if (gate.state) result += Number(gate.data!)
    })

    return (
      <ChipGrowable
        chip={chip}
        context={context}
        isSelected={isSelected}
        onChipDelete={onChipDelete}
        onPinClicked={onPinClicked}
        redraw={redraw}
      >
        {getBinaryDisplay()}
      </ChipGrowable>
    )
  }
}
