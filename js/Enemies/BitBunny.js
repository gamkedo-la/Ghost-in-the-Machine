class BitBunnyRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);
		
		this.moveSpeed = 40;
		this.rotateSpeed = 1.2;

		this.attackDamage = 10;

		this.sprite = new SpriteClass(
			'./images/cubeRobotSS.png', 
            12, 1, 
            400, 400
		);

		this.brain = new BitBunnyBrain(this);
	}

	onAction(deltaTime) {
		let rayEnd = addVectors(this.pos, scaleVector(this.forward, 200));
		let closestIntersection = getClosestIntersection(this.pos, rayEnd, this.level.walls);
		let maxDistance = closestIntersection ? distanceBetweenTwoPoints(closestIntersection, this.pos) : 200;
		let closestEntity = null;
		let distance = maxDistance;
		//console.log("Max Distance: " + maxDistance);
		for (let i = 0; i < this.level.entities.length; i++) {
			let entity = this.level.entities[i];

			if (this.level.entities[i] == this) continue;

			let nearestPoint = getNearestPointOnLine(this.pos, rayEnd, entity.pos);
			let distanceFromPoint = distanceBetweenTwoPoints(entity.pos, nearestPoint);

			if (distanceFromPoint < entity.radius) {
				let newDistance = distanceBetweenTwoPoints(this.pos, entity.pos);
				if (newDistance < distance) {
					closestEntity = entity;
					distance = newDistance;
				}
			}
		}

		if (closestEntity == null) return;

		closestEntity.takeDamage((1 - distance/maxDistance) * this.attackDamage);
		sparksFX(this.pos.x,this.pos.y,1);
		sparksFX(closestEntity.pos.x,closestEntity.pos.y,1);
	}
}

class BitBunnyBrain extends Brain {
	constructor(body) {
		super(body);

		this.minDistance = 50 + rndFloat(-10.10);
		this.maxDistance = 150 + rndFloat(-50.10);

		this.turnPreferance = rndFloat(-1, 1);

		this.state = "flee";
	}

	think(deltaTime) {
		switch(this.state) {
		case "idle":
			this.stateIdle(deltaTime);
			break;
		case "attack":
			this.stateAttack(deltaTime);
			break;
		case "flee":
			this.stateFlee(deltaTime);
			break;
		}
	}

	stateIdle(deltaTime) {
		if (lineOfSight(this.pos, player.pos, this.level.walls)) {
			var directionVector = normalizeVector(subtractVectors(player.pos, this.pos));

			if (dotProductOfVectors(this.forward, directionVector) > 0.3) {
				this.state = "attack";
			}
		}
	}

	stateAttack(deltaTime) {
		if (lineOfSight(this.pos, player.pos, this.level.walls)) {
			var directionVector = normalizeVector(subtractVectors(player.pos, this.pos));

			if (dotProductOfVectors(this.forward, directionVector) > 0.3) {
				this.rotateDelta -= dotProductOfVectors(this.right, directionVector);

				if (this.distance > this.maxDistance) {
					this.moveDelta.x += 1;
					this.rotateDelta += this.turnPreferance * 0.5;
				} else if (this.distance < this.minDistance * 2 && this.distance > this.minDistance) {
					this.moveDelta.x -= 1;
					this.rotateDelta += this.turnPreferance;
				}else if (this.distance <= this.minDistance) {
					this.state = "flee"
				}

				this.triggerAction();
			}
		}
	}

	stateFlee(deltaTime) {
		var directionVector = normalizeVector(subtractVectors(player.pos, this.pos));
		if (this.distance < this.maxDistance) {
			this.rotateDelta += dotProductOfVectors(this.right, directionVector);
			this.rotateDelta += this.turnPreferance * 0.5;
			this.moveDelta.x -= dotProductOfVectors(this.forward, directionVector);
		} else {
			this.rotateDelta -= dotProductOfVectors(this.right, directionVector);
			this.moveDelta.x += 0.1;
			if (dotProductOfVectors(this.forward, directionVector) > 0.5) {
				this.state = "idle";
			}
		}
	}
}