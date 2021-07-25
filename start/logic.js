
function checkvip(game) {
  game.players[0].vip = true;
  $.get( "start/screens/vip.html", function( data ) {
    game.players[0].dataConnection.send({
      cm: "contentChange",
      content: data
    });
  });
}

async function execute(game) {
    $('#rc').text(game.id);
    game.peer.on('connection', function(conn) { 
        if (game.players.length < game.maxplayers) {
            p = new Player(conn, '');
            p.tag = $('.player-area').append('<div class="player-icon" id="i' + p.id + '"><div class="player-text" id="t' + p.id + '"></div></div>');
            p.tag = $('#i' + p.id)
            
            p.dataConnection.on('data', function(data) {
                if (data.cm == 'name') {
                  p.name = data.name;
                  $('#t' + p.id).text(p.name);
                  p.dataConnection.send({
                    cm: 'headerChange',
                    name: p.name,
                    points: p.points,
                    color: p.color
                  })
                  
                } else if (data.cm == 'bounce') {
                  console.log('bounce');
                  p.tag.animate({opacity: '25%'}, function(){ p.tag.animate({opacity: '100%'})});
                }
              });
            p.dataConnection.on('open', function() {
              $.get( "start/screens/content.html", function( data ) {
                p.dataConnection.send({
                  cm: "contentChange",
                  content: data
                });
              });
              if (game.players.length == 1) {
                checkvip(game);
              } 
              
            });
            p.dataConnection.on('close', function() {
              p.tag.remove();
              game.players.filter(item => item !== p);
              console.log('Player Disconnected');
              checkvip();
            });
            p.dataConnection.on('error', function(e) {
             
              console.log(e);
              
            });
            game.players.push(p);
            
        }
    });
}