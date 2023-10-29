
export enum GateType {
    Controlled = "Controlled",
    Relay = "Relay",
    AND = "AND",
    NOT = "NOT",
    NAND = "NAND",
    OR = "OR",
    NOR = "NOR",
    XOR = "XOR",
    XNOR = "XNOR"
}

export interface Gate {
    id: string;
    type: GateType;
    state: boolean;
    inputs: string[];
}

export interface SimulationResult {
    states: SimulationState[];
    time: number;
    gates: Gate[];
}

export interface SimulationState {
    id: string;
    state: boolean;
}