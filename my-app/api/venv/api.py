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

@app.route('/run-random', methods=['GET'])
def handle_random_request():
    output = ai_demo()
    return jsonify({"message": output})


