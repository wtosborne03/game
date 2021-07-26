async function ans(data) {
  if (data.cm == 'answer') {
    p.answer = data.answer;
    answern++;
    console.log('a: ' + answern);
    $.get( "trivia/screens/empty.html", function( data ) {
      p.dataConnection.send({
        cm: "contentChange",
        content: data
      });
    });
    
  }
}



async function execute(game) {
    
    var pop_sound = new Howl({
      src: ['sfx/gen/Fanfares/sfx_sounds_fanfare3.wav'],
    });
    var music = new Howl({
      src: ['trivia/media/music.mp3'],
    });
    music.play();
    question = null;
    answers = null;
    c_ans = null;
    await $.get('https://opentdb.com/api.php?amount=1&type=multiple', function (result) {
      console.log(result);
      question = result.results[0].question;
      answers = result.results[0].incorrect_answers;
      c_ans = result.results[0].correct_answer;
      answers.push(result.results[0].correct_answer);
      answers = shuffle(answers);
      $('.question').text(question);
      $('.ans0').text(answers[0]);
      $('.ans1').text(answers[1]);
      $('.ans2').text(answers[2]);
      $('.ans3').text(answers[3]);
    });
    
    await sleep(1000);
    d3.select(".question").transition()
    .style("font-size", "30px").style("opacity", "100%").duration(2000);
    await sleep(1500);
    pop_sound.play();
    d3.selectAll(".answer").transition()
    .style("font-size", "30px").style("opacity", "100%").duration(1000);
    
    await sleep(1000);
    pop_sound.play();
    answern = 0;
    game.players.forEach(p => {
      $.get( "trivia/screens/trivia.html", function( data ) {
        console.log(data);
        data = data.replace('q0', $('.ans0').text());
        data =data.replace('q1', $('.ans1').text());
        data =data.replace('q2', $('.ans2').text());
        data =data.replace('q3', $('.ans3').text());
        p.dataConnection.send({
          cm: "contentChange",
          content: data
        });
        
      });
      p.dataConnection.on('data', ans);
    });
    timer(10);
      for (i = 0; i <= 20; i++) {
      await sleep(500);
      if (answern == game.players.length) {
        killtimer();
        break;
      }
    }
    
    game.players.forEach(p => {
      $.get( "trivia/screens/empty.html", function( data ) {
        p.dataConnection.send({
          cm: "contentChange",
          content: data
        });
      });
    });
    music.stop();

    game.players.forEach(p => {
      if (p.answer != null) {
        var el = $('<div class="nametag" >' + p.name  + '</div>');
        $('.ans' + p.answer).append(el);
        
      }
      
    });
    
    await sleep(1000);
    $('.answer').css('background-color', 'red');
    $( "h2:contains('"+ c_ans + "')" ).css('background-color', 'green');


    correct = parseInt($( "h2:contains('"+ c_ans + "')" ).attr('class').charAt(10));
    console.log(correct);

    game.players.forEach(p => {
      if (p.answer != null) {
        if (p.answer == correct) {
          p.points += 50;
          p.dataConnection.send({
            cm: 'headerChange',
            name: p.name,
            points: p.points,
            color: p.color
          })
        }
        p.answer = null;
      }
      
    });

    await sleep(5000);
    game.players.forEach(p => {
      p.dataConnection.off('data', ans);
      $.get( "trivia/screens/empty.html", function( data ) {
        p.dataConnection.send({
          cm: "contentChange",
          content: data
        });
      });
    });
}