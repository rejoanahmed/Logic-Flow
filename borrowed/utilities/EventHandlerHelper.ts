import { Vector2 } from '../model/circuit-builder.types';

class EventHandlerHelper {
    public static GetEventClientPos(e: any, touchEventType: "touchstart" | "touchmove" | "touchend"): Vector2 {
        if (e.type === touchEventType)
            return { x: e.touches[0].clientX, y: e.touches[0].clientY }
        else
            return { x: e.clientX, y: e.clientY };
    }
}

export default EventHandlerHelper;