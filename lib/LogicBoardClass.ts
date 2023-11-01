import { fabric } from 'fabric'
import ShortUniqueId from 'short-unique-id'
import {
  addComponent,
  addInput,
  addWire,
  moveComponent,
  removeComponent,
  removeWire
} from './functions'
import { Space } from '@ably/spaces'
const uid = new ShortUniqueId({ length: 8 })

export const RADIUS = 5
export const MINIMUM_GAP = 2
export const WIRE_WIDTH = 5
export const PADDING = 10

export enum ObjectType {
  Input = 'input',
  Master = 'master',
  ComponentInput = 'component-input',
  ComponentOutput = 'component-output',
  Wire = 'wire',
  Cursor = 'cursor'
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
  space: Space
  constructor(
    canvas: fabric.Canvas,
    space: Space,
    board?: (ComponentSchema | InputSchema | WireSchema)[]
  ) {
    this.canvas = canvas
    this.board = []
    this.objectsMap = new Map()
    this.wiresMap = new Map()
    this.space = space
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

  add = <T extends ComponentSchema | InputSchema | WireSchema>(
    params: T,
    publishEvent = true
  ) => {
    publishEvent && this.space.channel.publish('add', params)
    this.board.push(params)
    // components
    if (params.type === BoardElementType.Component) {
      addComponent(
        params,
        this.canvas,
        this.objectsMap,
        this.space,
        this.wiresMap
      )
    } else if (params.type === BoardElementType.Input) {
      // inputs
      addInput(params, this.canvas, this.objectsMap)
    } else {
      // wires
      addWire(params, this.canvas, this.objectsMap, this.wiresMap)
    }
  }

  remove = (id: string) => {
    this.space.channel.publish('remove', id)
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

  move = (options: { id?: string; x?: number; y?: number }) => {
    const { id, x, y } = options
    if (id && x && y) {
      const master = this.objectsMap.get(id!) as fabric.Group
      if (!master) return
      master.set({ left: x, top: y })
      const inputIds = master?.data?.inputs.map(
        (input: any) => input.id
      ) as string[]
      const outputIds = master?.data?.outputs.map(
        (output: any) => output.id
      ) as string[]
      const inputs = inputIds.map((id) => {
        return {
          label: this.objectsMap.get(id + 'label') as fabric.Text | undefined,
          circle: this.objectsMap.get(id) as fabric.Circle
        }
      })
      const outputs = outputIds.map((id) => {
        return {
          label: this.objectsMap.get(id + 'label') as fabric.Text | undefined,
          circle: this.objectsMap.get(id) as fabric.Circle
        }
      })

      moveComponent(
        x,
        y,
        this.objectsMap,
        this.wiresMap,
        master,
        inputs,
        outputs
      )
    }
  }
}

export default LogicBoard
