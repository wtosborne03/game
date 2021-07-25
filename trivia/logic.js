

async function execute(game) {
    
    var pop_sound = new Howl({
      src: ['sfx/gen/Fanfares/sfx_sounds_fanfare1.wav'],
    });
    question = null;
    answers = null;
    $.get('https://opentdb.com/api.php?amount=1&type=multiple', function (result) {
      question = result.results.question;
      answers = result.results.incorrect_answers;
      answers.push(result.results.correct_answer);
    })
    $('.question').
    await sleep(1000);
    d3.select(".question").transition()
    .style("font-size", "10rem").style("opacity", "100%").duration(2000);
    await sleep(1500);
    pop_sound.play();
    d3.selectAll(".answer").transition()
    .style("font-size", "4rem").style("opacity", "100%").duration(1000);
    pop_sound.play();
    await sleep(1000);
    timer(45);
    game.players.forEach(p => {
      $.get( "trivia/screens/empty.html", function( data ) {
        p.dataConnection.send({
          cm: "contentChange",
          content: data
        });
      });
    });
}