class BitBunnyRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);
		
		this.moveSpeed = 50;
		this.rotateSpeed = 1.2;

		this.sprite = new SpriteClass(
			'./images/cubeRobotSS.png', 
            12, 1, 
            400, 400
		);

		this.brain = new BitBunnyBrain(this);
	}

	onAction(deltaTime) {
		console.log("Action");
	}
}

class BitBunnyBrain extends Brain {
	constructor(body) {
		super(body);

		this.minDistance = 50;
		this.maxDistance = 200;
	}

	think(deltaTime) {
		if (lineOfSight(this.pos, player.pos, this.level.walls)) {
			var directionVector = normalizeVector(subtractVectors(player.pos, this.pos));

			if (dotProductOfVectors(this.forward, directionVector) > 0.7) {
				this.rotateDelta -= dotProductOfVectors(this.right, directionVector);

				if (this.distance > this.maxDistance) {
					this.moveDelta.x += 1;
				} else if (this.distance < this.minDistance) {
					this.moveDelta.x -= 1;
				}

				this.actionTrigger = true;
			}

		}

	}
}