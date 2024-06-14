const DEBUG_TEST_ENEMY = true;

function LevelClass() {
	this.playerStart = {x:0, y:0};
	this.walls = [];
	this.entities = [];
	this.levelJSON = "{}";
	this.topColor = "lightgrey";
	this.bottomColor = "gray";

	this.update = function(deltaTime) {
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].update(deltaTime);
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
			}

			if (parsedLevel.topColor) {
				this.topColor = parsedLevel.topColor;
			}
			
			if (parsedLevel.bottomColor) {
				this.bottomColor = parsedLevel.bottomColor;
			}
		}

        // FIXME: this is just to test the new robot spritesheet!
        // TODO: tie into level editor + parsing above
        // TODO: create Enemy class that inherits SceneEntity
        if (DEBUG_TEST_ENEMY) {
            console.log("DEBUG: adding an enemy to the world");
            let newEnemy = new SceneEntity({pos:{x:50,y:50}},'./images/shadow.png','./images/cubeRobotSS.png',12,1,400,400);
            newEnemy.level = this;
            this.entities.push(newEnemy);
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
	}

	this.onLoad = function() {}
	this.onUnload = function() {}
}