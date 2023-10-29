import React, { useRef } from 'react'
import Draggable from '../draggable'

import '../../styles/chip-toolbox.scss'
import { ChipBlueprint, Vector2 } from '@borrowed/model/circuit-builder.types'

interface ChipToolboxProps {
  blueprint: ChipBlueprint
  onChipClicked: (chip: ChipBlueprint, position: Vector2) => void
}

const ChipToolbox = (props: ChipToolboxProps) => {
  const chipRef = useRef<HTMLDivElement>(null)

  const onStop = (translation: Vector2) => {
    if (chipRef.current) {
      const rect = chipRef.current.getBoundingClientRect()

      if (translation.y < -100) {
        props.onChipClicked(props.blueprint, { x: rect.x, y: rect.y })
      }
    }
  }

  let style = { backgroundColor: props.blueprint.color }

  return (
    <div className='chip-on-toolbox-wrapper'>
      <Draggable enabled={true} resetAfterStop={true} onDragEnd={onStop}>
        <div
          ref={chipRef}
          className='chip chip-on-toolbox'
          style={style}
          title={props.blueprint.description}
        >
          <span className='title'>{props.blueprint.name}</span>
        </div>
      </Draggable>

      {/* Fake Chip */}
      <div className='chip chip-on-toolbox chip-on-toolbox-fake' style={style}>
        <span>{props.blueprint.name}</span>
      </div>
    </div>
  )
}

export default ChipToolbox
