from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'kikostinky'
toolbar = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def make_board():
    '''Initialize the game'''
    board = boggle_game.make_board()
    session['board'] = board
    
    return render_template('index.html', board=board)

@app.route('/word-check')
def word_check():
    '''Check if submitted word is valid'''
    word = request.args['word']
    board = session['board']
    #run the check_valid_word method on our guess
    res = boggle_game.check_valid_word(board, word)
    #json response to return to the client
    return jsonify({'result': res})
    
    