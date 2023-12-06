from flask import Flask, request, render_template, session, jsonify
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'kikostinky'
toolbar = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/', )
def make_board():
    '''Initialize the game'''
    board = boggle_game.make_board()
    session['board'] = board
    
    highscore = session['highscore']
    
    return render_template('index.html', board=board, highscore=highscore)

@app.route("/word-check") #API endpoint
def word_check():
    '''Check if submitted word is valid'''
    word = request.args['word']
    board = session['board']
    #run the check_valid_word method on our guess
    res = boggle_game.check_valid_word(board, word)
    #json response to return to the client
    return jsonify({'result': res})

@app.route("/score-game", methods=["POST"])
def score_game():
    '''score the game and record the amount of plays'''
    score = request.json["score"]
    nplays = session.get("nplays", 0)
    highscore = session.get("highscore", 0)
    
    session['nplays'] = nplays + 1
    session['highscore'] = max(highscore, score)
    
    return jsonify(recordBreak=score > highscore)
    
    