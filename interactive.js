days = 31; //wie viele Blobs gezeichnet werden
sentiment = []; //array mit zufälligen Sentiment-Werten
volume = []; //array mit zufälligen Tagestextvolumen-Werten
page = 0;
months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var myFont;
var c;
info = true;

function preload(){
  myFont = loadFont('AndaleMono.ttf');
}

function setup() {
  c = createCanvas(windowWidth, windowWidth/4);
  c.parent('sketch');
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  c.position(x, y);
  for(let j = 0; j < 12; j++){
    sentMonth = [];
    volumeMonth = [];
    for(let i = 0; i < days; i++){
      append(sentMonth, random(0,1)); //"Simulation" von Sentiment-Werten, Befüllung des Arrays
      append(volumeMonth, random(windowWidth*0.005, windowWidth*0.05)); //"Simulation" von Tagestextvolumen-Werten, Befüllung des Arrays
      if(random(0, 1) <= 0.1){
          volumeMonth[i] = 0;
      }
    }
    append(sentiment, sentMonth);
    append(volume, volumeMonth);
  }

  drawCircle(page); //Funktion, die die Blobs zeichnet
  //saveCanvas(c, 'myCanvas', 'png');
  infoScreen();
}

function infoScreen(){
  fill(255, 200);
  noStroke();
  rect(0, 0, width, height);
  fill(0);
  textSize(windowWidth*.01);
  text("<sanctum>, your chat sentiment. click to continue.", width/2, height/2 - height/30*4);
  text("one circle: one day of the month, absent if no messages were sent that day", width/2, height/2 - height/30);
  text("color (warm to cold), circle messines (clean to messy): positive/negative sentiment of text messages.", width/2, height/2 + height/30);
  text("circle radius: chat messages volume", width/2, height/2 + height/30*3);
}

function mouseClicked(){
  background(255);
  if(!info){
    if(page < 11){
      page++;
    }else{
      page = 0;
    }
    drawCircle(page);
  }else{
    drawCircle(page);
    info = false;
  }
}

function drawCircle(page){
  //Definition zweier Extremwerte für die Farbkodierung des Sentiment-Werts
  //0 (negativ): blau, 1 (positiv): orange
  posSent = color(255, 0, 0,75);
  negSent = color(0, 0, 225,75);
  //Anordnung des ersten Blobs weiter weg von der Kante
  for(let i = 0; i < days; i++){
      //zufällige Anordnung der Blobmittelpunkte
      xPos = 210+i*(width-2*210)/days; //ca. 51px Abstand Mittelpunkt - Mittelpunkt
      yPos = height/2;
      stroke(lerpColor(negSent, posSent, sentiment[page][i])); //Farbermittlung anhand Sentiment
      noFill();
      strokeWeight(2);
      beginShape();
      angleMode(DEGREES);
      //Blobs werden "wilder", wenn das Sentiment negativer ist.
      //Blobs werden größer, wenn das Tagestextvolumen größer ist.
      for(let j = 0; j < 360; j++){
        let x = xPos+cos(j)*random(volume[page][i], (volume[page][i]+volume[page][i]*(1-sentiment[page][i])));
        let y = yPos+sin(j)*random(volume[page][i], (volume[page][i]+volume[page][i]*(1-sentiment[page][i])));
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    stroke(0);
    fill(0);
    textSize(50);
    textFont(myFont, windowWidth*.0175);
    textAlign(CENTER, CENTER);
    text("<sanctum: "+months[page]+">", width/2, height-height*.06);
}

