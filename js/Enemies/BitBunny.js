const FORAGE_TIME_MAX = 15;
const NEXT_FORAGE_DISTANCE = 200;

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
	#aStarPath = [];
	#foragingTime = 0;

	constructor(body) {
		super(body);

		this.minDistance = 50 + rndFloat(-10.10);
		this.maxDistance = 150 + rndFloat(-50.10);

		this.turnPreferance = rndFloat(-1, 1);

		this.state = "flee";
	}

	think(deltaTime) {
		// if (debug) { 
			// console.log("entities.length: ", this.level.entities.length);
			// console.log("aStarPath length: ", this.#aStarPath.length);
			// console.log("first element: ", this.#aStarPath[0]); 
			// console.log("last element: ", this.#aStarPath[this.#aStarPath.length]);
			// console.log("name: ", this.body.name);
			// console.log("pos: ", this.body.pos);
			// console.log("think state in deltaTime", this.state, deltaTime);
		// }

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
		case "forage":
			this.stateForage(deltaTime);
			break;
		}
		// if (debug) { console.log("think state out deltaTime", this.body.name, this.state, deltaTime); }
	}

	draw2D() {
		if (this.#aStarPath.length > 0) {
		colorLine(this.pos.x, this.pos.y, this.#aStarPath[0].x, this.#aStarPath[0].y, 1, "green");
		colorEmptyCircle(this.#aStarPath[0].x, this.#aStarPath[0].y, 3, "green");
		}
	}

	stateIdle(deltaTime) {
		if (lineOfSight(this.pos, player.pos, this.level.walls)) {
			var directionVector = normalizeVector(subtractVectors(player.pos, this.pos));

			if (dotProductOfVectors(this.forward, directionVector) > 0.3) {
				this.state = "attack";
			} else {
				this.state = "forage";
			}
		} else {
			this.state = "forage";
		}
	}

	stateAttack(deltaTime) {
		this.#aStarPath = []; 
		if (lineOfSight(this.pos, player.pos, this.level.walls)) {
			var directionVector = normalizeVector(subtractVectors(player.pos, this.pos));

			if (dotProductOfVectors(this.forward, directionVector) > 0.3) {
				this.rotateDelta -= dotProductOfVectors(this.right, directionVector);

				if (this.distance > this.maxDistance) {
					this.moveDelta.x += 1;
					this.rotateDelta += this.turnPreferance * 0.5;
					this.state = "idle";
				} else if (this.distance < this.minDistance * 2 && this.distance > this.minDistance) {
					this.moveDelta.x -= 1;
					this.rotateDelta += this.turnPreferance;
				}else if (this.distance <= this.minDistance) {
					this.state = "flee"
				}

				this.triggerAction();
			}
		} else {
			this.state = "idle";
		}
	}

	stateFlee(deltaTime) {
		this.#aStarPath = []; 
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

	stateForage(deltaTime) {
		if (this.#aStarPath.length === 0) {
			let forageDirChoices = directionOptions;
			const index = Math.floor(Math.random() * forageDirChoices.length);
			const dir = forageDirChoices[index];
			const col = dir.col;
			const row = dir.row;
			const dist = Math.floor(Math.random() * NEXT_FORAGE_DISTANCE);
			const nextPos = { 
				x: this.pos.x + dist * col, 
				y: this.pos.y + dist * row 
			};
			this.#aStarPath = aStarSearch(this.pos, nextPos).path;
		}

		if (this.#aStarPath && 
			this.#aStarPath.length > 0 && 
			lineOfSight(this.pos, this.#aStarPath[0], this.level.walls) &&
			this.#foragingTime === 0
		) {	
			// if (debug) { 
				// console.log("aStarPath length: ", this.#aStarPath.length);
				// console.log("first element: ", this.#aStarPath[0]); 
				// console.log("last element: ", this.#aStarPath[this.#aStarPath.length - 1]);
			// }
			var directionVector = 
				normalizeVector(subtractVectors(this.#aStarPath[0], this.pos));
			this.rotateDelta -= dotProductOfVectors(this.right, directionVector);
			this.rotateDelta += this.turnPreferance;
			this.moveDelta.x += 0.1;
			this.#aStarPath.unshift();
		}

		if (this.#foragingTime-- <= 0) {
			this.#foragingTime = Math.ceil(Math.random() * FORAGE_TIME_MAX);
		}

		this.state = "idle";
	}
}