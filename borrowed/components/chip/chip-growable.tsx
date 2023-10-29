import ChipInstance from '@borrowed/model/chip-instance'
import {
  CircuitBuilderContext,
  Gate
} from '@borrowed/model/circuit-builder.types'
import { useState } from 'react'
import Chip from './chip'
import '../../styles/chip-growable.scss'

interface ChipGrowableProps {
  chip: ChipInstance
  context: CircuitBuilderContext
  isSelected: boolean
  onPinClicked: (gate: Gate) => void
  onChipDelete: (chip: ChipInstance) => void
  redraw: () => void
  children: JSX.Element
}

export default function ChipGrowable({
  chip,
  context,
  isSelected,
  onChipDelete,
  onPinClicked,
  redraw,
  children
}: ChipGrowableProps) {
  const [state, setState] = useState({} as { growableIndex: number })

  function addGrowableGate() {
    if (chip.blueprint.growableData) {
      const growableData = chip.blueprint.growableData
      let gate: Gate = { ...growableData.gate }

      gate.id = handlePlaceholder(gate.id)
      if (gate.name) gate.name = handlePlaceholder(gate.name)
      if (gate.data) gate.data = handlePlaceholder(gate.data)

      chip.graph.addNode(gate)
      setState({ growableIndex: state.growableIndex + 1 })
      redraw()
    }
  }

  function removeGrowableGate() {}

  function handlePlaceholder(placeholder: string): string {
    let resultPowToIndex = new RegExp(/\[pow:(\d+),i\]/).exec(placeholder) //"out [pow:2,i]"

    if (resultPowToIndex && resultPowToIndex.length === 2)
      return placeholder.replace(
        /\[.*?\]/,
        `${Math.pow(Number(resultPowToIndex[1]), state.growableIndex)}`
      )
    else return placeholder
  }

  return (
    <Chip
      chip={chip}
      context={context}
      isSelected={isSelected}
      onChipDelete={onChipDelete}
      onPinClicked={onPinClicked}
      redraw={redraw}
    >
      {children}
      <div className='growable-wrapper'>
        <div className='grow-button' id='add' onClick={addGrowableGate}>
          +
        </div>
        <div className='grow-button' id='remove' onClick={removeGrowableGate}>
          -
        </div>
      </div>
    </Chip>
  )
}
