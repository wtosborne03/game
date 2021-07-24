class GameManager {
    constructor() {
      this.name = "greatestgauntlet"
    }
    // Getter
    async loadgame(gamefile) {
        $.get( gamefile + "/index.html", function( data ) {
            $( ".game-content" ).html( data );
            
          });
       
    }
  }
class Player {
    constructor(peer, name) {
        this.peer = peer;
        this.name = name;
    }
}
async function gameloop() {
    game = new GameManager();
    await game.loadgame('start');
    await execute();

}
gameloop();