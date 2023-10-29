import ChipInstance from '../model/chip-instance';
import Graph from './graph/graph';
import { Gate, GateRole, PinSide, WireModel } from '../model/circuit-builder.types';
import { Gate as SimulationGate, GateType } from '../simulation/simulator.types';

class GateHelper {
    public static getGatesForPinSide(graph: Graph<Gate>, side: PinSide): Gate[] {
        return graph.nodes.filter(gate => gate.pinSide === side && !(gate.hidden === true) && (graph.edges.filter(wire => gate.id === wire.to).length === 0 || graph.edges.filter(wire => gate.id === wire.from).length === 0)); // later part for only getting exposed pins
    }

    //combines graph to simulation gate[]
    public static buildGates(chips: ChipInstance[], wires: WireModel[]): SimulationGate[] {
        let gates: SimulationGate[] = []
        let wiresCopy = [...wires];

        //get wires and gates
        chips.forEach(chip => {
            chip.graph.nodes.forEach(gate => {
                gates.push({ id: gate.id, state: gate.state, type: gate.type, inputs: [] });
            });
            chip.graph.edges.forEach(wire => {
                wiresCopy.push({ fromId: wire.from, toId: wire.to, state: false });
            });
        });

        gates.forEach(gate => {
            gate.inputs = wiresCopy.filter(wire => gate.id === wire.toId).map(wire => wire.fromId);
        });

        return gates;
    }

    public static getGateById(chips: ChipInstance[], id: string): Gate | undefined {
        let result = undefined;

        chips.forEach(chip => {
            let gate = chip.graph.nodes.find(gate => gate.id === id);

            if (gate)
                result = gate;
        });

        return result;
    }

    public static getGatesByType(chips: ChipInstance[], type: GateType): Gate[] {
        let result: Gate[] = [];

        chips.forEach(chip => {
            result.push(...chip.graph.nodes.filter(gate => gate.type === type));
        });

        return result;
    }

    public static getGatesByRole(chips: ChipInstance[], role: GateRole, inFirstLayer: boolean): Gate[] {
        let result: Gate[] = [];

        chips.forEach(chip => {
            result.push(...chip.graph.nodes.filter(gate => gate.role === role && gate.firstLayer === true));
        });

        return result;
    }

    public static checkValidity(chips: ChipInstance[], wires: WireModel[]): Gate[] {
        let allGates: Gate[] = [];
        let allWires: WireModel[] = [...wires];
        let missingInputs: Gate[] = [];

        chips.forEach(chip => {
            allGates.push(...chip.graph.nodes);
            chip.graph.edges.forEach(edge => {
                allWires.push({ fromId: edge.from, toId: edge.to, state: false });
            });
        });

        allGates.forEach(gate => {
            if (gate.type !== GateType.Controlled && allWires.filter(wire => wire.toId === gate.id).length === 0)
                missingInputs.push(gate);
        });

        return missingInputs;
    }

}

export default GateHelper;