
function checkvip(game) {
  game.players[0].vip = true;
  $.get( "start/screens/vip.html", function( data ) {
    game.players[0].setContent(data);
  });
}

var join_sound = new Howl({
  src: ['sfx/gen/Fanfares/sfx_sounds_fanfare1.wav'],
});
var bounce_sound = new Howl({
  src: ['sfx/gen/Buttons/sfx_sounds_button7.wav'],
});

function newconn(conn) {   
  console.log('new connection');
  if (game.players.length < game.maxplayers) {
      p = new Player(conn, '');
      p.color = colors[0];
      colors.splice(0,1);
      p.tag = $('.player-area').append('<div class="player-icon" id="i' + p.id + '" style="background-color:' + p.color + '"><div class="player-text" id="t' + p.id + '"></div></div>');
      p.tag = $('#i' + p.id)
      p.index = game.players.length;
      
      join_sound.play();
      p.addListener(function(data, p) {
        console.log(data.cm);
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
            bounce_sound.play();
            p.tag.animate({opacity: '25%'}, function(){ p.tag.animate({opacity: '100%'})});
          } else if (data.cm == 'start') {
            if (game.players.length < 2) {
              p.dataConnection.send({
                cm: 'empty'
              });
              
            } else {
              game.started = true;
            }
          }
        });
      p.dataConnection.on('open', function() {
        console.log(p.dataConnection.peerConnnection);
        $.get( "start/screens/content.html", function( data ) {
          p.setContent(data);
        });
        if (game.players.length == 1) {
          checkvip(game);
        } 
        
      });
      p.dataConnection.on('close', function() {
        p.tag.remove();
        colors.push(p.color);
        game.players.splice(p.index, 1);
        console.log('Player Disconnected');
        if (game.players.length > 0) {
          checkvip();
        }
      });
      
      p.dataConnection.peerConnection.oniceconnectionstatechange = function() {
        if(p.dataConnection.peerConnection.iceConnectionState == 'disconnected') {
          p.tag.remove();
          colors.push(p.color);
          game.players.splice(p.index, 1);
          console.log('Player Disconnected');
          if (game.players.length > 0) {
            checkvip();
          }
        }
    }
      p.dataConnection.on('error', function(e) {
       
        console.log(e);
        
      });
      game.players.push(p);
      
  }
}

async function execute(game) {
    var music = new Howl({
      src: ['start/media/music.mp3'],
      autoplay: true,
      loop: true,

    });
    
    music.play();
    
    $('#rc').text(game.id);
    game.peer.on('connection', newconn);
    while (!game.started) {
      await sleep(500);
    }
    music.stop();
    game.players.forEach(p => {
      $.get( "start/screens/empty.html", function( data ) {
        p.setContent(data);
      });
      p.removeListeners();
      game.peer.off('connection', newconn);
    });

}