export type GraphNodeType = 'person' | 'organization' | 'location' | 'event' | 'weapon' | 'facility';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  risk: number;
  connections: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  strength: number;
}

export interface EntityGraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
