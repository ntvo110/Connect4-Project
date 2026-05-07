import { useState } from 'react';
import './App.css';
import { ControlSlider, BoardDisplay } from './components';

type BoardState = (string | null) [][];

function App() {
  const [size, setSize] = useState(7);
  const [genSize, setGenSize] = useState(7);
  const [depth, setDepth] = useState(2);
  const [numMoves, setNumMoves] = useState(0);
  const [simResponse, setSimResponse] = useState("");
  const [randomResponse, setRandomResponse] = useState("");
  const [genResponse, setGenResponse] = useState("");
  const [mode, setMode] = useState("Original");
  const [simLoading, setSimLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [board, setBoard] = useState<BoardState>(
    Array.from({length: 7}, () => Array(7).fill(null))
  )
  

  const handleSizeChange = (v: any) => {
    setSize(v);
  }

    const handleGenSizeChange = (v: any) => {
    setGenSize(v);
    const newBoard: BoardState = Array.from({length: v}, () => Array(v).fill(null));
    setBoard(newBoard)
  }

  const handleSimClick = async () => {
    const inputs = {mode: mode, size: size, depth: depth};
    setSimLoading(true);
    try {
      const res = await fetch('/run-sim', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      setSimLoading(false);
      setSimResponse(data.message);
    } catch (error){
      console.error("Error calling Simulation function:", error);
    }
  }


  const handleGenBoard = async () => {
    const inputs = {size: genSize, numMoves: numMoves}
    setGenLoading(true);
    try {
      const res = await fetch('/gen-board', {
        method:'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(inputs),
      })

      const data = await res.json();
      setGenLoading(false);
      setGenResponse(data.message);

      const newBoard: BoardState = Array.from({length: genSize}, () => Array(genSize).fill(null));
        Object.entries(data.board).forEach(([key, value]) => {
        const [x, y] = key.split(',').map(Number);
        newBoard[x - 1][y - 1] = value as string;
    });
      setBoard(newBoard)
      console.log(newBoard)
    } catch (error){
      console.error("Error calling Random function:", error);
    }
  }

  const handleRandomClick = async () => {

    setRandomLoading(true);
    try {
      const res = await fetch('/run-random', {
        method:'GET',
        headers: {'Content-Type' : 'application/json'}
      })

      const data = await res.json();
      setRandomLoading(false);
      setRandomResponse(data.message);
    } catch (error){
      console.error("Error calling Random function:", error);
    }
  }
  return (
    <>
      <section id="center">
        <div className="hero">
        </div>
        <div>
          <h1>AI Powered Connect 4 System</h1>
        </div>
        <div style={{display: "flex", gap: 12, marginBottom: "1.5rem"}}>
          {/* Sliders for Size and Depth */}
          <ControlSlider label="Board size (nxn)" min={7} max={10} value={size} onChange={handleSizeChange}/>
          <ControlSlider label="AI depth" min={1} max={4} value={depth} onChange={setDepth}/>

          {/* Original AI or Improved AI choice */}
          <div
            style= {{
              background: "var(--accent-bg)",
              borderRadius:"var(--border-radius-md)",
              padding:"12px 14px",
              flex: 1,
            }}
          >
            <div style={{fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6}}>
              AI mode
            </div>
            <div style={{ display: "flex", gap: 6}}>
              {[ "Original", "Improved"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className='modeButton'
                  style={{
                    border: '0.5px solid ${mode === m ? "var(--color-border-info)" : "var(--color-border-secondary)"}',
                    borderRadius: "var(--border-radius-md)",
                    background: mode === m ? "var(--color-background-info)" : "transparent",
                    color: mode === m ? "var(--color-text-info)" : "var(--color-text-secondary)",
                    fontWeight: mode === m ? 500 : 400,
                    borderColor: "#c084fc",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

          </div>
        </div>
        {/* Indicator for which AI is chosen */}
        <h2>AI Selected: {mode}</h2>

        {/* Handles simulation of games */}
        <button 
          type="button"
          className='simButton'
          onClick={handleSimClick}
        >
          Run Simulation
        </button>
        <div>
          {simLoading ? <div className='spinner'></div> : <p></p>}
        </div>
        <p>Results: {simResponse}</p>

        {/* Random Move Part  */}
        <h1>Random Move</h1>

        {/* Board Display */}
        <BoardDisplay board={board} />
        
        <ControlSlider label="Board size (nxn)" min={7} max={10} value={genSize} onChange={handleGenSizeChange}/>
        <ControlSlider label="Number of Moves" min={0} max={20} value={numMoves} onChange={setNumMoves}/>
        <div>
          {genLoading ? <div className='spinner'></div> : <p></p>}
        </div>
        {/* Button to generate random board state */}
        <button 
          type="button"
          className='simButton'
          onClick={handleGenBoard}
        >
          Generate Random Board State
        </button>

          <button 
          type="button"
          className='simButton'
          onClick={handleRandomClick}
        >
          Run Best Move
        </button>
        <div>
          {randomLoading ? <div className='spinner'></div> : <p></p>}
        </div>
        <p>Results: {randomResponse}</p>
        <footer></footer>
          
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
