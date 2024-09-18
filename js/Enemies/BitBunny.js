const LONG_FORAGE_DISTANCE = 200;
const SHORT_FORAGE_DISTANCE = 5;
const FORAGE_TIME_MAX = LONG_FORAGE_DISTANCE;
const FORAGE_TIME_MULTIPLE = 4;
const BITBUNNY_ROTATE_SPEED = 1.2;
const BITBUNNY_FORAGE_ROTATE_SPEED = 4;

class BitBunnyRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);

		this.moveSpeed = 40;
		this.rotateSpeed = BITBUNNY_ROTATE_SPEED;

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
	#nextForagePos = this.pos;

	constructor(body) {
		super(body);

		this.minDistance = 50 + rndFloat(-10.10);
		this.maxDistance = 150 + rndFloat(-50.10);

		this.turnPreferance = rndFloat(-1, 1);

		this.state = "idle";
	}

	think(deltaTime) {
		// if (debug && this.name === 'testBunny1') {
		// 	console.log("entities.length: ", this.level.entities.length);
		// 	console.log("aStarPath length: ", this.#aStarPath.length);
		// 	console.log("first element: ", this.#aStarPath[0]);
		// 	console.log("base element: ", this.#aStarPath[this.#aStarPath.length - 1]);
		// 	console.log("name: ", this.name);
		// 	console.log("pos: ", this.pos);
		// 	console.log("think state in deltaTime", this.state, deltaTime);
		// }
		this.setDirectionVector(player?.pos);
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
		case "pursueLastSeen":
			this.statePursue(deltaTime);
			break;
		default:
			this.stateIdle(deltaTime);
			break;
		}
	}

	draw2D() {
		var nextI = this.#aStarPath.length - 1;
		if (nextI < 0) { return; }

		var lastX = this.pos.x;
		var lastY = this.pos.y;
		colorEmptyCircle(lastX, lastY, 3, "green");
		var nextE = this.#aStarPath[nextI];
		var goalE = this.lastTargetPos ? this.lastTargetPos : this.#nextForagePos;
		colorEmptyCircle(goalE.x, goalE.y, 3, "magenta");
		colorLine(lastX, lastY, goalE.x, goalE.y, 1, "magenta");
		colorLine(nextE.x, nextE.y, goalE.x, goalE.y, 1, "yellow");
		for (let i = nextI; i > 0; i--) {
			colorLine(lastX, lastY, this.#aStarPath[i].x, this.#aStarPath[i].y, 1, "green");
			lastX = this.#aStarPath[i].x;
			lastY = this.#aStarPath[i].y;
		}
	}

	stateIdle(deltaTime) {
		const couldSeePlayer = lineOfSight(this.pos, player?.pos, this.level.walls);
		if (couldSeePlayer) {
			if (this.dPrFwDv > 0.3) {
				this.state = "attack";
			} else {
				this.state = "forage";
			}
		} else if (this.lastTargetPos) {
			this.state = 'pursueLastSeen'
		} else {
			this.state = "forage";
		}
	}

	stateAttack(deltaTime) {
		this.#aStarPath = [];
		this.body.rotateSpeed = BITBUNNY_ROTATE_SPEED;
		const couldSeePlayer = lineOfSight(this.pos, player?.pos, this.level.walls);
		if (couldSeePlayer) {
			this.lastTargetPos = { x: player.pos.x, y: player.pos.y };
			
			if (this.dPrFwDv > 0.3) {
				this.rotateDelta -= this.dPrRiDv;

				if (this.distance > this.maxDistance) {
					this.moveDelta.x += 1;
					this.rotateDelta += this.turnPreferance * 0.5;
				} else if (this.distance < this.minDistance * 2 &&
					this.distance > this.minDistance
				) {
					this.moveDelta.x -= 1;
					this.rotateDelta += this.turnPreferance;
				} else if (this.distance <= this.minDistance) {
					this.state = "flee";
				}

				this.triggerAction();
			}
		} else if (this.lastTargetPos) {
			this.state = 'pursueLastSeen'
		} else {
			this.state = 'idle';
		}
	}

	stateFlee(deltaTime) {
		this.#aStarPath = [];
		this.body.rotateSpeed = BITBUNNY_ROTATE_SPEED;
		if (this.distance < this.maxDistance) {
			this.rotateDelta += this.dPrRiDv;
			this.rotateDelta += this.turnPreferance * 0.5;
			this.moveDelta.x -= this.dPrFwDv;
		} else {
			this.rotateDelta -= this.dPrRiDv;
			this.moveDelta.x += 0.1;
			if (this.dPrFwDv > 0.5) {
				this.state = "idle";
			}
		}
	}

	stateForage(deltaTime) {
		if (this.#aStarPath.length === 0) {
			const forageDirChoices = directionOptions;
			const dirCount = forageDirChoices.length;
			let loop = 0;
			const loopMax = 10;
			const keepLooping = () =>
				this.#aStarPath.length === 0 && loop++ < loopMax;

			do {
				let loop2 = 0;
				const keepLooping2 = () => {
					let x = this.#nextForagePos.x;
					let y = this.#nextForagePos.y;
					let oob = this.isInBounds({ x, y }) === false;
					return oob && loop2++ < loopMax;
				}

				do {
					// grab a random direction, skip first element
					const index = Math.floor(Math.random() * (dirCount - 1)) + 1;
					const dir = forageDirChoices[index];
					const col = dir.col * 1;
					const row = dir.row * 1;

					let rndDistOption = Math.random() > 0.3;
					const distNext =
					    Math.random() *
						Math.floor(
							rndDistOption ?
								SHORT_FORAGE_DISTANCE :
								LONG_FORAGE_DISTANCE);

					this.#nextForagePos = {
						x: this.pos.x + distNext * col,
						y: this.pos.y + distNext * row
					};
				} while (keepLooping2());

				this.#aStarPath =
					this.pathFinder.aStarSearch(this.pos, this.#nextForagePos).path;
			} while (keepLooping());

			this.#foragingTime = this.#aStarPath?.length * FORAGE_TIME_MULTIPLE ?? 0;
		}

		if (this.#foragingTime === 0) {
			const nextForageChoice = Math.random();
			if (nextForageChoice < 0.8) {
				// keep trying current path to the position
				this.#foragingTime = this.#aStarPath?.length * FORAGE_TIME_MULTIPLE ?? 0;
				// this.#foragingTime++;
			} else if (nextForageChoice < 0.97) {
				// find another path to the same pos
				this.#aStarPath = this.pathFinder.aStarSearch(this.pos, this.#nextForagePos).path;
				this.#foragingTime = this.#aStarPath?.length * FORAGE_TIME_MULTIPLE ?? 0;
			} else {
				// start over with a new forage pos and path
				this.#aStarPath = [];
				this.#foragingTime = 0;
				this.state = "idle";
				return;
			}
		}

		const nextI = this.#aStarPath.length - 1;
		const nextE = nextI >= 0 ? this.#aStarPath[nextI] : null;
		if (nextE) {
			const canSeeNextPos =
				lineOfSight(this.pos, nextE, this.level.walls);

			if (this.#aStarPath &&
				this.#aStarPath.length > 0 &&
				canSeeNextPos
			) {
				this.body.rotateSpeed = BITBUNNY_FORAGE_ROTATE_SPEED;
				this.setDirectionVector(nextE);

				if (this.dPrFwDv > 0.999) {
					if (Math.random() < 0.2) {
						// this.moveDelta.x -= this.dPrFwDv;
						this.#foragingTime += 2;
					} else {
						this.moveDelta.x += this.dPrFwDv;
						this.#foragingTime += 1;
					}
				} else
				if (this.dPrFwDv > 0.99) {
					if (Math.random() < 0.1) {
						this.moveDelta.x -= this.dPrFwDv;
						this.rotateDelta -= this.dPrRiDv;
						this.#foragingTime += 2;

						if (Math.random() < 0.5) {
							this.moveDelta.y -= 2;
						} else {
							this.moveDelta.y += 2;
						}
						this.#foragingTime += 1;
					} else {
						this.moveDelta.x += this.dPrFwDv;
						this.rotateDelta += this.dPrRiDv;
					}
				} else {
					// this.moveDelta.x -= 1;
					if (this.dPrFwDv > 0.9) {
						this.rotateDelta += this.dPrRiDv;
						// this.rotateDelta += this.turnPreferance * 0.5;
					} else if (this.dPrFwDv > 0) {
						this.rotateDelta += this.turnPreferance;
					} else {
						// this.rotateDelta -= this.turnPreferance;
					}
				}
				this.rotateDelta = -this.dPrRiDv;

				const closeEnough =
					distanceBetweenTwoPoints(this.pos, nextE) <= this.body.radius;
				if (closeEnough) {
					// once entity finds it's first path step, drop it, choose next
					// making it the first (ie. located at index 0) or emptying the
					// path completely
					this.#aStarPath.pop();
				}
			}

			this.#foragingTime--;
			this.state = "idle";
		}

		// the current position is the next forage position, so start new path
		const dist = distanceBetweenTwoPoints(this.pos, this.#nextForagePos);
		if (dist <= this.body.radius * 2) {
			// start over with a new forage pos and path
			this.#aStarPath = [];
			this.#foragingTime = 0;
			this.state = "idle";
		}
	}

	statePursue(deltaTime) {
		if (this.#aStarPath.length === 0) {
			this.#aStarPath =
				this.pathFinder.aStarSearch(this.pos, this.lastTargetPos).path;
		}

		const nextI = this.#aStarPath.length - 1;
		const nextE = nextI >= 0 ? this.#aStarPath[nextI] : null;
		if (nextE) {
			const canSeeNextPos =
				lineOfSight(this.pos, nextE, this.level.walls);

			if (this.#aStarPath &&
				this.#aStarPath.length > 0 &&
				canSeeNextPos
			) {
				this.setDirectionVector(nextE);

				if (this.dPrFwDv > 0.999) {
					if (Math.random() < 0.2) {
						// this.moveDelta.x -= this.dPrFwDv;
						this.#foragingTime += 2;
					} else {
						this.moveDelta.x += this.dPrFwDv;
						this.#foragingTime += 1;
					}
				} else
				if (this.dPrFwDv > 0.99) {
					if (Math.random() < 0.1) {
						this.moveDelta.x -= this.dPrFwDv;
						this.rotateDelta -= this.dPrRiDv;
						this.#foragingTime += 2;

						if (Math.random() < 0.5) {
							this.moveDelta.y -= 2;
						} else {
							this.moveDelta.y += 2;
						}
						this.#foragingTime += 1;
					} else {
						this.moveDelta.x += this.dPrFwDv;
						this.rotateDelta += this.dPrRiDv;
					}
				} else {
					// this.moveDelta.x -= 1;
					if (this.dPrFwDv > 0.9) {
						this.rotateDelta += this.dPrRiDv;
						// this.rotateDelta += this.turnPreferance * 0.5;
					} else if (this.dPrFwDv > 0) {
						this.rotateDelta += this.turnPreferance;
					} else {
						// this.rotateDelta -= this.turnPreferance;
					}
				}
				this.rotateDelta = -this.dPrRiDv;

				const closeEnough =
					distanceBetweenTwoPoints(this.pos, nextE) <= this.body.radius;
				if (closeEnough) {
					this.#aStarPath.pop();
				}
			}
		}

		// the current position is the next forage position, so start new path
		const dist = distanceBetweenTwoPoints(this.pos, this.lastTargetPos);
		if (dist <= this.body.radius * 2) {
			// start over with a new forage pos and path
			this.#aStarPath = [];
			this.lastTargetPos = null;
		}
		this.state = "idle";
	}
}