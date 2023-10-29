import Graph from '../utilities/graph/graph';
import { GateType } from '../simulation/simulator.types';

export enum Tool {
    Pan = "Pan",
    Move = "Move",
    Delete = "Delete",
    Rename = "Rename",
    Select = "Seclect",
    Wire = "Wire"
}

export enum SignalDirection {
    In = "In",
    Out = "Out"
}

export enum GateRole {
    Switch = "Switch",
    Output = "Output",
    Clock = "Clock"
}

export enum ChipRole {
    Switch = "Switch",
    Output = "Output",
    BinaryInput = "BinaryInput",
    BinaryDisplay = "BinaryDisplay"
}

export enum ChipCategory {
    Io = "Io",
    Logic = "Logic",
    Arithmetic = "Arithmetic",
    Memory = "Memory",
    Other = "Other"
}

export enum BlueprintType {
    Builtin = "Builtin",
    Custom = "Custom"
}

export enum PinSide {
    Top = "Top",
    Left = "Left",
    Bottom = "Bottom",
    Right = "Right"
}

export interface WireModel {
    fromId: string;
    toId: string;
    state: boolean;
}

export interface Gate {
    id: string;
    name?: string;
    state: boolean;
    type: GateType;
    signalDirection?: SignalDirection;
    pinSide?: PinSide;
    role?: GateRole;
    firstLayer: boolean;
    error: boolean;
    hidden?: boolean;
    data?: string
}

export interface ChipBlueprint {
    name: string;
    color: string;
    graph: Graph<Gate>;
    category: ChipCategory;
    description?: string;
    type: BlueprintType;
    role?: ChipRole;
    growableData?: GrowableData
}

export interface GrowableData {
    gate: Gate;
    startIndex: number;
}


export interface CircuitBuilderContext {
    isSimulationRunning: boolean;
    activeTool: Tool;
    boardTranslation: Vector2;
}

export interface BlueprintSaveData {
    version: number;
    blueprints: ChipBlueprint[];
}

export interface Vector2 {
    x: number;
    y: number;
}