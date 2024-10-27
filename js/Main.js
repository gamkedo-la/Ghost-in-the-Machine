var canvasContext;
var canvas;

var debug = false;

const GAMESTATES = {
	TitleScreen: 0,
	GameLoop: 1,
	Paused: 2,
	Death: 3,
	Win: 4,
	Credits: 5
}
var gameState = GAMESTATES.TitleScreen;

var player = new PlayerClass();
var currentMap = new LevelClass();
var theFloor = new TheFloorClass();

var lastTime = window.performance.now() / 1000;

var FOV = 60;
var FOV_TARGET = 60;
var FOV_CHANGE_DRAG = 6;
var heightScale = 10; // note: editor uses a different scale

var mainMenuImage = document.createElement("img"); // create element for main menu background
mainMenuImage.src = "./source_art/Main_Menu/MainMenu.png"; // attach source for main menu
var HUDImage = new Image();
HUDImage.src = './images/hud.png';

var titleAnimElem;
var titleCreditsGuideElem;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	titleAnimElem = document.getElementById("titleAnimation");
	titleCreditsGuideElem = document.getElementById("creditsHint");
	var titleAnimationLengthMS = 7000;
	setTimeout(SwitchTitleAnimForGameCanvas, titleAnimationLengthMS);

	MainLoop();
}

function SwitchTitleAnimForGameCanvas() {
	titleAnimElem.style.display = "none";
	titleCreditsGuideElem.style.display = "none";
	canvas.style.display = "block";
}

function MainLoop(time) {
	time /= 1000;
	var deltaTime = time - lastTime;
	// Max deltaTime to 5fps
	if (deltaTime > 0.2) deltaTime = 0.2;
	lastTime = time;

	CheckUIKeys();

	switch(gameState) {
	case GAMESTATES.TitleScreen:
		WaitingForGesture();
		break;
	case GAMESTATES.GameLoop:
		GameLoop(deltaTime);
		break;
	case GAMESTATES.Paused:
		PauseScreen();
		break;
	case GAMESTATES.Death:
		DeathScreen();
		break;
	case GAMESTATES.Win:
		WinScreen();
		break;
	case GAMESTATES.Credits:
		CreditsScreen();
		break;
	}

	Key.update();
	window.requestAnimationFrame(MainLoop);
}

// This function is for non-player key handling (pause, esc, mute, etc.)
function CheckUIKeys() {
	if(Key.isJustPressed(Key.P)){
		if (gameState == GAMESTATES.GameLoop) {
			gameState = GAMESTATES.Paused;
		} else if (gameState = GAMESTATES.Paused) {
			gameState = GAMESTATES.GameLoop;
		}
	}
	
	if(Key.isJustPressed(Key.M)){
		AudioMan.toggleMute(); // toggle Mute here
	}
}

function WaitingForGesture() {
	var pauseText = "Press Space to Play";
	if (rndOneIn(90)) {
		pauseText = pauseText.replaceAll(" ", "");
	}
	if (rndOneIn(30)) {
		pauseText = pauseText.replaceAll("P", "7");
	}
	if (rndOneIn(30)) {
		pauseText = pauseText.replaceAll("S", "5");
	}
	if (rndOneIn(30)) {
		pauseText = pauseText.replaceAll("t", "4");
	}
	if (rndOneIn(30)) {
		pauseText = pauseText.replaceAll("s", "z");
	}

	canvasContext.drawImage(mainMenuImage, 0, 0); // load image for main menu
	colorText(pauseText, canvas.width/2, canvas.height/2 + 50, "white", "30px Arial", "center");

	if (Key.isJustPressed(Key.SPACE)) {
		SwitchTitleAnimForGameCanvas();
		GameStart();
	}
	if (Key.isJustPressed(Key.C)) {
		SwitchTitleAnimForGameCanvas();
		gameState = GAMESTATES.Credits;
		console.log("show credits toggle, delaying GameStart...")
	}
}

function GameStart() {
	player = new PlayerClass();
	AudioMan.setListener(player);

	// if (debug) { testAllHeaps(); }
	// if (debug) { testPriorityQueue(); }
	// if (debug) { testAStarSearch(); }
	// if (debug) { testCircleIsOnLineSegment(); }
	S1R3Level.load();
	// if (debug) { testCircleIsOnWall(currentMap.walls); }
	// if (debug) { testIsInBounds(); }	

	gameState = GAMESTATES.GameLoop;
}

function GameLoop(deltaTime) {

	if (FOV > FOV_TARGET) {
		FOV -= (FOV - FOV_TARGET) / FOV_CHANGE_DRAG;
	}

	if (FOV < FOV_TARGET) {
		FOV += (FOV_TARGET - FOV) / FOV_CHANGE_DRAG;
	}
	
	player.update(deltaTime);
	currentMap.update(deltaTime);
	particles.update(deltaTime);

	if (debug) {

		//2D Camera logic
		canvasContext.resetTransform();//reset the transform matrix as it is cumulative
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset
		colorRect(0,0,800,600, "black");
		canvasContext.translate(canvas.width/2, canvas.height/2);
		canvasContext.rotate(-player.rot + 3*pi/2);
		canvasContext.translate(-player.x, -player.y);

		//2D draw loops
		for (var i = 0; i < currentMap.walls.length; i++) {
			currentMap.walls[i].draw2D();
		}

		if (currentMap.portals) {
			for (var i = 0; i < currentMap.portals.length; i++) {
				currentMap.portals[i].draw2D();
			}	
		}

		for (var i = 0; i < currentMap.entities.length; i++) {
			currentMap.entities[i].draw2D();
		}
	player.draw2D();

	} else {
		canvasContext.resetTransform();//reset the transform matrix as it is cumulative
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset
		
		drawBackground();

		if (FLOOR_ENABLED) theFloor.draw(player.pos.x,player.pos.y,player.rot);

		// var thisTime = window.performance.now();
		//3D
		var numRays = canvas.width;
		var drawWidth = canvas.width / numRays;
		var drawDistance = 600;
		var wallHeight = heightScale;
		var rays = [];
		for (var i = 0; i < numRays; i ++) {
			// From half of FOV left, to half of FOV right
			var angle = degToRad(-(FOV/2) + ((FOV / numRays) * i)) + player.rot;
			var rayEnd = {x:Math.cos(angle) * drawDistance + player.x, y:Math.sin(angle) * drawDistance + player.y};
			
			var hits = getAllIntersections(player.pos, rayEnd, currentMap.walls);
			hits.push(...getAllIntersections(player.pos, rayEnd, currentMap.portals));
			for (var j = 0; j < hits.length; j++) {
				var hit = hits[j];
				hit.i = i;

				rays.push(hit);

				if (!hit.wall.transparency) {
					break;
				}
			}
		}

		rays.sort((a, b) => (a.distance < b.distance) ? 1 : -1);
		currentMap.entities.sort((a, b) => (a.distance < b.distance) ? 1 : -1);
		particles.active.sort((a, b) => (a.distance < b.distance) ? 1 : -1);

		var objectIndex = 0;
		var particleIndex = 0;
		for (var i = 0; i < rays.length; i ++) {
			//colorLine(player.x, player.y, rays[i].x, rays[i].y, 1, rays[i].wall.color); //2d

			//Draw particles that have a greater depth than the current ray
			for (particleIndex; particleIndex < particles.active.length; particleIndex++) {
				if (particles.active[particleIndex].distance > rays[i].distance) particles.active[particleIndex].draw3D();
				else break;
			}
			//Draw game objects that have a greater depth than the current ray
			for (objectIndex; objectIndex < currentMap.entities.length; objectIndex++) {
				if (currentMap.entities[objectIndex].distance > rays[i].distance) currentMap.entities[objectIndex].draw3D();
				else break;
			}

			// Get vector from player to ray hit and project onto forward vector
			var rayVector = subtractVectors(rays[i], player.pos);
			var distance = Math.max(0.0001, dotProductOfVectors(rayVector, player.forward));

			// Correct for fisheye
			var cameraAng = player.rot - angle;
			cameraAng = wrap(cameraAng, 0, 2*pi);
			//var distance = rays[i].distance * Math.cos(cameraAng);

			var x = rays[i].i * drawWidth;
			var y = canvas.height/2 - wallHeight*canvas.height*0.5/distance;
			var w = drawWidth;
			var h = wallHeight * canvas.height / distance;
			var distanceAlongWall = distanceBetweenTwoPoints(rays[i].wall.p1, rays[i]);

			if (rays[i].wall.texture != null) {
				canvasContext.drawImage(rays[i].wall.texture,
					(rays[i].wall.textureOffset + distanceAlongWall * 10) % 100, 0, // 10 is a magic number to unstretch texture
					1, 100,
					x, y,
					w, h);
			} else if (rays[i].wall.color != null) {
				colorRect(x, y, w, h, rays[i].wall.color);
			}
			colorRect(x, y, w, h, fullColorHex(20, 10, 20, distance/drawDistance/2 * 512));
		}

		for (particleIndex; particleIndex < particles.active.length; particleIndex++) {
			particles.active[particleIndex].draw3D();
		}
		for (objectIndex; objectIndex < currentMap.entities.length; objectIndex++) {
			currentMap.entities[objectIndex].draw3D();
		}

		canvasContext.drawImage(HUDImage, 0, 0, 800, 600);

		player.sprite.drawAt(60, 60, 60);
		var coolbarWidth = player._actionCooldown / player.actionCooldownTime * 113;
		if (coolbarWidth < 0) coolbarWidth = 0;
		colorRect(709 - coolbarWidth, 13, coolbarWidth, 18, 'yellow');
		colorCircle(745, 65, Math.abs(player.health/player.maxHealth) * 35, 'blue')

		// console.log(window.performance.now() - thisTime);
	}
	// end of draw block

	// if (debug) { testAStarSearch(); }

	AudioMan.update();
};

function PauseScreen(){
	colorRect(0,0,canvas.width,canvas.height, "gray"); // draw a Pause Screen
	colorText("PAUSED", canvas.width/2, canvas.height/2, "white", "30px Arial", "center");
	colorText("Press P to Return to Game", canvas.width/2, canvas.height/2 + 50, "white", "30px Arial", "center");
}

function DeathScreen(){
	colorRect(0,0,canvas.width,canvas.height, "gray"); // draw a Pause Screen
	colorText("You died", canvas.width/2, canvas.height/2, "white", "30px Arial", "center");
	colorText("Press Space to return to the title screen", canvas.width/2, canvas.height/2 + 50, "white", "30px Arial", "center");
	colorText("Press R to return to restart the level", canvas.width/2, canvas.height/2 + 100, "white", "30px Arial", "center");

	if (Key.isJustPressed(Key.SPACE)) {
		gameState = GAMESTATES.TitleScreen;
	}
	if (Key.isJustPressed(Key.R)) {
		player = new PlayerClass();
		currentMap.load();
		gameState = GAMESTATES.GameLoop;
	}
}

function WinScreen(){
	colorRect(0,0,canvas.width,canvas.height, "gray"); // draw a Pause Screen
	colorText("You win", canvas.width/2, canvas.height/2, "white", "30px Arial", "center");
	colorText("Press Space to return to the title screen", canvas.width/2, canvas.height/2 + 50, "white", "30px Arial", "center");

	if (Key.isJustPressed(Key.SPACE)) {
		gameState = GAMESTATES.TitleScreen;
	}
}

function CreditsScreen() {
	drawCredits();
	if(Key.isJustPressed(Key.SPACE)){
		GameStart();
	}
}

function drawCredits() {
  var context=canvasContext; // patching over different variable name
  context.fillStyle="black";
  context.fillRect(0,0,canvas.width,canvas.height);
  var lineX = 20;
  var lineY = 15;
  var creditsSize = 20;
  var lineSkip = creditsSize+8;
  context.globalAlpha = 1;
  context.fillStyle = "rgba(220,220,220,1)";
  var wasFont = context.font;
  context.font = creditsSize+"px Arial";
  var wasAlign=context.textAlign;
  context.textAlign = "left";
  for(var i=0;i<this.creditsList.length;i++) {
      context.fillText(this.creditsList[i],lineX,lineY+=lineSkip);
  }
  context.textAlign = wasAlign;
  context.font = wasFont;
}

var creditsList=[
"Michael Fewkes: Project lead, raycasting engine, core gameplay, custom level editor / format / related features, stage design, possession ability and effect, door support, wall textures, NPC system, shadows, input handling, projectile support, HUD, trigger zones, turret functionality, explosion area of effect, win and lose screens",
"Jason Timms: Bot pathfinding with related data structures and support/debugging functions, bit bunny and pyro drone behaviors, portal support, mute toggle, assorted bug fixing",
"Stephen \"Arkia\" Hollibaugh: Smooth collision slide, fish eye correction, possession view fix, edge case crash prevention",
"Jonathan Peterson: Cube robot sprite, blocky turret sprite, blaster projectile with color variants",
"Christer \"McFunkypants\" Kaitila: Sky and floor rendering, cube robot integration, custom spritesheet support, particle system, sound effect integration",
"Cindy Andrade: Animated opening title sequence and logo with related integration, flamethrower robot art",
"Vaan Hope Khani: Intro and outro story writing, explosion sounds",
"jakeyouh dogwalker: Background music"," ",
"                                        == PRESS SPACE TO CONTINUE =="]

function lineWrapCredits() {
    const newCut = [];
    var maxLineChar = 85;
    var findEnd;

    for(let i = 0; i < this.creditsList.length; i++) {
      const currentLine = this.creditsList[i];
      for(let j = 0; j < currentLine.length; j++) {
        /*const aChar = currentLine[j];
        if(aChar === ":") {
          if(i !== 0) {
            newCut.push("\n");
          }
          newCut.push(currentLine.substring(0, j + 1));
          newCut.push(currentLine.substring(j + 2, currentLine.length));
          break;
        } else*/ if(j === currentLine.length - 1) {
          if((i === 0) || (i >= this.creditsList.length - 2)) {
            newCut.push(currentLine);
          } else {
            newCut.push(currentLine.substring(0, currentLine.length));
          }
        }
      }
    }

    const newerCut = [];
    for(var i=0;i<newCut.length;i++) {
      while(newCut[i].length > 0) {
        findEnd = maxLineChar;
        if(newCut[i].length > maxLineChar) {
          for(var ii=findEnd;ii>0;ii--) {
            if(newCut[i].charAt(ii) == " ") {
              findEnd=ii;
              break;
            }
          }
        }
        newerCut.push(newCut[i].substring(0, findEnd));
        newCut[i] = newCut[i].substring(findEnd, newCut[i].length);
      }
    }

    this.creditsList = newerCut;
  }
lineWrapCredits();
