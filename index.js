var overlay = document.querySelector('.overlay__scene');
    var label = document.querySelector('.overlay__label-content');

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
      this.started = false;
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

function transition() {
  console.log('transition');
  $('.cover').toggleClass('open', true);

}
async function transitionback() {
  $('.cover').toggleClass('open', false);
  $('.cover').toggleClass('close', true);
  await sleep(3000);
  $('.cover').toggleClass('close', false);
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
    transition();
    await sleep(500);
    await game.loadgame('trivia');
    await sleep(2000);
    transitionback();
    await sleep(500);
    await execute(game);

}
gameloop();