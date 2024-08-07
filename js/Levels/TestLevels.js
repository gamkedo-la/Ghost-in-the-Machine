var testLevel1 = new LevelClass();
testLevel1.levelJSON = '{"walls":[{"p1":{"x":-100,"y":-100},"p2":{"x":300,"y":-100},"color":"red","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":300,"y":-100},"p2":{"x":300,"y":300},"color":"orange","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":300,"y":300},"p2":{"x":-100,"y":300},"color":"yellow","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":-100,"y":300},"p2":{"x":-100,"y":-100},"color":"green","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":100,"y":100},"p2":{"x":-100,"y":100},"color":"darkblue","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":100,"y":200},"p2":{"x":100,"y":100},"color":"purple","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":0,"y":200},"p2":{"x":100,"y":200},"color":"red"},{"p1":{"x":0,"y":150},"p2":{"x":0,"y":200},"color":"orange"},{"p1":{"x":0,"y":150},"p2":{"x":50,"y":150},"color":"yellow"},{"p1":{"x":50,"y":150},"p2":{"x":50,"y":200},"color":"green"}],"entities":[{"name":"Rob","pos":{"x":50,"y":250},"rot":4.71238898038469},{"name":"Cat","pos":{"x":200,"y":150},"rot":4.71238898038469},{"name":"Benny","pos":{"x":-50,"y":175},"rot":4.71238898038469},{"name":"Hanna","pos":{"x":25,"y":25},"rot":4.71238898038469}]}';
testLevel1.topColor = "lightblue";
testLevel1.bottomColor = "lightgreen";
testLevel1.onLoad = function() {
	// //generate a random room
	// var x = -250;
	// var y = -250;
	// var wallTexture = new Image();
	// wallTexture.src = './images/text2Texture100x100.png';
	// //console.log("x:" + x + "," + "y:" + y);
	// for (var i = 0; i < 10; i++) {
	// 	var newWall = new WallClass();
	// 	newWall.p1 = {x:x, y:y};
	// 	x += rndFloat(0, 50);
	// 	y += rndFloat(-25, 25);
	// 	newWall.p2 = {x:x, y:y};
	// 	newWall.texture = wallTexture;
	// 	this.walls.push(newWall);
	// }
	// //console.log("x:" + x + "," + "y:" + y);
	// for (var i = 0; i < 10; i++) {
	// 	var newWall = new WallClass();
	// 	newWall.p1 = {x:x, y:y};
	// 	x += rndFloat(-25, 25);
	// 	y += rndFloat(0, 50);
	// 	newWall.p2 = {x:x, y:y};
	// 	newWall.texture = wallTexture;
	// 	this.walls.push(newWall);
	// }
	// for (var i = 0; i < 10; i++) {
	// 	var newWall = new WallClass();
	// 	newWall.p1 = {x:x, y:y};
	// 	x += rndFloat(0, -50);
	// 	y += rndFloat(-25, 25);
	// 	newWall.p2 = {x:x, y:y};
	// 	newWall.texture = wallTexture;
	// 	this.walls.push(newWall);
	// }
	// //console.log("x:" + x + "," + "y:" + y);
	// for (var i = 0; i < 10; i++) {
	// 	var newWall = new WallClass();
	// 	newWall.p1 = {x:x, y:y};
	// 	x += rndFloat(-25, 25);
	// 	y += rndFloat(0, -50);
	// 	newWall.p2 = {x:x, y:y};
	// 	newWall.texture = wallTexture;
	// 	this.walls.push(newWall);
	// }
	// //console.log("x:" + x + "," + "y:" + y);
	// this.walls[this.walls.length-1].p2 = this.walls[this.walls.length-40].p1;

	var testTriggerZone = new CircleTriggerZone(this, {x:-100, y:-100}, 20);
	testTriggerZone.onTriggerEnter = function(entity) {
		var soundList = ["./audio/explosionLong.wav", "./audio/explosionShort.wav"]
		AudioMan.createSound3D(rndFromList(soundList), {pos:{x:rndInt(-99,100), y:rndInt(-99,100)}}).play();
	}
	this.triggerZones.push(testTriggerZone);

	this.getEntityByName("Rob").sprite.setRow(1);
	this.getEntityByName("Rob").brain.think = function(deltaTime) {
		this.rotateDelta = 0.5;
		this.moveDelta.x = 1;
	}

	this.getEntityByName("Cat").sprite.setRow(2);
	this.getEntityByName("Cat").brain.think = function(deltaTime) {
		this.rotateDelta -= dotProductOfVectors(this.right, normalizeVector(subtractVectors(player.pos, this.pos)));
	}

	this.getEntityByName("Benny").sprite.setRow(3);
	this.getEntityByName("Benny").tickTime = 0;
	this.getEntityByName("Benny").onUpdatePost = function(deltaTime) {
		this.sprite.xScale = 0.5 * Math.sin(this.tickTime) + 1;
		this.sprite.yScale = 0.5 * Math.cos(this.tickTime) + 1;
		this.tickTime += deltaTime;
	}

	this.getEntityByName("Hanna").sprite.setRow(4);

	for (let i = 0; i < 5; i++) {
		let newEnemy = new BitBunnyRobot({name: "testBunny" + i, pos:{x:50 + i*10,y:50}, level: this});
		this.entities.push(newEnemy);
	}

	for (let i = 0; i < 3; i++) {
		let newEnemy = new TurretRobot({name: "testTurret" + i, pos:{x:25 + i*30,y:225}, level: this});
		this.entities.push(newEnemy);
	}
}