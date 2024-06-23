function LevelClass() {
	this.playerStart = {x:0, y:0};
	this.walls = [];
	this.entities = [];
	this._markedForDestruction = [];
	this.levelJSON = "{}";

	this.update = function(deltaTime) {
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].update(deltaTime);
		}

		for (let i = 0; i < this._markedForDestruction.length; i++) {
			this._markedForDestruction[i].onDestroy();
			this.entities.splice(this.entities.indexOf(this._markedForDestruction[i]), 1);
		}

	}

	this.load = function() {
		var parsedLevel = null;
		if (this.levelJSON != "") {
			parsedLevel = JSON.parse(this.levelJSON);
			//console.log(parsedLevel)

			if (parsedLevel.walls) {
				for (let i = 0; i < parsedLevel.walls.length; i++) {
					let newWall = new WallClass(parsedLevel.walls[i]);
					this.walls.push(newWall);
				}
			}

			if (parsedLevel.entities) {
				for (let i = 0; i < parsedLevel.entities.length; i++) {
					let newEntity = new SceneEntity(parsedLevel.entities[i]);
					newEntity.level = this;
					this.entities.push(newEntity);
				}
			}

			if (parsedLevel.playerStart) {
				this.playerStart = parsedLevel.playerStart;
				player.pos.x = this.playerStart.x;
				player.pos.y = this.playerStart.y;
			}

			this.entities.push(player);
		}

		this.onLoad();
		
		populateAudioNodesFromWallEdges(this.walls);
		cullAudioNodesThatDontConnectToPoint(this.playerStart, this.walls);
		player.level = this;

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
}