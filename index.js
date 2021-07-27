var overlay = document.querySelector('.overlay__scene');
    var label = document.querySelector('.overlay__label-content');

  function shuffle(array) {
      var currentIndex = array.length,  randomIndex;
    
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
    
      return array;
    }

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }

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

colors = ["#b2abeb","#b5fed9","#25283d","#dc851f","#20a4f3","#ee6352","#fac05e","#f79d84","#b08ea2","#368f8b"];


class GameManager {
    constructor() {
      this.round = 0;
      this.maxround = 20;
      this.started = false;
      this.name = "greatestgauntlet"
      this.peer = new Peer(makeid(), {
        host: '147.182.216.225',
        port: 9003,
        path: '/game'
      });
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
        this.connected = true;
        this.points = 0;
        this.color = '#2f2f2f';
        this.id = this.dataConnection.peer;
        this.vip = false;
        this.index;
        this.recentContent;
        this.callbacks = $.Callbacks();

        this.dataConnection.on('data', (data) => {
            this.callbacks.fire(data, this);
        });
    }
    setContent(content) {
      this.recentContent = content;
      this.dataConnection.send({
        cm: "contentChange",
        content: content
      });
    }
    addListener(callback) {
      this.callbacks.add(callback);
    }
    removeListeners() {
      this.callbacks.empty();
    }
    updatePoints(value) {
      this.points += value;
      this.dataConnection.send({
        cm: 'headerChange',
        name: this.name,
        points: this.points,
        color: this.color
      })
    }
    
}
function timer(time) {
  d3.select(".countdown").transition()
    .style("font-size", "6rem").duration(500);
    var countdownNumberEl = document.getElementById('countdown-number');
    var countdown = time;
    
    countdownNumberEl.textContent = countdown;
    
    mv = setInterval(function() {
      countdown = --countdown;
      if (countdown == 0) {
        d3.select(".countdown").transition()
    .style("font-size", "0rem").duration(500);
        
        clearInterval(mv);
      }
    
      countdownNumberEl.textContent = countdown;
    }, 1000);
}
function killtimer(time) {
  d3.select(".countdown").transition()
    .style("font-size", "0rem").duration(500);
}
function round(state) {
  if (state) {
    d3.select(".round").transition()
    .style("left", "-15px").duration(500);
  } else {
    d3.select(".round").transition()
    .style("left", "-805px").duration(500);
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
    round(true);
    await execute(game);
    while (game.started) {
      transition();
      await sleep(500);
      await game.loadgame('trivia');
      await sleep(2000);
      transitionback();
      await sleep(500);
      await execute(game);
    }

}
gameloop();