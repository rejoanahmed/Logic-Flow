import Graph from '../utilities/graph/graph';
import { BlueprintType, ChipBlueprint, ChipCategory, ChipRole, Gate, GateRole, GrowableData, PinSide, SignalDirection } from '../model/circuit-builder.types';
import { GateType } from '../simulation/simulator.types';

class ChipManager {
    private static instance: ChipManager;
    private blueprints: ChipBlueprint[];
    private chipIds: Map<string, number>;

    private constructor() {
        ChipManager.instance = this;
        this.blueprints = [];
        this.chipIds = new Map();

        //IO
        this.addInputBlueprint();
        this.addOutputBlueprint();
        this.addClockBlueprint();
        this.addConstantOnBlueprint();
        this.addConstantOffBlueprint();

        //Logic
        this.AddNOTBlueprint();

        this.addANDBlueprint();
        this.addORBlueprint();
        this.addXORBlueprint();

        this.addNANDBlueprint();
        this.addNORBlueprint();
        this.addXNORBlueprint();

        //Arethmetic
        this.addBinaryInputBlueprint();
        this.addBinaryDisplayBlueprint();;
    }

    public static getInstance() {
        if (!ChipManager.instance)
            new ChipManager();

        return ChipManager.instance;
    }


    public static getBlueprints(): ChipBlueprint[] {
        return ChipManager.getInstance().blueprints;
    }

    public static getChipId(name: string): number {
        let instance = ChipManager.getInstance();
        if (!instance.chipIds.has(name)) {
            instance.chipIds.set(name, 0);
            return 0;
        }

        let id = instance.chipIds.get(name)!;

        id++;
        instance.chipIds.set(name, id);
        return id;
    }

    //#region Blueprints
    //0 Inputs
    private addInputBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([{ id: "switch", type: GateType.Controlled, state: false, error: false, signalDirection: SignalDirection.Out, role: GateRole.Switch, name: 'In', firstLayer: true, pinSide: PinSide.Right }]);

        this.blueprints.push({ name: "Switch", color: "#fd7e14", category: ChipCategory.Io, graph: graph, type: BlueprintType.Builtin, role: ChipRole.Switch, description: "Click this switch to toggle it's state. Gets converted to Chip Input after Packaging" });
    }

    private addOutputBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([{ id: "out", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, role: GateRole.Output, name: 'Out', firstLayer: true, pinSide: PinSide.Left }]);

        this.blueprints.push({ name: "Output", color: "#fd7e14", category: ChipCategory.Io, graph: graph, type: BlueprintType.Builtin, role: ChipRole.Output, description: "Gets converted to Chip Output after Packaging" });
    }

    private addClockBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([{ id: "clock", type: GateType.Controlled, state: false, error: false, signalDirection: SignalDirection.Out, role: GateRole.Clock, name: 'Clock', firstLayer: true, pinSide: PinSide.Right }]);

        this.blueprints.push({ name: "Clock", color: "#20c997", category: ChipCategory.Io, graph: graph, type: BlueprintType.Builtin, description: "Gets converted to Chip Input after Packaging." });
    }

    private addConstantOnBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "out", type: GateType.Controlled, state: true, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }]);

        this.blueprints.push({ name: "Constant On", color: "#28a745", category: ChipCategory.Io, type: BlueprintType.Builtin, graph: graph });
    }

    private addConstantOffBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "out", type: GateType.Controlled, state: false, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }]);

        this.blueprints.push({ name: "Constant Off", color: "#F42B03", category: ChipCategory.Io, type: BlueprintType.Builtin, graph: graph });
    }

    private addBinaryInputBlueprint() {
        let graph = new Graph<Gate>();

        for (let i = 0; i < 2; i++)
            graph.addNode({ id: `out${i}`, type: GateType.Controlled, state: false, error: false, signalDirection: SignalDirection.Out, role: GateRole.Switch, name: `In (${Math.pow(2, i)})`, data: `${Math.pow(2, i)}`, firstLayer: true, pinSide: PinSide.Right });

        const growableData: GrowableData = { gate: { id: 'out[pow:2,i]', type: GateType.Controlled, state: false, error: false, signalDirection: SignalDirection.Out, role: GateRole.Switch, name: 'In ([pow:2,i])', data: '[pow:2,i]', firstLayer: true, pinSide: PinSide.Right }, startIndex: 2 }

        this.blueprints.push({ name: `Binary Input`, color: "#7B3E19", category: ChipCategory.Arithmetic, role: ChipRole.BinaryInput, type: BlueprintType.Builtin, graph: graph, growableData: growableData });
    }

    private addBinaryDisplayBlueprint() {
        let graph = new Graph<Gate>();

        for (let i = 0; i < 2; i++)
            graph.addNode({ id: `in${i}`, type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, role: GateRole.Output, name: `Out (${Math.pow(2, i)})`, data: `${Math.pow(2, i)}`, firstLayer: true, pinSide: PinSide.Left });

        const growableData: GrowableData = { gate: { id: 'in[pow:2,i]', type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, role: GateRole.Output, name: 'Out ([pow:2,i])', data: '[pow:2,i]', firstLayer: true, pinSide: PinSide.Left }, startIndex: 2 }

        this.blueprints.push({ name: `Binary Display`, color: "#7B3E19", category: ChipCategory.Arithmetic, role: ChipRole.BinaryDisplay, type: BlueprintType.Builtin, graph: graph, growableData: growableData });
    }

    // 1 Input
    private AddNOTBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "in", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In', firstLayer: true, pinSide: PinSide.Left },
            { id: "not", type: GateType.NOT, state: false, error: false, firstLayer: false },
            { id: "out", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }]);

        graph.addEdges([{ from: "in", to: "not" }, { from: "not", to: "out" }])

        this.blueprints.push({ name: "NOT", color: "#FF7C70", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graph });
    }

    //2 Inputs
    private addANDBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "in1", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 1', firstLayer: true, pinSide: PinSide.Left },
            { id: "in2", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 2', firstLayer: true, pinSide: PinSide.Left },
            { id: "and", type: GateType.AND, state: false, error: false, firstLayer: false },
            { id: "out", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }])

        graph.addEdges([{ from: "in1", to: "and" }, { from: "in2", to: "and" }, { from: "and", to: "out" }]);

        this.blueprints.push({ name: "AND", color: "#006406", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graph });
    }

    private addORBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "in1", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 1', firstLayer: true, pinSide: PinSide.Left },
            { id: "in2", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 2', firstLayer: true, pinSide: PinSide.Left },
            { id: "or", type: GateType.OR, state: false, error: false, firstLayer: false },
            { id: "out", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }])

        graph.addEdges([{ from: "in1", to: "or" }, { from: "in2", to: "or" }, { from: "or", to: "out" }]);

        this.blueprints.push({ name: "OR", color: "#9055A2", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graph });//
    }

    private addXORBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "in1", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 1', firstLayer: true, pinSide: PinSide.Left },
            { id: "in2", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 2', firstLayer: true, pinSide: PinSide.Left },
            { id: "xor", type: GateType.XOR, state: false, error: false, firstLayer: false },
            { id: "out", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }])

        graph.addEdges([{ from: "in1", to: "xor" }, { from: "in2", to: "xor" }, { from: "xor", to: "out" }]);

        this.blueprints.push({ name: "XOR", color: "#007bff", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graph });
    }

    private addNANDBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "in1", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 1', firstLayer: true, pinSide: PinSide.Left },
            { id: "in2", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 2', firstLayer: true, pinSide: PinSide.Left },
            { id: "nand", type: GateType.NAND, state: false, error: false, firstLayer: false },
            { id: "out", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }])

        graph.addEdges([{ from: "in1", to: "nand" }, { from: "in2", to: "nand" }, { from: "nand", to: "out" }]);

        this.blueprints.push({ name: "NAND", color: "#B6174B", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graph });
    }

    private addNORBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "in1", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 1', firstLayer: true, pinSide: PinSide.Left },
            { id: "in2", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 2', firstLayer: true, pinSide: PinSide.Left },
            { id: "nor", type: GateType.NOR, state: false, error: false, firstLayer: false },
            { id: "out", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }])

        graph.addEdges([{ from: "in1", to: "nor" }, { from: "in2", to: "nor" }, { from: "nor", to: "out" }]);

        this.blueprints.push({ name: "NOR", color: "#1C5253", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graph });
    }

    private addXNORBlueprint() {
        let graph = new Graph<Gate>();
        graph.addNodes([
            { id: "in1", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 1', firstLayer: true, pinSide: PinSide.Left },
            { id: "in2", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.In, name: 'In 2', firstLayer: true, pinSide: PinSide.Left },
            { id: "xnor", type: GateType.XNOR, state: false, error: false, firstLayer: false },
            { id: "out", type: GateType.Relay, state: false, error: false, signalDirection: SignalDirection.Out, name: 'Out', firstLayer: true, pinSide: PinSide.Right }])

        graph.addEdges([{ from: "in1", to: "xnor" }, { from: "in2", to: "xnor" }, { from: "xnor", to: "out" }]);

        this.blueprints.push({ name: "XNOR", color: "#FFC53A", category: ChipCategory.Logic, type: BlueprintType.Builtin, graph: graph });
    }
    //#endregion
}

export default ChipManager;