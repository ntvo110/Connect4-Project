import { useState } from 'react';
import './App.css';
import { ControlSlider, BoardDisplay } from './components';

type BoardState = (string | null) [][];

function App() {
  const [size, setSize] = useState(7);
  const [depth, setDepth] = useState(2);
  const [simResponse, setSimResponse] = useState("");
  const [randomResponse, setRandomResponse] = useState("");
  const [mode, setMode] = useState("Original");
  const [simLoading, setSimLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [board, setBoard] = useState<BoardState>(
    Array.from({ length: 6 }, () => Array(7).fill(null))
  )

  const handleSizeChange = (v: any) => {
    setSize(v);
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
          <ControlSlider label="Board size (nxn)" min={7} max={10} value={size} onChange={handleSizeChange}/>
          <ControlSlider label="AI depth" min={1} max={4} value={depth} onChange={setDepth}/>
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
        <h2>AI Selected: {mode}</h2>
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
        <BoardDisplay board={board} />

          <button 
          type="button"
          className='simButton'
          onClick={handleRandomClick}
        >
          Run Random Simulation
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
