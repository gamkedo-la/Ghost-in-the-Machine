const PATROL_TIME_MULTIPLE = 4;
const PYRODRONE_ROTATE_SPEED = 10;

class PyroDroneRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);

		this.moveSpeed = 50;
		this.rotateSpeed = PYRODRONE_ROTATE_SPEED;

		this.attackDamage = 100;

		this.sprite = new SpriteClass(
			'./images/fireEnemyFloater.png',
            8, 1,
            579, 452
		);
		this.lastTargetPos = player?.pos;
		this.brain = new PyroDroneBrain(this);
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

class PyroDroneBrain extends Brain {
	#aStarPath = [];
	#patrolingTime = 0;
	#nextPatrolPos = this.pos;

	constructor(body) {
		super(body);

		this.minDistance = 45 + rndFloat(-10.10);
		this.maxDistance = 200 + rndFloat(-50.10);

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
		case "patrol":
			this.statePatrol(deltaTime);
			break;
		case "pursueLastSeen":
			this.statePursueLastSeen(deltaTime);
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
		var goalE = this.lastTargetPos ? this.lastTargetPos : this.#nextPatrolPos;
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
			if (this.dPrFwDv > 0) {
				if (player?.brain.dPrFwDv > 0.5) {
					// flee if player is looking at us
					this.state = "flee";
				} else {
					this.state = "attack";
				}
			} else {
				this.state = "patrol";
			}
		} else if (this.lastTargetPos) {
			const couldSeeLastSpot = lineOfSight(this.pos, this.lastTargetPos, this.level.walls);
			if (couldSeeLastSpot) {
				this.setDirectionVector(this.lastTargetPos);
				this.state = "pursueLastSeen";
			} else {
				this.state = "patrol";
			}
		} else {
			this.state = "patrol";
		}
	}

	stateAttack(deltaTime) {
		this.#aStarPath = [];
		// go back to idle immediately after attack
		this.state = 'idle';

		const couldSeePlayer = lineOfSight(this.pos, player?.pos, this.level.walls);
		if (couldSeePlayer) {
			this.lastTargetPos = { x: player.pos.x, y: player.pos.y };

			this.rotateDelta -= this.dPrRiDv;

			if (this.distance > this.maxDistance) {
				this.moveDelta.x += 1;
				this.rotateDelta += this.turnPreferance * 0.5;
			} else if (player?.brain.dPrFwDv > 0.5) {
				// flee if player is looking at us
				this.state = "flee";
			} else if (this.distance < this.maxDistance &&
				this.distance > this.minDistance
			) {
				this.moveDelta.x += 1;
				this.rotateDelta += this.turnPreferance;
			} else if (this.distance <= this.minDistance) {
				this.triggerAction();
			}
		} else if (this.lastTargetPos) {
			const couldSeeLastSpot = lineOfSight(this.pos, this.lastTargetPos, this.level.walls);
			if (couldSeeLastSpot) {
				this.setDirectionVector(this.lastTargetPos);
				this.state = "pursueLastSeen";
			}
		}
	}

	stateFlee(deltaTime) {
		this.#aStarPath = [];
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

	statePatrol(deltaTime) {
		if (this.#aStarPath.length === 0) {
			let loop = 0;
			const loopMax = ENTITY_PATH_ATTEMPTS;
			const keepLooping = () =>
				this.#aStarPath.length === 0 && loop++ < loopMax;

			do {
				let loop2 = 0;
				const keepLooping2 = () => {
					let x = this.#nextPatrolPos.x;
					let y = this.#nextPatrolPos.y;
					let oob = this.isInBounds({ x, y }) === false;
					return oob && loop2++ < loopMax;
				}

				do {
					// turn 180 and go in other direction
					let dir180 = inverseVector(this.forward);
					let rayEnd = addVectors(this.pos, scaleVector(dir180, 1000));
					let closestIntersection = getClosestIntersection(this.pos, rayEnd, this.level.walls);
					let destNext = closestIntersection ? closestIntersection : rayEnd;
			
					// go to nearest opposite wall point less the radius
					let fwdRadX = Math.sign(this.forward.x) * (1 + this.body.radius);
					let fwdRadY = Math.sign(this.forward.y) * (1 + this.body.radius);
					let moveX = destNext.x + fwdRadX;
					let moveY = destNext.y + fwdRadY;
					this.#nextPatrolPos = { x: moveX, y: moveY };
				} while (keepLooping2());

				this.#aStarPath =
					this.pathFinder.aStarSearch(this.pos, this.#nextPatrolPos).path;
			} while (keepLooping());

			this.#patrolingTime = this.#aStarPath?.length * PATROL_TIME_MULTIPLE ?? 0;
		}

		if (this.#patrolingTime === 0) {
			const nextPatrolChoice = Math.random();
			if (nextPatrolChoice < 0.8) {
				// keep trying current path to the position
				this.#patrolingTime = this.#aStarPath?.length * PATROL_TIME_MULTIPLE ?? 0;
			} else if (nextPatrolChoice < 0.97) {
				// find another path to the same pos
				this.#aStarPath = this.pathFinder.aStarSearch(this.pos, this.#nextPatrolPos).path;
				this.#patrolingTime = this.#aStarPath?.length * PATROL_TIME_MULTIPLE ?? 0;
			} else {
				// start over with a new patrol pos and path
				this.#aStarPath = [];
				this.#patrolingTime = 0;
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
				this.body.rotateSpeed = PYRODRONE_ROTATE_SPEED;
				this.setDirectionVector(nextE);

				if (this.dPrFwDv > 0.999) {
					if (Math.random() < 0.2) {
						// this.moveDelta.x -= this.dPrFwDv;
						this.#patrolingTime += 2;
					} else {
						this.moveDelta.x += this.dPrFwDv;
						this.#patrolingTime += 1;
					}
				} else
				if (this.dPrFwDv > 0.99) {
					if (Math.random() < 0.1) {
						this.moveDelta.x -= this.dPrFwDv;
						this.rotateDelta -= this.dPrRiDv;
						this.#patrolingTime += 2;

						if (Math.random() < 0.5) {
							this.moveDelta.y -= 2;
						} else {
							this.moveDelta.y += 2;
						}
						this.#patrolingTime += 1;
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

			this.#patrolingTime--;
			this.state = "idle";
		}

		// the current position is the next patrol position, so start new path
		const dist = distanceBetweenTwoPoints(this.pos, this.#nextPatrolPos);
		if (dist <= this.body.radius * 2) {
			// start over with a new patrol pos and path
			this.#aStarPath = [];
			this.#patrolingTime = 0;
			this.state = "idle";
		}
	}

	statePursueLastSeen(deltaTime) {
		if (this.lastTargetPos) {
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
							this.#patrolingTime += 2;
						} else {
							this.moveDelta.x += this.dPrFwDv;
							this.#patrolingTime += 1;
						}
					} else
					if (this.dPrFwDv > 0.99) {
						if (Math.random() < 0.1) {
							this.moveDelta.x -= this.dPrFwDv;
							this.rotateDelta -= this.dPrRiDv;
							this.#patrolingTime += 2;
	
							if (Math.random() < 0.5) {
								this.moveDelta.y -= 2;
							} else {
								this.moveDelta.y += 2;
							}
							this.#patrolingTime += 1;
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
	
			// the current position is the next pursue position, so start new path
			const dist = distanceBetweenTwoPoints(this.pos, this.lastTargetPos);
			if (dist <= this.body.radius * 2) {
				// start over with a new pursue pos and path
				this.#aStarPath = [];
				this.lastTargetPos = null;
			}
			this.state = "idle";				
		}
	}
}