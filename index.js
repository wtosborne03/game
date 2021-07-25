function makeid() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for ( var i = 0; i < 4; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
 }
 return result;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

colors = ["#423b0b","#b5fed9","#25283d","#dc851f","#20a4f3","#ee6352","#fac05e","#f79d84","#b08ea2","#368f8b"];

class GameManager {
    constructor() {
      this.name = "greatestgauntlet"
      this.peer = new Peer(makeid());
      this.id = this.peer.id;
      console.log(this.id);
      this.players = [];
      this.maxplayers = 10;
    }
    // Getter
    loadgame(gamefile) {
      return new Promise(resolve =>

        $.get( gamefile + "/index.html", {async: false}, function( data ) {
            $( ".game-content" ).html( data );
            resolve();
          }));
    }
  }
class Player {
    constructor(dataConnection, name) {
        this.dataConnection = dataConnection;
        this.name = name;
        this.tag;
        this.points = 0;
        this.color = '#2f2f2f';
        this.id = this.dataConnection.peer;
        this.vip = false;
        this.index;
    }
}
async function gameloop() {
    game = new GameManager();
    await game.loadgame('start');

    await execute(game);

}
gameloop();