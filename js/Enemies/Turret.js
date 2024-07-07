class TurretRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);
		
		this.moveSpeed = 0;
		this.rotateSpeed = 0.7;
		this.actionCooldownTime = 3.5;

		this.sprite = new SpriteClass(
			'./images/blocky-turret.png', 
            12, 1, 
            400, 400
		);

		this.brain = new TurretBrain(this);
	}

	onAction(deltaTime) {
		let shot = new TurretShot({name: this.name + " shot", pos:this.pos, rot:this.rot, level: this.level});
		this.level.entities.push(shot);
	}
}

class TurretBrain extends Brain {
	constructor(body) {
		super(body);
	}

	think(deltaTime) {
		if (lineOfSight(this.pos, player.pos, this.level.walls)) {
			var directionVector = normalizeVector(subtractVectors(player.pos, this.pos));
			var dotProduct = dotProductOfVectors(this.forward, directionVector);

			if (dotProduct >= 0) {
				this.rotateDelta -= dotProductOfVectors(this.right, directionVector);
			}

			if (dotProduct > 0.9) {
				this.triggerAction();
			}

		}

	}
}

class TurretShot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);
		
		this.moveSpeed = 40;
		this.rotateSpeed = 1;

		this.maxHealth = 1;
		this.health = this.maxHealth;

		this.sprite = new SpriteClass(
			'./images/testEntitySS.png', 
            8, 6, 
            100, 100
		);
		this.sprite.xScale = 0.25;
		this.sprite.yScale = 0.20;
	}

	onUpdatePre(deltaTime) {
		this.moveDelta.x = 1;
	}

	onCollision() {
		this.level.markForDestruction(this);
	}

	onDestroy() {
		//Explosion code
		sparksFX(this.pos.x,this.pos.y,15);
	}
}