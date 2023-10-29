import { fabric } from 'fabric'
import ShortUniqueId from 'short-unique-id'
import {
  addComponent,
  addInput,
  addWire,
  removeComponent,
  removeWire
} from './functions'
const uid = new ShortUniqueId({ length: 8 })

export const RADIUS = 5
export const MINIMUM_GAP = 2

export enum ObjectType {
  Input = 'input',
  Master = 'master',
  ComponentInput = 'component-input',
  ComponentOutput = 'component-output',
  Wire = 'wire'
}

export enum BoardElementType {
  Component = 'component',
  Input = 'input',
  Wire = 'wire'
}
export interface AddEventOptions {}

export interface RemoveEventOptions {}

export interface ConnectEventOptions {}

export interface DisConnectEventOptions {}

export interface ComponentSchema {
  type: BoardElementType.Component
  id: string
  inputs: { label?: string; id: string }[]
  outputs: { label?: string; id: string; booleanFunction: string }[] // 'A&B' or 'A|B' or 'A^B' or 'A' or very complex boolean function (!A&B)|(C&D)
  x: number
  y: number
  label: string
}

export interface InputSchema {
  type: BoardElementType.Input
  id: string
  x: number
  y: number
  label: string
  value: 0 | 1 | 'X'
}

export interface WireSchema {
  type: BoardElementType.Wire
  id: string
  from: string | { id: string; x: number; y: number } // can be wireid or component output id
  to: string // only component input id
}
class LogicBoard {
  canvas: fabric.Canvas
  objectsMap: Map<string, fabric.Object>
  board: (ComponentSchema | InputSchema | WireSchema)[] = []
  // wire map different from board
  wiresMap: Map<string, WireSchema> = new Map()

  constructor(
    canvas: fabric.Canvas,
    board?: (ComponentSchema | InputSchema | WireSchema)[]
  ) {
    this.canvas = canvas
    this.board = []
    this.objectsMap = new Map()
    this.wiresMap = new Map()

    if (board) {
      let components: (ComponentSchema | InputSchema)[] = [],
        wires: WireSchema[] = []
      for (let i = 0; i < this.board.length; i++) {
        const element = this.board[i]
        if ('x' in element) {
          components.push(element)
        } else {
          wires.push(element)
        }
      }
      components.forEach((component) => {
        this.add(component)
      })
      wires.forEach((connection) => {
        this.add(connection)
      })
    }
  }

  add = (params: ComponentSchema | InputSchema | WireSchema) => {
    this.board.push(params)
    // components
    if (params.type === BoardElementType.Component) {
      addComponent(params, this.canvas, this.objectsMap)
    } else if (params.type === BoardElementType.Input) {
      // inputs
      addInput(params, this.canvas, this.objectsMap)
    } else {
      // wires
      addWire(params, this.canvas, this.objectsMap, this.wiresMap)
    }
  }

  remove = (id: string) => {
    if (this.objectsMap.has(id)) {
      // check if it is wire
      if (this.wiresMap.has(id)) {
        removeWire(id, this.canvas, this.board, this.wiresMap, this.objectsMap)
      } else {
        // remove component or input
        const object = this.objectsMap.get(id)
        if (object) {
          removeComponent(
            id,
            this.canvas,
            this.board,
            this.wiresMap,
            this.objectsMap
          )
        }
      }
    }
  }

  setInputs = (params: { id: string; value: 0 | 1 | 'X' }[]) => {}
}

export default LogicBoard
