console.log('activated');

// class for game values (scores, time) and other attributes -- not the HTML
class BoggleBoard {
    constructor(secs = 60){
        this.secs = secs;

        this.score = 0;
        this.updateScore();

        this.wordList = new Set();

        //set and begin timer on load
        this.timer = setInterval(this.timeTick.bind(this), 1000);
        this.updateTime();

        $('.guessForm').on('submit', this.checkWord.bind(this));
    }

    // display status message //
    showMessage(msg, cls){
        $(".msg").html(`<p class=${cls}>${msg}</p>`);
    }

    // show score to user //
    updateScore(){
        $(".score").html(`<p>${this.score}</p>`);
    }

    // show list of user submitted words //
    updateList(word){
        $("div.wordList ul").append(`<li>${word}</li>`);
    }

    // display timer //
    updateTime(){
        $(".time").html(`<p>Time: ${this.secs}</p>`);
    }

    // timer countdown //
    async timeTick(){
        this.updateTime();
        this.secs -= 1;

        if (this.secs === -1){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    // make get request through Axios to our python server //
    async checkWord(e){
        e.preventDefault();
        // get our guess word from DOM input
        let $word = $(".word").val();
        let wordLC = $word.toLowerCase();
    
        // send guess to the server for validation
        const res = await axios.get("/word-check", {params: { word: wordLC }});
        const resData = res.data.result;

        if(this.wordList.has( wordLC )){
            this.showMessage('word exists in list!', 'err')
            return;
        }

        // show result message to user depending on response
        if (resData === 'not-word'){
            this.showMessage(`${$word} is not a word in English!`, 'err');
        } else if (resData === 'not-on-board'){
            this.showMessage(`${$word} is not on the board!`, 'err');
        } else {
            this.showMessage(`${$word} ok!`, 'pass');

            this.wordList.add(wordLC);
            this.score += $word.length

            this.updateList($word);
            this.updateScore();
        }

        $(".word").val("");
    }

    // when game ends, score and display appropriate messages //
    async scoreGame() {
        $(".guessForm").hide();
        const res = await axios.post("/score-game", { score: this.score});
        if(res.data.recordBreak){
            this.showMessage(`New Record!`, 'ok');
        } else {
            this.showMessage('Good Game!', 'ok');
        }
    }
} 