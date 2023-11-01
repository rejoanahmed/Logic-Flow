import { BoardElementType, ComponentSchema } from './LogicBoardClass'
import { uid } from './functions'

export const MUX8X1 = (x: number, y: number): ComponentSchema => ({
  x,
  type: BoardElementType.Component,
  y,
  id: uid.randomUUID(),
  inputs: [
    { id: uid.randomUUID(), label: 'A' },
    { id: uid.randomUUID(), label: 'B' },
    { id: uid.randomUUID(), label: 'C' },
    { id: uid.randomUUID(), label: 'D' },
    { id: uid.randomUUID(), label: 'E' },
    { id: uid.randomUUID(), label: 'F' },
    { id: uid.randomUUID(), label: 'G' },
    { id: uid.randomUUID(), label: 'H' }
  ],
  label: '8X1 MUX',
  outputs: [
    { id: uid.randomUUID(), label: 'X', booleanFunction: 'A&&B' },
    { id: uid.randomUUID(), label: 'Y', booleanFunction: 'A&&B' },
    { id: uid.randomUUID(), label: 'Z', booleanFunction: 'A&&B' }
  ]
})

export const AND = (x: number, y: number): ComponentSchema => ({
  x,
  type: BoardElementType.Component,
  y,
  id: uid.randomUUID(),
  inputs: [
    { id: uid.randomUUID(), label: 'A' },
    { id: uid.randomUUID(), label: 'B' }
  ],
  label: 'AND',
  outputs: [{ id: uid.randomUUID(), label: 'X', booleanFunction: 'A&&B' }]
})

export const OR = (x: number, y: number): ComponentSchema => ({
  x,
  type: BoardElementType.Component,
  y,
  id: uid.randomUUID(),
  inputs: [
    { id: uid.randomUUID(), label: 'A' },
    { id: uid.randomUUID(), label: 'B' }
  ],
  label: 'OR',
  outputs: [{ id: uid.randomUUID(), label: 'X', booleanFunction: 'A||B' }]
})

export const NOT = (x: number, y: number): ComponentSchema => ({
  x,
  type: BoardElementType.Component,
  y,
  id: uid.randomUUID(),
  inputs: [{ id: uid.randomUUID(), label: 'A' }],
  label: 'NOT',
  outputs: [{ id: uid.randomUUID(), label: 'X', booleanFunction: '!A' }]
})

export const NAND = (x: number, y: number): ComponentSchema => ({
  x,
  type: BoardElementType.Component,
  y,
  id: uid.randomUUID(),
  inputs: [
    { id: uid.randomUUID(), label: 'A' },
    { id: uid.randomUUID(), label: 'B' }
  ],
  label: 'NAND',
  outputs: [{ id: uid.randomUUID(), label: 'X', booleanFunction: '!(A&&B)' }]
})

export const NOR = (x: number, y: number): ComponentSchema => ({
  x,
  type: BoardElementType.Component,
  y,
  id: uid.randomUUID(),
  inputs: [
    { id: uid.randomUUID(), label: 'A' },
    { id: uid.randomUUID(), label: 'B' }
  ],
  label: 'NOR',
  outputs: [{ id: uid.randomUUID(), label: 'X', booleanFunction: '!(A||B)' }]
})

export const XOR = (x: number, y: number): ComponentSchema => ({
  x,
  type: BoardElementType.Component,
  y,
  id: uid.randomUUID(),
  inputs: [
    { id: uid.randomUUID(), label: 'A' },
    { id: uid.randomUUID(), label: 'B' }
  ],
  label: 'XOR',
  outputs: [{ id: uid.randomUUID(), label: 'X', booleanFunction: 'A^B' }]
})

export const XNOR = (x: number, y: number): ComponentSchema => ({
  x,
  type: BoardElementType.Component,
  y,
  id: uid.randomUUID(),
  inputs: [
    { id: uid.randomUUID(), label: 'A' },
    { id: uid.randomUUID(), label: 'B' }
  ],
  label: 'XNOR',
  outputs: [{ id: uid.randomUUID(), label: 'X', booleanFunction: '!(A^B)' }]
})
