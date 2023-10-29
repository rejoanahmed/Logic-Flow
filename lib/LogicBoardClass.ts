import { fabric } from 'fabric'
import ShortUniqueId from 'short-unique-id'
import { addComponent } from './functions'
const uid = new ShortUniqueId({ length: 8 })

export const RADIUS = 5
export const MINIMUM_GAP = 2
export interface AddEventOptions {}

export interface RemoveEventOptions {}

export interface ConnectEventOptions {}

export interface DisConnectEventOptions {}

export interface ComponentSchema {
  id: string
  inputs: { label?: string; id: string; from?: string }[]
  outputs: { label?: string; id: string; booleanFunction: string }[] // 'A&B' or 'A|B' or 'A^B' or 'A' or very complex boolean function (!A&B)|(C&D)
  x: number
  y: number
  label: string
}

export interface InputSchema {
  id: string
  x: number
  y: number
  label: string
  value: 0 | 1 | 'X'
}

export interface WireSchema {
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
    board?: (ComponentSchema | InputSchema | WireSchema)[],
    objectsMap?: Map<string, fabric.Object>
  ) {
    this.canvas = canvas
    this.board = []
    this.objectsMap = objectsMap || new Map()

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
        this.connect(connection)
      })
    }
  }

  add = (params: ComponentSchema | InputSchema) => {
    this.board.push(params)

    // components
    if ('inputs' in params) {
      addComponent(params, this.canvas, this.objectsMap)
    } else {
      // inputs
    }
  }

  remove = (params: RemoveEventOptions) => {}

  connect = (params: ConnectEventOptions) => {}

  disconnect = (params: DisConnectEventOptions) => {}
}

class PrimitiveGate {
  constructor() {}
}

export class ANDGate extends PrimitiveGate {
  noInputs: number = 2
  x: number
  y: number
  inputs: fabric.Object | 'X'[]
  outputs: 0 | 1 | 'X'[]
  id: string
  constructor(noInputs: number, x: number, y: number) {
    super()
    this.noInputs = noInputs
    this.inputs = Array(noInputs).fill('X')
    this.outputs = ['X']
    this.x = x
    this.y = y
    this.id = uid.rnd()
  }

  draw = (canvas: fabric.Canvas) => {
    const master = new fabric.IText('AND', {
      left: this.x,
      top: this.y,
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'monospace',
      hasControls: false,
      hasBorders: false,
      data: {
        id: this.id
      }
    })

    canvas.add(master)
  }
}

export default LogicBoard
