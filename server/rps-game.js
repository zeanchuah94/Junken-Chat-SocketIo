class RpsGame {

    constructor(p1,p2){
        this._players = [p1,p2];
        this._turns = [null,null];

        this._sendToPlayers("ゲーム開始!<br>最初はぐー、じゃんけん!!!!!");

        this._players.forEach( (player,idx) => {
            player.on("turn",(turn) => {
                this._onTurn(idx,turn);
            });
        });
    }

    _sendToPlayer(playerIndex,msg){
        this._players[playerIndex].emit("message",msg);
    }

    _sendToPlayers(msg){
        this._players.forEach( (player) => {
            player.emit("message",msg);
        })
    }

    _onTurn(playerIndex,turn){
        this._turns[playerIndex] = turn;
        this._sendToPlayer(playerIndex,`あなたは ${this._getTurnDisplayName(turn)} を選びました`);
        this._checkGameOver();
    }

    _checkGameOver(){
        const turns = this._turns;
        
        const p0_resultName = this._getTurnDisplayName(turns[0]);
        const p1_resultName = this._getTurnDisplayName(turns[1]);

        if(turns[0] && turns[1]){
            this._sendToPlayers("ゲーム終了");
            this._sendToPlayers(`あなたは ${p0_resultName} を出しました`);
            this._sendToPlayers(`相手は ${p1_resultName} を出しました`);
            this._getGameResult();
            this._turns = [null,null];
            this._sendToPlayers('次に行きましょう!<br>最初はぐー、じゃんけん!!!!!');
        }
    }

    _getTurnDisplayName(turn){
        var displayName = "";
        switch(turn){
            case "rock":
                displayName = "グー";
                break;
            case "paper":
                displayName = "パー";
                break;
            case "scissors":
                displayName = "チョキ";
                break;
        }
        return displayName;
    }

    _getGameResult(){
        const p0 = this._decodeTurn(this._turns[0]);
        const p1 = this._decodeTurn(this._turns[1]);

        const distance = (p1 - p0 + 3) % 3;

        switch(distance){
            case 0:
                this._sendToPlayers("引き分け！");
                break;
            case 1:
                this._sendWinMessage(this._players[0],this._players[1]);
                break;
            case 2:
                this._sendWinMessage(this._players[1],this._players[0]);
                break;
        }
    }

    _sendWinMessage(winner,loser){
        winner.emit("message","あなたの勝ち！");
        
        loser.emit("message","あなたの負け！");
    }

    _decodeTurn(turn){
        switch(turn){
            case 'rock':
                return 0;
            case 'paper':
                return 1;
            case 'scissors':
                return 2;
            default:
                throw new Error(`Could not decode turn ${turn}`);
        }
    }

}

module.exports = RpsGame;