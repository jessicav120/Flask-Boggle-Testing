console.log('active');

class BoggleBoard {
    constructor(boardId, secs = 60){
        this.secs = secs;
        this.score = 0;
        this.updateScore();
        this.board$("#" + boardId);
        this.wordList = new Set()

        $('#guessForm', this.board).on('submit', function(e){
            checkWord(e);
            $("#word").val("");
        });
    }

    showMessage(msg, cls){
        $(".msg").html(`<p class=${cls}>${msg}</p>`);
    }

    updateScore(){
        $(".score").html(`<p>${score}</p>`);
    }

    // make get request through Axios to our python server
    async checkWord(e){
        e.preventDefault();
        // get our guess word from DOM input
        let word = $("#word").val();
    
        // send guess to the server for validation
        const res = await axios.get('/word-check', {params:{ word: word.toLowerCase() }});
    
        //show result message to user depending on response
        if (res.data.result === 'not-word'){
            showMessage(`${word} is not a word in English!`, 'err');
        } else if (res.data.result === 'not-on-board'){
            showMessage(`${word} is not on the board!`, 'err');
        } else {
            showMessage(`${word} ok!`, 'pass');
            score += word.length;
            updateScore();
        }
    }
}

