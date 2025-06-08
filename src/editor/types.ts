export type NodeType = 'Projectile' | 'AddSpeed' | 'AddAngle';

export interface SpellNode {
  id: string;
  type: NodeType;
  params: Record<string, number>;
}

export interface Spell {
  nodes: SpellNode[];
}
