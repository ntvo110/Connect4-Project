from test import *
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/run-sim', methods=['POST'])
def handle_sim_request():
    data = request.json
    mode = data.get('mode')
    size = data.get('size')
    depth = data.get('depth')

    output = run_games(mode, improved_player, size, depth)

    return jsonify({"message": output})


@app.route('/gen-board', methods=['POST'])
def handle_gen_request():
    data = request.json
    size = data.get('size')
    numMoves = data.get('numMoves')
    if numMoves == 0:
        numMoves = None
    print(numMoves)
    global current_state, current_game
    current_state, current_game = random_connect_four_state(h = size, v = size, k = 4, num_moves=numMoves)
    serial_board = {f"{x}, {y}": v for (x, y), v in current_state.board.items()}
    return jsonify({
        "message": "Random board generated",
        "board": serial_board
        })

@app.route('/run-random', methods=['GET'])
def handle_random_request():
    global current_state, current_game
    if current_state is None:
        return jsonify({"message": "No board generated yet"}), 400

    output = ai_demo(current_state, current_game)
    return jsonify({"message": output})

