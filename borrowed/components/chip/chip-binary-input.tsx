import ChipGrowable from './chip-growable'
import React, { useState } from 'react'
import '../../styles/chip-binary-input.scss'
import ChipInstance from '@borrowed/model/chip-instance'
import {
  CircuitBuilderContext,
  Gate
} from '@borrowed/model/circuit-builder.types'

interface ChipBinaryInputProps {
  chip: ChipInstance
  context: CircuitBuilderContext
  isSelected: boolean
  onPinClicked: (gate: Gate) => void
  onChipDelete: (chip: ChipInstance) => void
  redraw: () => void
}

const ChipBinaryInput = (props: ChipBinaryInputProps) => {
  const [state, setState] = useState(0)

  const maxValue = Math.pow(2, props.chip.graph.nodes.length) - 1

  const checkValidity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.checkValidity()) {
      const value = Number(e.currentTarget.value)
      if (value < 0) setState(0)
      else setState(maxValue)
    }
  }

  const setOutputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const binaryString = Number(e.currentTarget.value).toString(2)

    let map = new Map()
    let j = 0
    for (let i = binaryString.length - 1; i >= 0; i--)
      map.set(Math.pow(2, j++), binaryString[i])

    props.chip.graph.nodes.forEach((gate) => {
      gate.state = map.get(Number(gate.data)) === '1'
    })
  }
  return (
    <ChipGrowable
      chip={props.chip}
      context={props.context}
      isSelected={props.isSelected}
      onChipDelete={props.onChipDelete}
      onPinClicked={props.onPinClicked}
      redraw={props.redraw}
    >
      <div>
        <input
          type='number'
          max={maxValue}
          min={0}
          value={state}
          defaultValue={0}
          onChange={(e) => {
            checkValidity(e)
            setOutputs(e)
          }}
          className='binary-input'
        ></input>
      </div>
    </ChipGrowable>
  )
}

export default ChipBinaryInput
