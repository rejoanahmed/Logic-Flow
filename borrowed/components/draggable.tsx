import { Vector2 } from '@borrowed/model/circuit-builder.types'
import EventHandlerHelper from '@borrowed/utilities/EventHandlerHelper'
import React, { Component } from 'react'

interface DraggableProps {
  className?: string

  enabled: boolean
  confine?: 'parent' | 'fullscreen' | string
  startPosition?: Vector2
  resetAfterStop?: boolean

  delta?: Vector2

  onDragStart?: (translation: Vector2) => void
  onDragCallback?: (translation: Vector2) => void
  onDragEnd?: (translation: Vector2) => void

  children: React.ReactNode
}

interface DraggableState {
  translation: Vector2 //distance from origin
  origin: Vector2 //satrting pos in screen space
  offset: Vector2 //mouse offset

  isDragged: boolean
  draggableRef: React.RefObject<HTMLDivElement>

  deltaMoveOccured: boolean
}

class Draggable extends Component<DraggableProps, DraggableState> {
  constructor(props: DraggableProps) {
    super(props)

    const translation: Vector2 =
      this.props.startPosition === undefined
        ? { x: 0, y: 0 }
        : this.props.startPosition

    this.state = {
      origin: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      translation: translation,
      isDragged: false,
      draggableRef: React.createRef(),
      deltaMoveOccured: false
    }
  }

  //#region add/ remove EventListener
  componentDidMount() {
    if (this.state.draggableRef.current) {
      this.state.draggableRef.current.addEventListener(
        'touchstart',
        this.dragStart.bind(this),
        { passive: false }
      )
      document.addEventListener('touchmove', this.drag.bind(this), {
        passive: false
      })
      this.state.draggableRef.current.addEventListener(
        'touchend',
        this.dragEnd.bind(this),
        { passive: false }
      )

      this.state.draggableRef.current.addEventListener(
        'mousedown',
        this.dragStart.bind(this),
        { passive: false }
      )
      document.addEventListener('mousemove', this.drag.bind(this), {
        passive: false
      })
      this.state.draggableRef.current.addEventListener(
        'mouseup',
        this.dragEnd.bind(this),
        { passive: false }
      )

      const dragggableRect: DOMRect =
        this.state.draggableRef.current.getBoundingClientRect()
      this.setState({ origin: { x: dragggableRect.x, y: dragggableRect.y } })
    } else console.error('draggable ref is undefined')
  }

  componentWillUnmount() {
    if (this.state.draggableRef.current) {
      this.state.draggableRef.current.removeEventListener(
        'touchstart',
        this.dragStart.bind(this)
      )
      document.removeEventListener('touchmove', this.drag.bind(this))
      this.state.draggableRef.current.removeEventListener(
        'touchend',
        this.dragEnd.bind(this)
      )

      this.state.draggableRef.current.removeEventListener(
        'mousedown',
        this.dragStart.bind(this)
      )
      document.removeEventListener('mousemove', this.drag.bind(this))
      this.state.draggableRef.current.removeEventListener(
        'mouseup',
        this.dragEnd.bind(this)
      )
    } else console.error('draggable ref is undefined')
  }
  //#endregion

  //#region draggable events
  dragStart(e: any) {
    if (!this.props.enabled) return

    e.preventDefault()

    const clientPos = EventHandlerHelper.GetEventClientPos(e, 'touchstart')
    this.setState({
      offset: {
        x: clientPos.x - this.state.translation.x,
        y: clientPos.y - this.state.translation.y
      },
      isDragged: true
    })

    if (this.props.onDragStart) this.props.onDragStart(this.state.translation)
  }

  drag(e: any) {
    if (!this.state.isDragged) return

    e.preventDefault()

    const clientPos = EventHandlerHelper.GetEventClientPos(e, 'touchmove')
    const translation = this.checkBounds({
      x: clientPos.x - this.state.offset.x,
      y: clientPos.y - this.state.offset.y
    })

    if (this.props.onDragCallback) this.props.onDragCallback(translation)

    this.setState({ translation: translation })
  }

  dragEnd(e: any) {
    if (!this.state.isDragged) return

    if (this.props.onDragEnd) this.props.onDragEnd(this.state.translation)

    if (this.props.resetAfterStop)
      this.setState({ translation: { x: 0, y: 0 }, isDragged: false })
    else this.setState({ isDragged: false })
  }
  //#endregion

  checkBounds(translation: Vector2): Vector2 {
    if (!this.state.draggableRef.current) {
      console.error('Draggable ref is undefined')
      return translation
    }

    if (this.props.confine === undefined) return translation

    const dragggableRect: DOMRect =
      this.state.draggableRef.current.getBoundingClientRect()

    if (this.props.confine === 'fullscreen') {
      if (translation.x > 0)
        //left
        translation.x = 0

      if (translation.y > 0)
        //top
        translation.y = 0

      if (translation.x < -dragggableRect.width + document.body.clientWidth)
        //right
        translation.x = -dragggableRect.width + document.body.clientWidth

      if (translation.y < -dragggableRect.height + document.body.clientHeight)
        //bottom
        translation.y = -dragggableRect.height + document.body.clientHeight

      return translation
    }

    let confineRect: DOMRect

    if (this.props.confine === 'parent') {
      const element = this.state.draggableRef.current.parentElement
      if (element) confineRect = element.getBoundingClientRect()
      else {
        console.error('No parent found.')
        return translation
      }
    } else {
      const element = document.getElementById(this.props.confine)
      if (element) confineRect = element.getBoundingClientRect()
      else {
        console.error(`No confine element with id ${this.props.confine} found.`)
        return translation
      }
    }

    //check bounds
    if (translation.y < confineRect.top) translation.y = confineRect.top

    if (translation.y > confineRect.height + dragggableRect.height)
      translation.y = confineRect.height + dragggableRect.height

    if (translation.x < confineRect.left) translation.x = confineRect.left

    if (translation.x > confineRect.width - dragggableRect.width)
      translation.x = confineRect.width - dragggableRect.width

    return translation
  }

  translate(delta: Vector2) {
    this.setState({
      translation: this.checkBounds({
        x: this.state.translation.x + delta.x,
        y: this.state.translation.y + delta.y
      })
    })
  }

  render() {
    const style = {
      transform: `translate(${this.state.translation.x}px, ${this.state.translation.y}px)`,
      display: 'inline-block'
    }
    const className =
      this.props.className === undefined ? '' : this.props.className

    return (
      <div
        ref={this.state.draggableRef}
        style={style}
        className={className}
        draggable={this.props.enabled}
      >
        {this.props.children}
      </div>
    )
  }

  componentDidUpdate() {
    if (this.props.delta) {
      this.translate(this.props.delta)
      this.setState({ deltaMoveOccured: !this.state.deltaMoveOccured })
    }
  }

  shouldComponentUpdate(nextProps: DraggableProps, nextState: DraggableState) {
    return nextState.deltaMoveOccured === this.state.deltaMoveOccured
  }
}

export default Draggable
