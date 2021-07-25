

async function execute(game) {
    
    
    
    game.players.forEach(p => {
      $.get( "trivia/screens/empty.html", function( data ) {
        p.dataConnection.send({
          cm: "contentChange",
          content: data
        });
      });
    });
}