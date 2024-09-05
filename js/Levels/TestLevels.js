var testLevel1 = new LevelClass();
testLevel1.playerStart = {x:0,y:0,rot:2.712}
testLevel1.levelJSON = '{"walls":[{"p1":{"x":-100,"y":-100},"p2":{"x":300,"y":-100},"color":"red","texture":"textTexture","textureOffset":0,"textureOffset":25,"transparency":false},{"p1":{"x":300,"y":-100},"p2":{"x":300,"y":300},"color":"orange","texture":"text2Texture","textureOffset":0,"transparency":false},{"p1":{"x":300,"y":300},"p2":{"x":-100,"y":300},"color":"yellow","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":-100,"y":300},"p2":{"x":-100,"y":-100},"color":"green","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":100,"y":100},"p2":{"x":-100,"y":100},"color":"darkblue","texture":"textTransperant","textureOffset":0,"transparency":true},{"p1":{"x":100,"y":200},"p2":{"x":100,"y":100},"color":"purple","texture":null,"textureOffset":0,"transparency":false},{"p1":{"x":0,"y":200},"p2":{"x":100,"y":200},"color":"red","texture":"textTransperant","transparency":true},{"p1":{"x":0,"y":150},"p2":{"x":0,"y":200},"color":"orange"},{"p1":{"x":0,"y":150},"p2":{"x":50,"y":150},"color":"yellow"},{"p1":{"x":50,"y":150},"p2":{"x":50,"y":200},"color":"green"}],"portals":[{"p1":{"x":25,"y":150},"p2":{"x":35,"y":150},"color":"magenta","texture":"textTransperant","transparency":true}],"entities":[{"name":"Rob","pos":{"x":50,"y":250},"rot":4.71238898038469},{"name":"Cat","pos":{"x":200,"y":150},"rot":4.71238898038469},{"name":"Benny","pos":{"x":-50,"y":175},"rot":4.71238898038469},{"name":"Hanna","pos":{"x":25,"y":25},"rot":4.71238898038469}]}';

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

var testLevel2 = new LevelClass();
testLevel2.levelJSON = '{"playerStart":{"x":0,"y":0,"rot":4.71238898038469},"startIndex":0,"startList":[{"x":0,"y":0,"rot":4.71238898038469}],"walls":[{"p1":{"x":-27,"y":24},"p2":{"x":23,"y":28},"color":"purple","textureOffset":0,"transparency":false,"texture":"text2Texture"},{"p1":{"x":23,"y":28},"p2":{"x":28,"y":-51},"color":"purple","textureOffset":1.597448159378132,"transparency":false,"texture":"text2Texture"},{"p1":{"x":28,"y":-51},"p2":{"x":82,"y":-54},"color":"purple","textureOffset":93.17814524591017,"transparency":false,"texture":"text2Texture"},{"p1":{"x":82,"y":-54},"p2":{"x":76,"y":28},"color":"purple","textureOffset":34.0108365655085,"transparency":false,"texture":"text2Texture"},{"p1":{"x":-27,"y":24},"p2":{"x":-33,"y":-106},"color":"purple","textureOffset":0,"transparency":false,"texture":"text2Texture"},{"p1":{"x":-33,"y":-106},"p2":{"x":124,"y":-111},"color":"purple","textureOffset":1.383878799795184,"transparency":false,"texture":"text2Texture"},{"p1":{"x":124,"y":-111},"p2":{"x":119,"y":91},"color":"purple","textureOffset":72.17985536708966,"transparency":false,"texture":"text2Texture"},{"p1":{"x":-104,"y":76},"p2":{"x":-115,"y":-104},"color":"purple","textureOffset":27.837722038369066,"transparency":false,"texture":"text2Texture"},{"p1":{"x":-115,"y":-104},"p2":{"x":-33,"y":-106},"color":"purple","textureOffset":31.195700921098023,"transparency":false,"texture":"text2Texture"},{"p1":{"x":119,"y":91},"p2":{"x":74,"y":91},"color":"purple","textureOffset":0,"transparency":false,"texture":"text2Texture"},{"p1":{"x":27,"y":84},"p2":{"x":-104,"y":76},"color":"purple","textureOffset":25.184174820668886,"transparency":false,"texture":"text2Texture"},{"p1":{"x":74,"y":91},"p2":{"x":76,"y":209},"color":"purple","textureOffset":0,"transparency":false,"texture":"text2Texture"},{"p1":{"x":76,"y":209},"p2":{"x":-192,"y":181},"color":"purple","textureOffset":80.16947935455437,"transparency":false,"texture":"text2Texture"},{"p1":{"x":-192,"y":181},"p2":{"x":-207,"y":-187},"color":"purple","textureOffset":74.75664625044101,"transparency":false,"texture":"text2Texture"},{"p1":{"x":-207,"y":-187},"p2":{"x":217,"y":-223},"color":"purple","textureOffset":57.8124427324874,"transparency":false,"texture":"text2Texture"},{"p1":{"x":217,"y":-223},"p2":{"x":206,"y":-58},"color":"purple","textureOffset":13.068016725664165,"transparency":false,"texture":"text2Texture"},{"p1":{"x":206,"y":-58},"p2":{"x":123,"y":-69},"color":"purple","textureOffset":66.73061834668397,"transparency":false,"texture":"textTexture"}],"triggerZones":[{"editID":0,"topleft":{"x":34,"y":-41},"bottomright":{"x":71,"y":8},"type":"AABB"},{"editID":1,"topleft":{"x":137,"y":-103},"bottomright":{"x":199,"y":-72},"type":"AABB"}]}';
testLevel2.onLoad = function() {
	this.opendoor = false;

	this.doorwall = new WallClass();
	this.doorwall.p1 = {x:27, y:84};
	this.doorwall.p2 = {x:74, y:91};
	this.doorwall.p1ClosePos = {x:27, y:84};
	this.doorwall.p1OpenPos = {x:74, y:91};
	this.doorwall.texture = new Image();
	this.doorwall.texture.src = './images/textTexture.png';
	this.walls.push(this.doorwall);

	var doortrigger = this.getTriggerZoneByEditID(0);
	doortrigger.onTriggerEnter = function(entity) {
		if (entity == player) {
			this.level.opendoor = true;
		}
	}
	doortrigger.onTriggerExit = function(entity) {
		if (entity == player) {
			this.level.opendoor = false;
		}
	}

	var exittrigger = this.getTriggerZoneByEditID(1);
	exittrigger.onTriggerEnter = function(entity) {
		if (entity == player) {
			currentMap = testLevel1.load();
		}
	}
}
testLevel2.onUpdate = function(deltaTime) {
	if (this.opendoor && dotProductOfVectors({x:0,y:1}, player.forward) >= 0.8) {
		if (this.doorwall.p1.x > this.doorwall.p1OpenPos.x) {
			this.doorwall.p1.x--;
		}
		if (this.doorwall.p1.x < this.doorwall.p1OpenPos.x) {
			this.doorwall.p1.x++;
		}
		if (this.doorwall.p1.y > this.doorwall.p1OpenPos.y) {
			this.doorwall.p1.y--;
		}
		if (this.doorwall.p1.y < this.doorwall.p1OpenPos.y) {
			this.doorwall.p1.y++;
		}
	} else {
		if (this.doorwall.p1.x > this.doorwall.p1ClosePos.x) {
			this.doorwall.p1.x -= 0.1;
		}
		if (this.doorwall.p1.x < this.doorwall.p1ClosePos.x) {
			this.doorwall.p1.x += 0.1;
		}
		if (this.doorwall.p1.y > this.doorwall.p1ClosePos.y) {
			this.doorwall.p1.y -= 0.1;
		}
		if (this.doorwall.p1.y < this.doorwall.p1ClosePos.y) {
			this.doorwall.p1.y += 0.1;
		}
	}
}

