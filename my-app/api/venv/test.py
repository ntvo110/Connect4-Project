from games import *
import time
import contextlib
import io


# Custom heuristic evaluation function
# This is our main improvement over the original textbook code.
# Instead of only searching ahead, this function scores how good
# a board position looks for the AI.
# It works on larger boards like 7x7, 8x8, and 10x10.

def score_position(state, game, player):
    opponent = 'O' if player == 'X' else 'X'
    board = state.board
    score = 0

    # Give extra points for pieces near the center center columns are usually strongest.
    center = game.v // 2

    for (x, y), piece in board.items():
        if piece == player:
            score += max(0, 3 - abs(y - center))

    # Directions to check:
    # horizontal, vertical, diagonal down-right, diagonal up-right
    directions = [(0, 1), (1, 0), (1, 1), (1, -1)]

    # Scan every possible group of 4 spaces on the board.
    for x in range(1, game.h + 1):
        for y in range(1, game.v + 1):
            for dx, dy in directions:
                window = []

                for i in range(game.k):
                    pos = (x + dx * i, y + dy * i)

                    # Only include positions that are actually on the board
                    if 1 <= pos[0] <= game.h and 1 <= pos[1] <= game.v:
                        window.append(board.get(pos, '.'))

                # Score complete windows of length 4
                if len(window) == game.k:
                    score += evaluate_window(window, player, opponent)

    return score


# Scores one possible group of 4 board spaces.

def evaluate_window(window, player, opponent):
    score = 0

    if window.count(player) == 4:
        score += 100000        # Winning position
    elif window.count(player) == 3 and window.count('.') == 1:
        score += 100           # Strong attacking chance
    elif window.count(player) == 2 and window.count('.') == 2:
        score += 10            # Small setup opportunity

    if window.count(opponent) == 3 and window.count('.') == 1:
        score -= 120           # Block opponent's threat

    return score


# Original textbook alpha-beta player.
def original_player(depth):
    def player(game, state):
        return alpha_beta_cutoff_search(state, game, d=depth)

    return player


# Improved alpha-beta player.
# This uses the same alpha-beta search, but replaces the default
# evaluation function with our custom score_position function.
def improved_player(depth):
    def player(game, state):
        current_player = game.to_move(state)

        return alpha_beta_cutoff_search(
            state,
            game,
            d=depth,
            eval_fn=lambda s: score_position(s, game, current_player)
        )

    return player


# Explainable AI feature
# This gives a human-readable explanation for why the improved AI
# selected a move. This makes the AI easier to understand and demo.
def explain_move(state, game, move, player):
    opponent = 'O' if player == 'X' else 'X'
    reasons = []

    # Reason 1: center control
    center = game.v // 2
    if abs(move[1] - center) <= 1:
        reasons.append("it is near the center, which creates more possible winning lines")

    # Reason 2: immediate win
    new_state = game.result(state, move)

    if game.utility(new_state, player) == 1:
        reasons.append("it creates an immediate winning move")

    # Reason 3: blocking opponent's immediate win
    for opponent_move in game.actions(state):
        opponent_state = game.result(state, opponent_move)

        if game.utility(opponent_state, opponent) == 1 and move == opponent_move:
            reasons.append("it blocks the opponent's immediate winning move")

    # Fallback explanation
    if not reasons:
        reasons.append("it had the best heuristic board score after evaluating possible lines")

    return "AI chose move " + str(move) + " because " + " and ".join(reasons) + "."


# Runs several games and records performance.
def run_games(name, player_fn, size, depth, games_count=5):
    wins = 0
    losses = 0
    draws = 0
    total_time = 0

    for _ in range(games_count):
        game = ConnectFour(h=size, v=size, k=4)

        start = time.time()

        # The textbook game prints every board by default.
        # This hides that output so we only see the final summary.
        with contextlib.redirect_stdout(io.StringIO()):
            result = game.play_game(player_fn(depth), random_player)

        end = time.time()

        total_time += end - start

        if result == 1:
            wins += 1
        elif result == -1:
            losses += 1
        else:
            draws += 1

    avg_time = total_time / games_count

    print(
        f"{name}, {size}x{size}, Depth {depth}: "
        f"Wins={wins}, Losses={losses}, Draws={draws}, Avg Time={avg_time:.4f}s"
    )
    return (
        f"{name}, {size}x{size}, Depth {depth}: "
        f"Wins={wins}, Losses={losses}, Draws={draws}, Avg Time={avg_time:.4f}s"
    )


# Experiment 1:
# Compare original alpha-beta vs improved heuristic alpha-beta.
# for size in [7, 8, 10]:
#     print(f"\nBoard size: {size}x{size}")

#     for depth in [1, 2, 3]:
#         run_games("Original", original_player, size, depth)
#         run_games("Improved", improved_player, size, depth)

# run_games("Improved", improved_player, 7, 4)


# Experiment 2:
# Show one explainable AI decision.
# print("\nExplainable AI Demo")

def ai_demo(state, game):
    demo_game = game
    demo_state = state
    demo_player = demo_game.to_move(demo_state)

    demo_move = improved_player(3)(demo_game, demo_state)
    demo_explanation = explain_move(demo_state, demo_game, demo_move, demo_player)

    return (
        f"Selected move: {demo_move}\n"
        f"{demo_explanation}"
    )
    print("Selected move:", demo_move)
    print(demo_explanation)

def random_connect_four_state(h=7, v=7, k=4, num_moves=None):
    game = ConnectFour(h, v, k)
    state = game.initial
    temp_moves = num_moves
    while True:
        if temp_moves is None:
            temp_moves = random.randint(1, (h * v) // 2)

        for _ in range(temp_moves):
            available = game.actions(state)
            if not available or game.terminal_test(state):
                break
            move = random.choice(available)
            state = game.result(state, move)

        if not game.terminal_test(state):
            return state, game
        
        temp_moves = num_moves 

# print(random_connect_four_state())