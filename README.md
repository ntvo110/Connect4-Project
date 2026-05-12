# Connect4 AI Agent Project

This project uses an alpha-beta cutoff search with a custom heuristic evaluation function. The heuristic scans the board and looks at every possible group of four spaces horizontally, vertically and diagonally, each of these groups is scored based on whether it contains useful patterns for the AI or dangerous patterns for the opponent. This algorithm plays an older algorithm in simulated games and outputs who wins. Additionally, it has a random board state generator with an explainable AI feature where after the AI chooses a move, the system can produce a simple explanation.

# Tech Stack

### Frontend:
- React
- TypeScript
- Vite

### Backend:
- Python 

# Project Structure
```
my-app/
|-- api\venv/
|---- api.py          # connects frontend to backend with routing and REST
|---- games.py        # textbook code for Connect 4
|---- test.py         # heuristic function code and random board generator
|---- util.py         # textbook code for Connect 4    
|-- src/    
|---- App.tsx         # Frontend code
|---- components.tsx  # components of the frontend used by App.tsx

```

# Contributors
- Raul Pez
- Rith Sreng
- Nathan Vo

# References
Textbook code: https://github.com/aimacode/aima-python/blob/master/games.py
