import { useState } from 'react';
import { EventBus } from '../game/EventBus';
import { SpellNode, NodeType } from './types';

const LIBRARY: { type: NodeType; label: string; params: Record<string, number> }[] = [
  { type: 'Projectile', label: 'Projectile', params: { speed: 200 } },
  { type: 'AddSpeed', label: 'Add Speed', params: { value: 50 } },
  { type: 'AddAngle', label: 'Add Angle', params: { value: 10 } }
];

export default function SpellEditor() {
  const [nodes, setNodes] = useState<SpellNode[]>([
    { id: 'n1', type: 'Projectile', params: { speed: 200 } }
  ]);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState({ speed: 0, angle: 0 });

  const addNode = (t: { type: NodeType; params: Record<string, number> }) => {
    const id = Math.random().toString(36).slice(2, 9);
    setNodes([...nodes, { id, type: t.type, params: { ...t.params } }]);
  };

  const removeNode = (index: number) => {
    const list = [...nodes];
    list.splice(index, 1);
    setNodes(list);
  };

  const moveNode = (index: number, offset: number) => {
    const list = [...nodes];
    const newIndex = index + offset;
    if (newIndex < 0 || newIndex >= list.length) return;
    const [item] = list.splice(index, 1);
    list.splice(newIndex, 0, item);
    setNodes(list);
  };

  const updateParam = (id: string, key: string, value: number) => {
    setNodes(nodes.map(n => (n.id === id ? { ...n, params: { ...n.params, [key]: value } } : n)));
  };

  const runSpell = () => {
    let speed = input.speed;
    let angle = input.angle;
    nodes.forEach(n => {
      if (n.type === 'Projectile') {
        speed = n.params.speed;
      } else if (n.type === 'AddSpeed') {
        speed += n.params.value;
      } else if (n.type === 'AddAngle') {
        angle += n.params.value;
      }
    });
    EventBus.emit('spell-run', { speed, angle });
  };

  return (
    <div className="spell-editor">
      <div className="library">
        {LIBRARY.map(t => (
          <button key={t.type} className="button" onClick={() => addNode(t)}>
            Add {t.label}
          </button>
        ))}
      </div>
      <div className="nodes">
        {nodes.map((node, idx) => (
          <div key={node.id} className="node" onClick={() => setSelected(node.id)}>
            <div className="node-header">{node.type}</div>
            {selected === node.id && (
              <div className="node-body">
                {Object.keys(node.params).map(key => (
                  <label key={key}>
                    {key}:
                    <input
                      type="number"
                      value={node.params[key]}
                      onChange={e => updateParam(node.id, key, Number(e.target.value))}
                    />
                  </label>
                ))}
                <div className="node-actions">
                  <button className="button" onClick={() => moveNode(idx, -1)}>
                    Up
                  </button>
                  <button className="button" onClick={() => moveNode(idx, 1)}>
                    Down
                  </button>
                  <button className="button" onClick={() => removeNode(idx)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="inputs">
        <label>
          Initial Speed:
          <input
            type="number"
            value={input.speed}
            onChange={e => setInput({ ...input, speed: Number(e.target.value) })}
          />
        </label>
        <label>
          Initial Angle:
          <input
            type="number"
            value={input.angle}
            onChange={e => setInput({ ...input, angle: Number(e.target.value) })}
          />
        </label>
      </div>
      <button className="button" onClick={runSpell}>
        Run Spell
      </button>
    </div>
  );
}
