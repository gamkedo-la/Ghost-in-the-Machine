var canvasContext;
var canvas;

var debug = false;

var player = new PlayerClass();
var currentMap = new LevelClass();

var lastTime = window.performance.now();

var FOV = 60;
var heightScale = 8;

var topColor = "lightgrey";
var bottomColor = "gray";

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	waitingforgesture();
}

function waitingforgesture() {

	colorRect(0,0,canvas.width,canvas.height, "black");
	colorText("Press Space to Play", canvas.width/2 - 120, canvas.height/2, "white", "30px Arial");

	if (Key.isDown(Key.SPACE)) {
		window.requestAnimationFrame(gamestart);
	} else {
		window.requestAnimationFrame(waitingforgesture);
	}

	Key.update();
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

	//Update
	player.update(deltaTime);
	currentMap.update(deltaTime);

	if (debug) {

		//2D Camera logic
		canvasContext.resetTransform();//reset the transform matrix as it is cumulative
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset
		colorRect(0,0,800,600, "black");
		canvasContext.translate(canvas.width/2, canvas.height/2);
		canvasContext.rotate(-player.ang + 3*pi/2);
		canvasContext.translate(-player.x, -player.y);

		//2D draw loops
		for (var i = 0; i < walls.length; i++) {
			walls[i].draw2D();
		}

		for (var i = 0; i < gameObjects.length; i++) {
			gameObjects[i].draw2D();
		}

		for (var i in printlist) {
			colorText(i + ": " +printlist[i], player.x - 350, player.y - 250 + i * 10, "white")
		}
		printlist.length = 0;

	} else {
		canvasContext.resetTransform();//reset the transform matrix as it is cumulative
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);//clear the viewport AFTER the matrix is reset
		colorRect(0,0,canvas.width,canvas.height/2, topColor);
		colorRect(0,canvas.height/2,canvas.width,canvas.height/2, bottomColor);

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
			
			var hits = getAllIntersections(player.pos, rayEnd);
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

		var objectIndex = 0;
		for (var i = 0; i < rays.length; i ++) {
			//colorLine(player.x, player.y, rays[i].x, rays[i].y, 1, rays[i].wall.color); //2d

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

		for (objectIndex; objectIndex < currentMap.entities.length; objectIndex++) {
			currentMap.entities[objectIndex].draw3D();
		}
		// console.log(window.performance.now() - thisTime);

	}

	if (Key.isJustPressed(Key.MINUS)){
		AudioMan.turnVolumeDown();
	}
	if (Key.isJustPressed(Key.PLUS)){
		AudioMan.turnVolumeUp();
	}

	Key.update();
	AudioMan.update();

	window.requestAnimationFrame(gameloop);
};