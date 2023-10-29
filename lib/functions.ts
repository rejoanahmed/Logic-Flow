import {
  ComponentSchema,
  InputSchema,
  MINIMUM_GAP,
  ObjectType,
  RADIUS,
  WireSchema
} from './LogicBoardClass'
import { fabric } from 'fabric'

type Nodee<T extends 'input' | 'composite'> = {
  booleanFunction: T extends 'composite' ? string : 0 | 1
  inputs: T extends 'composite' ? Nodee<'input' | 'composite'>[] : null
}

export const evaluateBooleanFunction = (
  param: Nodee<'input' | 'composite'>
) => {
  return eval(getBooleanExpression(param))
}

export const getBooleanExpression = (param: Nodee<'input' | 'composite'>) => {
  if (param.inputs === null) {
    return `${param.booleanFunction}`
  } else {
    let expression = param.booleanFunction as string
    for (let i = 0; i < param.inputs.length; i++) {
      const input = param.inputs[i]
      expression = expression.replaceAll(
        String.fromCharCode(65 + i),
        `${getBooleanExpression(input)}`
      )
    }
    return `(${expression})`
  }
}

export const addComponent = (
  params: ComponentSchema,
  canvas: fabric.Canvas,
  objectsMap: Map<string, fabric.Object>
) => {
  const noInputs = params.inputs.length
  const noOutputs = params.outputs.length

  const inputs = params.inputs.map((input) => {
    const obj: { label?: fabric.Text; circle: fabric.Circle } = {} as any
    if (input.label) {
      const labelText = new fabric.Text(input.label, {
        fill: 'white',
        originX: 'center',
        originY: 'center',
        fontSize: 12,
        hasControls: false,
        selectable: false
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
        type: ObjectType.ComponentInput,
        parent: params.id
      }
    })

    obj['circle'] = circle
    return obj
  })

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
        type: ObjectType.ComponentOutput,
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

  canvas.add(master)

  objectsMap.set(params.id, master)

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
      canvas.add(label)
      objectsMap.set(params.inputs[i].id + 'label', label)
    }
    objectsMap.set(params.inputs[i].id, circle)
    canvas.add(circle)
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
      canvas.add(label)
      objectsMap.set(params.outputs[i].id + 'label', label)
    }

    objectsMap.set(params.outputs[i].id, circle)
    canvas.add(circle)
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
      circle.top = master.top! + ((i + 1) * master.height!) / (noOutputs + 1)
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
}

export const addInput = (
  params: InputSchema,
  canvas: fabric.Canvas,
  objectsMap: Map<string, fabric.Object>
) => {
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
      id: params.id,
      type: 'input',
      parent: params.id
    }
  })

  const labelText = new fabric.Text(params.label, {
    fill: 'white',
    originX: 'center',
    originY: 'center',
    fontSize: 20
  })

  const labelBox = new fabric.Rect({
    width: 30,
    height: 30,
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

  canvas.add(master)

  objectsMap.set(params.id, master)

  circle.left = master.left! + master.width!
  circle.top = master.top! + master.height! / 2
  circle.setCoords()
  canvas.add(circle)
  objectsMap.set(params.id, circle)

  master.on('moving', () => {
    circle.left = master.left! + master.width!
    circle.top = master.top! + master.height! / 2
    circle.setCoords()
  })
}

export const addWire = (
  params: WireSchema,
  canvas: fabric.Canvas,
  objectsMap: Map<string, fabric.Object>,
  wiresMap: Map<string, WireSchema>
) => {
  // output to input
  let from: fabric.Object | { left: number; top: number } | undefined
  if (typeof params.from === 'string') {
    from = objectsMap.get(params.from)
  } else {
    from = { left: params.from.x, top: params.from.y }
  }
  const to = objectsMap.get(params.to)

  if (from && to) {
    const line = new fabric.Line([from.left!, from.top!, to.left!, to.top!], {
      stroke: 'white',
      strokeWidth: 3,
      hasControls: false,
      hoverCursor: 'pointer',
      moveCursor: 'pointer',
      data: params
    })
    canvas.add(line)
    objectsMap.set(params.id, line)
    wiresMap.set(params.id, params)
  }
}

/**
 * Remove component from board
 * @param id wire id
 * @param canvas fabric canvas
 * @param board board
 * @param wiresMap wires map
 * @param objectsMap objects map
 * @returns void
 */
export const removeWire = (
  id: string,
  canvas: fabric.Canvas,
  board: (ComponentSchema | InputSchema | WireSchema)[],
  wiresMap: Map<string, WireSchema>,
  objectsMap: Map<string, fabric.Object>
) => {
  // remove wire
  const wire = wiresMap.get(id)
  if (wire) {
    // remove from canvas
    canvas.remove(objectsMap.get(id)!)
    // remove from objectsMap
    objectsMap.delete(id)
    // remove from wiresMap
    wiresMap.delete(id)
    // remove from board
    board = board.filter((item) => item.id !== id)
  }
}

/**
 * Remove component from board
 * @param id component master id
 * @param canvas fabric canvas
 * @param board board
 * @param wiresMap wires map
 * @param objectsMap objects map
 * @returns void
 */
export const removeComponent = (
  id: string,
  canvas: fabric.Canvas,
  board: (ComponentSchema | InputSchema | WireSchema)[],
  wiresMap: Map<string, WireSchema>,
  objectsMap: Map<string, fabric.Object>
) => {
  // remove component
  const component = objectsMap.get(id)
  if (component) {
    // remove from canvas
    canvas.remove(component)

    // remove inputs and outputs and labels
    const componentSchema = component.data as ComponentSchema
    componentSchema.inputs.forEach((input) => {
      canvas.remove(objectsMap.get(input.id)!)
      objectsMap.delete(input.id)
      if (objectsMap.has(input.id + 'label')) {
        canvas.remove(objectsMap.get(input.id + 'label')!)
        objectsMap.delete(input.id + 'label')
      }
    })
    componentSchema.outputs.forEach((output) => {
      canvas.remove(objectsMap.get(output.id)!)
      objectsMap.delete(output.id)
      if (objectsMap.has(output.id + 'label')) {
        canvas.remove(objectsMap.get(output.id + 'label')!)
        objectsMap.delete(output.id + 'label')
      }
    })

    // remove from objectsMap
    objectsMap.delete(id)
    // remove from wiresMap
    wiresMap.forEach((wire) => {
      if (wire.from === id || wire.to === id) {
        removeWire(wire.id, canvas, board, wiresMap, objectsMap)
      }
    })
    // remove from board
    board = board.filter((item) => item.id !== id)
  }
}
