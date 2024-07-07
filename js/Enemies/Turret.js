class TurretRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);
		
		this.moveSpeed = 0;
		this.rotateSpeed = 0.7;

		this.sprite = new SpriteClass(
			'./images/blocky-turret.png', 
            12, 1, 
            400, 400
		);

		this.brain = new TurretBrain(this);
	}

	onAction(deltaTime) {
		console.log("Action");
	}
}

class TurretBrain extends Brain {
	constructor(body) {
		super(body);

		this.minDistance = 50 + rndFloat(-10.10);
		this.maxDistance = 150 + rndFloat(-50.10);

		this.turnPreferance = rndFloat(-1, 1);
	}

	think(deltaTime) {
		if (lineOfSight(this.pos, player.pos, this.level.walls)) {
			var directionVector = normalizeVector(subtractVectors(player.pos, this.pos));

			if (dotProductOfVectors(this.forward, directionVector) >= 0) {
				this.rotateDelta -= dotProductOfVectors(this.right, directionVector);
			}

			if (dotProductOfVectors(this.forward, directionVector) > 0.8) {
				this.actionTrigger = true;
			}

		}

	}
}