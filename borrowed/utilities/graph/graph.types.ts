export interface GraphNode {
    id: string;
}

export type GraphNodeType<T> = T & GraphNode;