import Edge from './edge';
import { GraphNodeType } from './graph.types';

class Graph<T> {
    nodes: GraphNodeType<T>[];
    edges: Edge[];

    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    public addNode(newNode: GraphNodeType<T>) {
        if (this.nodes.find(node => node.id === newNode.id)) {
            console.warn(`Node ${newNode.id} already exsists.`);
            return;
        }

        this.nodes.push(newNode);
    }

    public addNodes(newNodes: GraphNodeType<T>[]) {
        newNodes.forEach(node => this.addNode(node));
    }

    public addEdge(newEdge: Edge) {
        if (this.edges.find(edge => edge.from === newEdge.from && edge.to === newEdge.to)) {
            console.warn(`Edge ${newEdge.from} -> ${newEdge.to} already exsists.`);
            return;
        }

        if (!this.nodes.find(node => node.id === newEdge.from)) {
            console.warn(`Node ${newEdge.from} doesn't exsist.`);
            return;
        }

        if (!this.nodes.find(node => node.id === newEdge.to)) {
            console.warn(`Node ${newEdge.from} doesn't exsist.`);
            return;
        }

        this.edges.push(newEdge);
    }

    public addEdges(newEdges: Edge[]) {
        newEdges.forEach(edge => this.addEdge(edge));
    }

    public getEdgesPointingTo(id: string): string[] {
        return this.edges.filter(edge => edge.to === id).map(edge => edge.from);
    }

    public getNodeById(id: string): GraphNodeType<T> {
        return this.nodes.filter(node => node.id === id)[0];
    }
}
export default Graph;