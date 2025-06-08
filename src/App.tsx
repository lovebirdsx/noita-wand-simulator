import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import SpellEditor from './editor/SpellEditor';

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <SpellEditor />
        </div>
    );
}

export default App;
