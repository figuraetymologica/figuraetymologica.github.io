//init images, audio
let kk_img = [];
let broom;
let plopp;

let vw;

//init kk array, amount of kks to generate, at what speed etc
let kks = [];
let to_gen = 10;
let gend = 0;
let interval = 300;
let dramatic_pause = 3;
let radius; //radius of kk hitbox .. hitcircle lol

//Define levels, track current level -> amouts of kks generated in lvls 1 and 2: 50, 90
let lvl_config = [{ fc: 10, speed: 10, limit: 50 }, { fc: 7, speed: 15, limit: 90 }, { fc: 7, speed: 15, limit: 540 }];
let curr_lvl = 0;

//generate balloon decor for start and intro screens
let decor = [];

//active or inactivate buttons as needed
let button_active = false;

//define game modes, store respective dialog for each
let mode = { start: true, intro: false, game: false, first_tap: false, lvl0: false, lvl1: false, lvl2: false, end: false };

let intro_dialog = [
  "Robert... Du bist also 30 geworden.",
  "Dann steht dir eine ganz besondere Ehre zu...",
  "T R E P P E N F E G E N !"
];

let game_dialog = [
  "Zeit zu Fegen!",
  "Klicke/tippe die Kronkorken an, um sie einzu-",
  "sammeln und deine Dreißiger einzuläuten! <3"
];

let lvl0_dialog = [
  "Wow, das Aufwärmen hast du schon einmal ge-",
  "meistert. Jetzt legen wir aber richtig los!",
  "🚀"
];

let lvl1_dialog = [
  "Wirklich gar nicht übel, du machst dich gut!",
  "Kannst du noch?",
  "😉"
];

let lvl2_dialog = [
  "Puh... Da sind ganz schön viele Kronkorken auf",
  "einmal heruntergefallen... Sorry! Du hast dich",
  "wacker geschlagen. Alles Liebe zum Geburtstag!"
];

//what dialog line are we at and what are we showing on the screen atm?
let current_id = 0;
let visible_dialog = ["", "", ""];

//load images, sound before starting the game!
function preload() {
  broom = loadImage('/src/broom_3504416.png');
  for (let i = 0; i < 6; i++) {
    kk_img.push(loadImage('/src/' + i + ".png"));
    if (i < 3) {
      kk_img.push(loadImage('/src/b' + i + ".png"));
    }
  }
  plopp = loadSound("/src/Plopp1.mp3");
}

//resize images, init balloon decor 
function setup() {
  vw = windowWidth;
  console.log(windowWidth);
  if(vw <= 502){
    vw = vw -10;
  }else{
    vw = 500;
  }
  createCanvas(vw, vw);
  radius = 50*vw/500;

  background(125);
  for (let i = 0; i < kk_img.length; i++) {
    kk_img[i].resize(0, vw/5);
    broom.resize(0, vw/5);
  }
  imageMode(CENTER);

  for (let i = 0; i < 20; i++) {
    decor.push({ x: int(random(0, width)), y: int(random(0, height)), size: int(random(25, 70)) });
  }
}

//play the effing game
function draw() {
  background(52, 161, 235);

  if (!mode.game) {
    decorate();
  }

  if (mode.start || mode.intro) {
    overlay();

    if (mode.start) {
      myButton("start");
      noStroke();
      textFont("Verdana");

      textSize(32*vw/500);
      text("30. Geburtstag-Simulator", width / 2, height - height / 1.6);
    }

    if (mode.intro) {
      write_text(intro_dialog);

      if (current_id == intro_dialog.length - 1 && visible_dialog[current_id].length == intro_dialog[current_id].length) {
        myButton("weiter");
      }

    }

  }

  if (mode.game) {
    //kks appearance and collection mechanics
    if (frameCount % lvl_config[curr_lvl].fc == 0 && gend < to_gen) {
      console.log(kks.length);
      if (mode.first_tap && kks.length < 4 && dramatic_pause > 0) {
        dramatic_pause--;
      } else {
        let repeats = 1;

        if (mode.lvl2 && gend >= 240) {
          repeats = 6; //go crazy
        }

        //let kk(s) appear
        for (let j = 0; j < repeats; j++) {
          kks.push({ vis: true, img: int(random(0, 9)), x: int(random(0, vw)), y: int(random(0, vw)), coveredBy: [], covering: [] });
          //check if new kk covers previous kk, add info to both
          if (kks.length > 1) {
            for (let i = 0; i < kks.length - 1; i++) {
              if (overlap(kks[kks.length - 1].x, kks[i].x, kks[kks.length - 1].y, kks[i].y, radius)) {
                kks[i].coveredBy.push(kks.length - 1);
                kks[kks.length - 1].covering.push(i);
              }
            }
          }
          gend++;

        }
        plopp.play(); //play a plopp sound along the appearance
        if (gend == to_gen) {
          console.log(kks);
        }
        //just a little bit of dramatic tempo changes for the intro
        if (mode.first_tap && kks.length < 4 && dramatic_pause == 0) {
          dramatic_pause = 3;
        }
      }
    }

    //speed up the kk appearance into oblivion during the last level -> winning is not an option.
    if (mode.lvl2) {
      if (gend == 105) {
        interval = 200;
      } else if (gend == 150) {
        mode.lvl2.speed = 5;
        interval = 100;
      } else if (gend == 200) {
        mode.lvl2.speed = 3;
        interval = 50;
      } else if (gend == 240) {
        mode.lvl2.speed == 1;
        interval = 1;
      }
    }

    //kks come in groups. adds +10/+15/+15 kks after a cooldown
    if (!mode.first_tap && frameCount % interval == 0 && gend < lvl_config[curr_lvl].limit && to_gen < lvl_config[curr_lvl].limit) {
      if (mode.lvl2 && gend >= 250) {
        to_gen = lvl_config[curr_lvl].limit;
      } else {
        to_gen = to_gen + lvl_config[curr_lvl].speed;
      }

    }

    //draw all kks
    for (let i = 0; i < kks.length; i++) {
      if (kks[i].vis) {
        imageMode(CENTER);
        image(kk_img[kks[i].img], kks[i].x, kks[i].y);
      }
    }

    //show dialog for game explanation
    if (mode.first_tap && gend == to_gen) {
      overlay();
      write_text(game_dialog);
      if (current_id == game_dialog.length - 1 && visible_dialog[current_id].length == game_dialog[current_id].length) {
        myButton("fegen");
      }
    }

    //lvl0 and lvl1: check if all kks have been collected
    if (gend == lvl_config[curr_lvl].limit) {
      let all_collected = true;
      for (let i = 0; i < kks.length; i++) {
        if (kks[i].vis) {
          all_collected = false;
        }
      }
      //lvl2: just define its end as "all collected" to end game :-)
      if (mode.lvl2 && gend == lvl_config[curr_lvl].limit) {
        all_collected = true;
      }
      if (all_collected) {
        console.log("yay"); //<3
        if (mode.lvl0) {
          overlay();
          write_text(lvl0_dialog);
          if (current_id == lvl0_dialog.length - 1 && visible_dialog[current_id].length == lvl0_dialog[current_id].length) {
            myButton("weiter");
          }
        } else if (mode.lvl1) {
          overlay();
          write_text(lvl1_dialog);
          if (current_id == lvl1_dialog.length - 1 && visible_dialog[current_id].length == lvl1_dialog[current_id].length) {
            myButton("weiter");
          }
        } else if (mode.lvl2) {
          overlay();
          write_text(lvl2_dialog);
          mode.end = true;
          if (current_id == lvl2_dialog.length - 1 && visible_dialog[current_id].length == lvl2_dialog[current_id].length) {
            myButton("nochmal");
          }
        }
      }
    }

    //give player a broom to clean up with.
    if (mode.lvl0 || mode.lvl1 || mode.lvl2) {
      image(broom, mouseX + 40, mouseY - 40);
    }

  }

}

function touchStarted(){
  //check if kk has been hit i.e. cleaned up
  if (mode.game && !mode.first_tap && !mode.end) {
    for (let i = 0; i < kks.length; i++) {
      let d = (mouseX - kks[i].x) ** 2 + (mouseY - kks[i].y) ** 2;
      let visible = true;

      //only make the visible parts of a kk clickable in order to clean it up -> check
      if (kks[i].coveredBy.length > 0) {
        for (let j = 0; j < kks[i].coveredBy.length; j++) {
          let coverer = kks[i].coveredBy[j];
          let d = (mouseX - kks[coverer].x) ** 2 + (mouseY - kks[coverer].y) ** 2;

          if (d <= radius ** 2) {
            visible = false;
          }
        }
      } else if (kks[i].coveredBy.length == 0) {
        visible = true;
      }

      //if a kk has been "collected", remove info that it's covering others + make it invisible
      if (d <= radius ** 2 && mouseIsPressed && visible) {
        if (kks[i].covering.length > 0) {
          for (let j = 0; j < kks[i].covering.length; j++) {
            let covered = kks[i].covering[j];
            for (let k = 0; k < kks[covered].coveredBy.length; k++) {
              if (kks[covered].coveredBy[k] == i) {
                kks[covered].coveredBy.splice(k, 1);
              }
            }
          }
        }
        kks[i].vis = false;
      }
    }
  }

  //switch between modes via buttons
  if (mode.start || mode.intro || mode.game) {
    if (button_active && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height - height / 2.25 - 25 && mouseY < height - height / 2.25 + 25) {
      if (mode.start) {
        mode.start = false;
        mode.intro = true;
      } else if (mode.intro && current_id == intro_dialog.length - 1) {
        mode.intro = false;
        mode.game = true;
        mode.first_tap = true;
      } else if (mode.first_tap) {
        mode.first_tap = false;
        mode.lvl0 = true;
      } else if (mode.lvl0) {
        mode.lvl0 = false;
        mode.lvl1 = true;
      } else if (mode.lvl1) {
        mode.lvl1 = false;
        mode.lvl2 = true;
      } else if (mode.lvl2) {
        mode.lvl2 = false;
      }

      //reset dialogs after every mode
      if (!mode.start) {
        for (let i = 0; i < visible_dialog.length; i++) {
          visible_dialog[i] = "";
        }
        current_id = 0;
      }

      if (mode.game && !mode.first_tap && !mode.lvl0) {
        //reset lvl data
        gend = 0;
        kks = [];
        if (!mode.end) {
          curr_lvl++;
          to_gen = lvl_config[curr_lvl].speed;
          console.log(curr_lvl);
          console.log(lvl_config[curr_lvl].speed);
        }

        //reset games
        if (mode.end) {
          mode.game = false;
          mode.end = false;
          //rest
          mode.start = true;
          to_gen = 10;
          interval = 300;
          dramatic_pause = 3;

          //50 90
          lvl_config = [{ fc: 10, speed: 10, limit: 50 }, { fc: 7, speed: 15, limit: 90 }, { fc: 7, speed: 15, limit: 540 }];
          curr_lvl = 0;
          console.log(mode);
        }
      }

      button_active = false;
      cursor(ARROW); //return to regular cursor look after clicking a button
    }
  }

}

function mousePressed() {
  //check if kk has been hit i.e. cleaned up
  if (mode.game && !mode.first_tap && !mode.end) {
    for (let i = 0; i < kks.length; i++) {
      let d = (mouseX - kks[i].x) ** 2 + (mouseY - kks[i].y) ** 2;
      let visible = true;

      //only make the visible parts of a kk clickable in order to clean it up -> check
      if (kks[i].coveredBy.length > 0) {
        for (let j = 0; j < kks[i].coveredBy.length; j++) {
          let coverer = kks[i].coveredBy[j];
          let d = (mouseX - kks[coverer].x) ** 2 + (mouseY - kks[coverer].y) ** 2;

          if (d <= radius ** 2) {
            visible = false;
          }
        }
      } else if (kks[i].coveredBy.length == 0) {
        visible = true;
      }

      //if a kk has been "collected", remove info that it's covering others + make it invisible
      if (d <= radius ** 2 && mouseIsPressed && visible) {
        if (kks[i].covering.length > 0) {
          for (let j = 0; j < kks[i].covering.length; j++) {
            let covered = kks[i].covering[j];
            for (let k = 0; k < kks[covered].coveredBy.length; k++) {
              if (kks[covered].coveredBy[k] == i) {
                kks[covered].coveredBy.splice(k, 1);
              }
            }
          }
        }
        kks[i].vis = false;
      }
    }
  }

  //switch between modes via buttons
  if (mode.start || mode.intro || mode.game) {
    if (button_active && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height - height / 2.25 - 25 && mouseY < height - height / 2.25 + 25) {
      if (mode.start) {
        mode.start = false;
        mode.intro = true;
      } else if (mode.intro && current_id == intro_dialog.length - 1) {
        mode.intro = false;
        mode.game = true;
        mode.first_tap = true;
      } else if (mode.first_tap) {
        mode.first_tap = false;
        mode.lvl0 = true;
      } else if (mode.lvl0) {
        mode.lvl0 = false;
        mode.lvl1 = true;
      } else if (mode.lvl1) {
        mode.lvl1 = false;
        mode.lvl2 = true;
      } else if (mode.lvl2) {
        mode.lvl2 = false;
      }

      //reset dialogs after every mode
      if (!mode.start) {
        for (let i = 0; i < visible_dialog.length; i++) {
          visible_dialog[i] = "";
        }
        current_id = 0;
      }

      if (mode.game && !mode.first_tap && !mode.lvl0) {
        //reset lvl data
        gend = 0;
        kks = [];
        if (!mode.end) {
          curr_lvl++;
          to_gen = lvl_config[curr_lvl].speed;
          console.log(curr_lvl);
          console.log(lvl_config[curr_lvl].speed);
        }

        //reset games
        if (mode.end) {
          mode.game = false;
          mode.end = false;
          //rest
          mode.start = true;
          to_gen = 10;
          interval = 300;
          dramatic_pause = 3;

          //50 90
          lvl_config = [{ fc: 10, speed: 10, limit: 50 }, { fc: 7, speed: 15, limit: 90 }, { fc: 7, speed: 15, limit: 540 }];
          curr_lvl = 0;
          console.log(mode);
        }
      }

      button_active = false;
      cursor(ARROW); //return to regular cursor look after clicking a button
    }
  }

}

//a rectangle for the title, dialogs, buttons
function overlay() {
  noStroke();
  rectMode(CENTER);
  fill(255, 200);
  rect(width / 2, height / 2 - height / 30, width * 0.9, height * .35);
}

//makes dialog appear letter by letter... fancy! ✨
function write_text(dialog) {
  textSize(16*vw/500);
  textAlign(LEFT);
  fill(0);
  text(visible_dialog[0], 0 + width * .1, height / 2 - height * .15);
  text(visible_dialog[1], 0 + width * .1, height / 2 - height * .10);
  text(visible_dialog[2], 0 + width * .1, height / 2 - height * .05);
  if (visible_dialog[current_id].length < dialog[current_id].length && frameCount % 5 == 0) {
    visible_dialog[current_id] += dialog[current_id].charAt(visible_dialog[current_id].length);
  } else if (visible_dialog[current_id].length == dialog[current_id].length && current_id != dialog.length - 1) {
    if (current_id < dialog.length) {
      current_id++;
    }
  }
}

//made myself buttons.
function myButton(txt) {
  button_active = true;
  if (mouseX > width / 2 - 50*vw/500 && mouseX < width / 2 + 50*vw/500 && mouseY > height - height / 2.25 - 25*vw/500 && mouseY < height - height / 2.25 + 25*vw/500) {
    fill(52, 161, 235);
    cursor(HAND);
  } else {
    fill(255);
    cursor(ARROW);
  }

  stroke(0);
  rect(width / 2, height - height / 2.25, 100*vw/500, 50*vw/500);
  fill(0);
  noStroke();
  textFont("Verdana");
  textSize(16*vw/500);
  textAlign(CENTER, CENTER);
  text(txt, width / 2, height - height / 2.25);

}

//functions that checks if two circles overlap
function overlap(x1, x2, y1, y2, r) {
  const distance = Math.hypot(x2 - x1, y2 - y1);
  if (distance <= (2 * r)) {
    return true;
  } else {
    return false;
  }
}

//yay balloons!!
function decorate() {
  textAlign(CENTER, CENTER);
  for (let i = 0; i < decor.length; i++) {
    textSize(decor[i].size*vw/500);
    text("🎈", decor[i].x, decor[i].y);

    if (decor[i].y > -25) {
      decor[i].y--;
    } else {
      decor[i].y = vw+50;
      decor[i].x = int(random(0, width));
    }
    //decor[i].x += int(random(-2, 2));
  }

}



