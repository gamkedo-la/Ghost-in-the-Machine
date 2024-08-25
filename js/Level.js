function LevelClass() {
	this.playerStart = {x:0, y:0, rot:d270};
	this.startList = [{x:0, y:0, rot:d270}];
	this.startIndex = 0;
	this.walls = [];
	this.entities = [];
	this.triggerZones = [];
	this._markedForDestruction = [];
	this.levelJSON = "{}";

	this.update = function(deltaTime) {
		// Entity update loop
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].update(deltaTime);
		}

		// TriggerZone update loop
		for (let i = 0; i < this.triggerZones.length; i++) {
			this.triggerZones[i].checkOverlaps();
		}

		// Entity destruction loop
		for (let i = 0; i < this._markedForDestruction.length; i++) {
			this._markedForDestruction[i].onDestroy();
			this.entities.splice(this.entities.indexOf(this._markedForDestruction[i]), 1);
		}
		this._markedForDestruction.length = 0;
	}

	this.load = function() {
		var parsedLevel = null;
		if (this.levelJSON != "") {
			parsedLevel = JSON.parse(this.levelJSON);
			//console.log(parsedLevel)

			if (parsedLevel.walls) {
				for (let i = 0; i < parsedLevel.walls.length; i++) {
					let newWall = new WallClass(parsedLevel.walls[i]);
					if (parsedLevel.walls[i].texture != null) {
						newWall.texture = new Image();
						newWall.texture.src = parsedLevel.walls[i].texture
					}
					this.walls.push(newWall);
				}
			}

			if (parsedLevel.entities) {
				for (let i = 0; i < parsedLevel.entities.length; i++) {
					if (parsedLevel.entities[i].roboType == undefined) {
						parsedLevel.entities[i].roboType = "undefined";
					}
					let newEntity;
					switch(parsedLevel.entities[i].roboType) {
					case "BitBunny":
						newEntity = new BitBunnyRobot(parsedLevel.entities[i]);
						break;
					case "Turret":
						newEntity = new TurretRobot(parsedLevel.entities[i]);
						break;
					default:
						newEntity = new SceneEntity(parsedLevel.entities[i]);
						break;
					}


					newEntity.level = this;
					this.entities.push(newEntity);
				}
			}

			if (parsedLevel.triggerZones) {
				for (let i = 0; i < parsedLevel.triggerZones.length; i++) {
					var newTriggerZone;

					switch(parsedLevel.triggerZones[i].type) {
					case "circle":
						newTriggerZone = new CircleTriggerZone(this, parsedLevel.triggerZones[i].pos, parsedLevel.triggerZones[i].radius);
						break;
					case "AABB":
						newTriggerZone = new AABBTriggerZone(this, parsedLevel.triggerZones[i].topleftpos, parsedLevel.triggerZones[i].bottomrightpos);
						break;
					default:
						newTriggerZone = new TriggerZone(this);
						break;
					}

					this.triggerZones.push(newTriggerZone);
				}
			}

			if (parsedLevel.startList) {
				this.startList.length = 0;

				for (let i = 0; i < parsedLevel.startList.length; i++) {
					let newStartPoint = {x:parsedLevel.startList[i].x, y:parsedLevel.startList[i].y, rot:parsedLevel.startList[i].rot};
					this.startList.push(newStartPoint);
				}
			}
		}

		if (this.startIndex < 0) this.startIndex = 0;
		this.playerStart = this.startList[this.startIndex % this.startList.length];
		
		populateAudioNodesFromWallEdges(this.walls);
		cullAudioNodesThatDontConnectToPoint(this.playerStart, this.walls);

		this.onLoad();

		player.pos.x = this.playerStart.x;
		player.pos.y = this.playerStart.y;
		player.rot = this.playerStart.rot;
		player.level = this;
		this.entities.push(player);

		return this;
	}

	this.unload = function() {
		this.onUnload();
	}

	this.getEntityByName = function(name) {
		for (let i = 0; i < this.entities.length; i++) {
			if (name == this.entities[i].name) {
				return this.entities[i];
			}
		}
		return null;
	}

	this.onLoad = function() {}
	this.onUnload = function() {}

	this.markForDestruction = function(entity) {
		this._markedForDestruction.push(entity);
	}

	this.isInBounds = function(x, y) {
		// TODO: measure x, y boundaries from finding in individual maps 
		// and eventually ray casting 
		return x > -100 && x < 300 && y > -100 && y < 300;
	};
}