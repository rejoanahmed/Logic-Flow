import ChipManager from '../manager/chip-manager';
import Graph from '../utilities/graph/graph';
import { ChipBlueprint, Gate, Vector2 } from './circuit-builder.types';

class ChipInstance {
    public blueprint: ChipBlueprint;
    public id: string;
    public graph: Graph<Gate>;

    public position: Vector2;
    public size: Vector2;

    constructor(blueprint: ChipBlueprint, startPosition: Vector2) {
        this.blueprint = blueprint;
        this.position = startPosition;
        this.size = { x: 0, y: 0 };
        this.id = `${blueprint.name}_${ChipManager.getChipId(blueprint.name)}`;

        let graph = new Graph<Gate>();

        blueprint.graph.nodes.forEach(gate => {
            let gateCopy = { ...gate };
            gateCopy.id = `${this.id}_${gate.id}`

            graph.addNode(gateCopy);
        });

        blueprint.graph.edges.forEach(edge => {
            graph.addEdge({ from: `${this.id}_${edge.from}`, to: `${this.id}_${edge.to}` });
        });

        this.graph = graph;
    }
}

export default ChipInstance;