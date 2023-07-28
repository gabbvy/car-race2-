class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
   gasoline =new Group();
   money = new Group();
   obstacelGroup = new Group();
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    cars = [car1, car2];
    var obstaclesPositions = 
    [ { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
     { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
       { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
        { x: width / 2, y: height - 2800, image: obstacle2Image },
         { x: width / 2 - 180, y: height - 3300, image: obstacle1Image }, 
         { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
          { x: width / 2 + 250, y: height - 3800, image: obstacle2Image }, 
          { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
           { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
            { x: width / 2, y: height - 5300, image: obstacle1Image }, 
            { x: width / 2 - 180, y: height - 5500, image: obstacle2Image } ];
    this.addSprites(gasoline,5,fuleimg,0.02,);
    this.addSprites(money,20,coinsimg,0.09);
    this.addSprites(obstacelGroup,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
  }
  addSprites(spriteGroup,numberOfSprites,spritesImage,scale,positions=[]){
    for(var  i=0;i<numberOfSprites;i++){
      var  x,y;
      if(positions.length>0){
      x=positions[i].x;
      y=positions[i].y;
      spritesImage=positions[i].image;
      }else{
        x=random(width/2+150,width/2-150);
        y =random(-height*4.5,height-400);
      }
     console.log(spritesImage);

     var sprite=createSprite(x,y);
     sprite.addImage("sprite",spritesImage);
     sprite.scale = scale;
     spriteGroup.add(sprite);
    }

  }
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Puntuación");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    
    Player.getPlayersInfo();
    player.getCarsAtEnd();
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderboard();

      //índice de la matriz
      var index = 0;
      for (var plr in allPlayers) {
        //agrega 1 al índice para cada bucle
        index = index + 1;

        //utilizar los datos de la base de datos para mostrar los autos en las direcciones x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          // cambiar la posición de la cámara en la dirección y
          camera.position.y = cars[index - 1].position.y;
        }

      }

      //  manejando eventos teclado
      this.handlePlayerControls();
      const finalLine = height*6-100
      if(player.positionY>finalLine){
        gameState=2 
        player.rank+=1
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
       drawSprites();
    }

  }
  showRank() { swal({ title: `Impresionante!${"\n"}Posición${"\n"}${player.rank}`,
   text: "Llegaste a la meta con éxito", 
   imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
   imageSize: "100x100", confirmButtonText: "Ok" });
   }
   

  handleResetButton() {
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
      carsAtEnd:0,
      playerCount:0,
      gameState:0,
      players:{}
      });
      window.location.reload();
    });
    
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    esta etiqueta se utiliza para mostrar cuatro espacios
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW)&& player.positionX>width/3-50){
      player.positionX -= 5
      player.update();
      
    }
    if (keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300){
      player.positionX +=5
      player.update();
    }
   }
   handlefuel(index){
   cars[index-1].overlap(gasoline,function(collector,collected){
    player.fuel=185;
    collected.remove();
   });
   }
   handlecoins(index){
    cars[index-1].overlap(money,function(collector,collected){
      player.score+=21;
      player.update();
      collected.remove();
    })

   }
}
