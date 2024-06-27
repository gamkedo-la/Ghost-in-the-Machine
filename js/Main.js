var canvasContext;
var canvas;

var debug = false;

var isPaused = false;

var player = new PlayerClass();
var currentMap = new LevelClass();
var theFloor = new TheFloorClass();

var lastTime = window.performance.now();

var FOV = 60;
var heightScale = 8; // note: editor uses a different scale

var topColor = "lightgrey";
var bottomColor = "gray";

var mainMenuImage = document.createElement("img"); // create element for main menu background
mainMenuImage.src = "./source_art/Main_Menu/MainMenu.png"; // attach source for main menu

var titleAnimElem;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	titleAnimElem = document.getElementById("titleAnimation");
	var titleAnimationLengthMS = 7000;
	setTimeout(switchTitleAnimForGameCanvas, titleAnimationLengthMS);

	waitingforgesture();
}

function switchTitleAnimForGameCanvas() {
	titleAnimElem.style.display = "none";
	canvas.style.display = "block";
}

function waitingforgesture() {

	canvasContext.drawImage(mainMenuImage, 0, 0); // load image for main menu
	colorText("Press Space to Play", canvas.width/2 - 120, canvas.height/2, "white", "30px Arial");


	if (Key.isDown(Key.SPACE)) {
		switchTitleAnimForGameCanvas();
		window.requestAnimationFrame(gamestart);
	} else {
		window.requestAnimationFrame(waitingforgesture);
	}

	Key.update();
}

// This function is for non-player key handling (pause, esc, mute, etc.)
function checkUIKeys() {
	if(Key.isJustPressed(Key.P)){
		isPaused = !isPaused; // toggle Pause here
	}
	
	if(Key.isJustPressed(Key.M)){
		AudioMan.toggleMute(); // toggle Mute here
	}
}

function drawPauseScreen(){
	colorRect(0,0,canvas.width,canvas.height, "gray"); // draw a Pause Screen
	colorText("PAUSED", canvas.width/2 - 120, canvas.height/2, "white", "30px Arial");
	colorText("Press P to Return to Game", canvas.width/2 - 120, canvas.height/2 + 50, "white", "30px Arial");
}

function gamestart() {
	AudioMan.setListener(player);
	window.requestAnimationFrame(gameloop);

	currentMap = testLevel1.load();
}

function gameloop(time) {
	time /= 1000;
	var deltaTime = time - lastTime;
	lastTime = time;
	
	checkUIKeys();
	if(!isPaused){
		//Update, only when the game is not paused
		player.update(deltaTime);
		currentMap.update(deltaTime);
        particles.update(deltaTime);
	}

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

		for (var i = 0; i < currentMap.entities.length; i++) {
			currentMap.entities[i].draw2D();
		}
		//Draw player
		colorLine(player.pos.x, player.pos.y, player.pos.x + player.forward.x * 10, player.pos.y +player.forward.y * 10, 2, "darkgrey");
		colorEmptyCircle(player.pos.x, player.pos.y, 5, "darkgrey");

		for (var i in printlist) {
			colorText(i + ": " +printlist[i], player.x - 350, player.y - 250 + i * 10, "white")
		}
		printlist.length = 0;

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

			// Correct for fisheye
			var cameraAng = player.rot - angle;
			cameraAng = wrap(cameraAng, 0, 2*pi);
			var distance = rays[i].distance * Math.cos(cameraAng);

			var x = rays[i].i * drawWidth;
			var y = canvas.height/2 - wallHeight*canvas.height*0.5/distance;
			var w = drawWidth;
			var h = wallHeight * canvas.height / distance;
			var distanceAlongWall = distanceBetweenTwoPoints(rays[i].wall.p1, rays[i]);

			colorRect(x, y, w, h, rays[i].wall.color);
			if (rays[i].wall.texture != null) {
				canvasContext.drawImage(rays[i].wall.texture,
					(distanceAlongWall * wallHeight) % 100, 0, //Magic number to unstretch texture
					1, 100,
					x, y,
					w, h);
			}
			colorRect(x, y, w, h, fullColorHex(20, 10, 20, distance/drawDistance/2 * 512));
		}

		for (particleIndex; particleIndex < particles.active.length; particleIndex++) {
			particles.active[particleIndex].draw3D();
		}
		for (objectIndex; objectIndex < currentMap.entities.length; objectIndex++) {
			currentMap.entities[objectIndex].draw3D();
		}
		// console.log(window.performance.now() - thisTime);

	}

	if(isPaused){
		drawPauseScreen();
	}
	// end of draw block

	Key.update();
	AudioMan.update();

	window.requestAnimationFrame(gameloop);
	
};