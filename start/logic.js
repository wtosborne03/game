
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
    var music = new Howl({
      src: ['start/media/music.mp3'],
      autoplay: true,
      loop: true,

    });
    var join_sound = new Howl({
      src: ['sfx/gen/Fanfares/sfx_sounds_fanfare1.wav'],
    });
    var bounce_sound = new Howl({
      src: ['sfx/gen/Buttons/sfx_sounds_button7.wav'],
    });
    music.play();

    $('#rc').text(game.id);
    game.peer.on('connection', function(conn) { 
        if (game.players.length < game.maxplayers) {
            p = new Player(conn, '');
            p.tag = $('.player-area').append('<div class="player-icon" id="i' + p.id + '"><div class="player-text" id="t' + p.id + '"></div></div>');
            p.tag = $('#i' + p.id)
            p.index = game.players.length;
            join_sound.play();
            p.dataConnection.on('data', function(data) {
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
              game.players.splice(p.index, 1);
              console.log('Player Disconnected');
              if (game.players.length > 0) {
                checkvip();
              }
            });
            
            p.dataConnection.peerConnection.oniceconnectionstatechange = function() {
              if(p.dataConnection.peerConnection.iceConnectionState == 'disconnected') {
                p.tag.remove();
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
    });
    while (!game.started) {
      await sleep(500);
    }
    music.stop();
    game.players.forEach(p => {
      $.get( "start/screens/empty.html", function( data ) {
        p.dataConnection.send({
          cm: "contentChange",
          content: data
        });
      });
    });
}