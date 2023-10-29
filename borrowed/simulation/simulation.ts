import { Gate, GateType, SimulationResult } from './simulator.types';

class Simulation {
    private gates: Gate[] = [];
    private result: SimulationResult;
    private valueForUncennectedInputs = false;

    evalsPerTick: number = 100;

    constructor(gates: Gate[]) {
        this.gates = gates;
        this.result = { states: [], time: 0, gates: this.gates };
    }

    public simulate(): SimulationResult {
        const timerStart = performance.now();

        for (let i = 0; i < this.evalsPerTick; i++)
            this.evaluate();

        this.result.states = this.gates.map(gate => { return { id: gate.id, state: gate.state } });
        this.result.time = performance.now() - timerStart;

        return this.result;
    }

    private getGateById(id: string): Gate {
        return this.gates.filter(gate => gate.id === id)[0];
    }

    private evaluate() {
        this.gates.forEach((gate: Gate) => {
            //0 Inputs
            if (gate.type === GateType.Controlled)
                return;

            //1 Inputs
            const inputA = this.getGateById(gate.inputs[0]);
            let stateA = this.valueForUncennectedInputs;

            if (inputA !== undefined)
                stateA = inputA.state;

            if (gate.type === GateType.Relay) {
                gate.state = stateA;
                return;
            }
            if (gate.type === GateType.NOT) {
                gate.state = !stateA;
                return;
            }

            //2 Inputs
            const inputB = this.getGateById(gate.inputs[1]);
            let stateB = this.valueForUncennectedInputs;

            if (inputB !== undefined)
                stateB = inputB.state;

            if (gate.type === GateType.AND) {
                gate.state = stateA && stateB;
                return;
            }
            if (gate.type === GateType.NAND) {
                gate.state = !(stateA && stateB);
                return;
            }
            if (gate.type === GateType.OR) {
                gate.state = stateA || stateB;
                return;
            }
            if (gate.type === GateType.NOR) {
                gate.state = !(stateA || stateB);
                return;
            }
            if (gate.type === GateType.XOR) {
                gate.state = stateA !== stateB;
                return;
            }
            if (gate.type === GateType.XNOR) {
                gate.state = !(stateA !== stateB);
                return;
            }
        });
    }
}

export default Simulation;