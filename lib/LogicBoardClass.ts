import { fabric } from 'fabric'
import ShortUniqueId from 'short-unique-id'
const uid = new ShortUniqueId({ length: 8 })
export const RADIUS = 5
export const MINIMUM_GAP = 2
export interface AddEventOptions {}

export interface RemoveEventOptions {}

export interface ConnectEventOptions {}

export interface DisConnectEventOptions {}

export interface ComponentSchema {
  id: string
  inputs: { label?: string; id: string; from?: string }[] // id[]
  outputs: { label?: string; id: string; booleanFunction: string }[] // id[]  // 'A&B' or 'A|B' or 'A^B' or 'A' or very complex boolean function (!A&B)|(C&D)
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
  constructor(
    canvas: fabric.Canvas,
    board?: (ComponentSchema | InputSchema | WireSchema)[],
    objectsMap?: Map<string, fabric.Object>
  ) {
    this.canvas = canvas
    this.board = board || []
    this.objectsMap = objectsMap || new Map()

    if (board) {
      let components: (ComponentSchema | InputSchema)[] = [],
        connections: WireSchema[] = []
      for (let i = 0; i < this.board.length; i++) {
        const element = this.board[i]
        if ('x' in element) {
          components.push(element)
        } else {
          connections.push(element)
        }
      }
      components.forEach((component) => {
        this.add(component)
      })
      connections.forEach((connection) => {
        this.connect(connection)
      })
    }
  }

  add = (params: ComponentSchema | InputSchema) => {
    this.board.push(params)

    // components
    if ('inputs' in params) {
      // inputs
      const inputs = params.inputs.map((input) => {
        const obj: { label?: fabric.Text; circle: fabric.Circle } = {} as any
        if (input.label) {
          const labelText = new fabric.Text(input.label, {
            fill: 'white',
            originX: 'center',
            originY: 'center',
            fontSize: 12,
            hasControls: false
          })
          obj['label'] = labelText
        }

        const circle = new fabric.Circle({
          radius: RADIUS,
          fill: 'white',
          originX: 'center',
          originY: 'center',
          hasControls: false,
          hoverCursor: 'pointer',
          moveCursor: 'pointer',
          lockMovementX: true,
          lockMovementY: true,
          data: {
            id: input.id,
            type: 'input',
            parent: params.id
          }
        })

        obj['circle'] = circle
        return obj
      })
      const noInputs = params.inputs.length
      const noOutputs = params.outputs.length

      const outputs = params.outputs.map((output) => {
        const obj: { label?: fabric.Text; circle: fabric.Circle } = {} as any
        if (output.label) {
          const labelText = new fabric.Text(output.label, {
            fill: 'white',
            originX: 'center',
            originY: 'center',
            fontSize: 12,
            hasControls: false
          })
          obj['label'] = labelText
        }

        const circle = new fabric.Circle({
          radius: RADIUS,
          fill: 'white',
          originX: 'center',
          originY: 'center',
          hasControls: false,
          hoverCursor: 'pointer',
          moveCursor: 'pointer',
          lockMovementX: true,
          lockMovementY: true,
          data: {
            id: output.id,
            type: 'output',
            parent: params.id
          }
        })

        obj['circle'] = circle
        return obj
      })

      const padding = Math.max(
        ...inputs.map((input) => input.label?.width || 0),
        ...outputs.map((output) => output.label?.width || 0)
      )

      const labelText = new fabric.Text(params.label, {
        fill: 'white',
        originX: 'center',
        originY: 'center',
        fontSize: 20
      })
      const labelBox = new fabric.Rect({
        width: labelText.width! + 40 + padding,
        height: Math.max(
          params.inputs.length * (RADIUS + MINIMUM_GAP * 2) * 2,
          labelText.height! + 20
        ),
        originX: 'center',
        originY: 'center',
        fill: 'black'
      })

      const master = new fabric.Group([labelBox, labelText], {
        left: params.x,
        top: params.y,
        hasControls: false,
        data: params
      })

      this.canvas.add(master)

      this.objectsMap.set(params.id, master)

      // inputs and outputs
      for (let i = 0; i < noInputs; i++) {
        const input = inputs[i]
        const circle = input.circle
        const label = input.label
        circle.left = master.left!
        circle.top = master.top! + ((i + 1) * master.height!) / (noInputs + 1)
        circle.setCoords()
        if (label) {
          label.set({
            left: circle.left! + RADIUS * 2 + MINIMUM_GAP,
            top: circle.top!,
            selectable: false,
            hasControls: false
          })
          this.canvas.add(label)
        }
        this.objectsMap.set(params.inputs[i].id, circle)
        this.canvas.add(circle)
      }

      for (let i = 0; i < noOutputs; i++) {
        const output = outputs[i]
        const circle = output.circle
        const label = output.label
        circle.left = master.left! + master.width!
        circle.top = master.top! + ((i + 1) * master.height!) / (noOutputs + 1)
        circle.setCoords()
        if (label) {
          label.left = circle.left! - (RADIUS * 2 + MINIMUM_GAP)
          label.top = circle.top!
          label.set({
            selectable: false,
            hasControls: false
          })
          this.canvas.add(label)
        }

        this.objectsMap.set(params.outputs[i].id, circle)
        this.canvas.add(circle)
      }

      master.on('moving', () => {
        // inputs and outputs
        for (let i = 0; i < noInputs; i++) {
          const input = inputs[i]
          const circle = input.circle
          const label = input.label
          circle.left = master.left!
          circle.top = master.top! + ((i + 1) * master.height!) / (noInputs + 1)
          circle.setCoords()
          if (label) {
            label.set({
              left: circle.left! + RADIUS * 2 + MINIMUM_GAP,
              top: circle.top!,
              selectable: false,
              hasControls: false
            })
          }
        }

        for (let i = 0; i < noOutputs; i++) {
          const output = outputs[i]
          const circle = output.circle
          const label = output.label
          circle.left = master.left! + master.width!
          circle.top =
            master.top! + ((i + 1) * master.height!) / (noOutputs + 1)
          circle.setCoords()
          if (label) {
            label.left = circle.left! - (RADIUS * 2 + MINIMUM_GAP)
            label.top = circle.top!
            label.set({
              selectable: false,
              hasControls: false
            })
          }
        }
      })
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
