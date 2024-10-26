const PYRODRONE_PATROL_TIME_MULTIPLE = 4;
const PYRODRONE_PURSUE_TIME_MULTIPLE = 5;
const PYRODRONE_ROTATE_SPEED = 5;

class PyroDroneRobot extends SceneEntity {
	constructor(entityToOverride = {}) {
		super(entityToOverride);

		this.moveSpeed = 20;
		this.rotateSpeed = PYRODRONE_ROTATE_SPEED;

		this.attackDamage = 100;

		this.sprite = new SpriteClass(
			'./images/fireEnemyFloater.png',
            8, 1,
            579, 452
		);
		this.brain = new PyroDroneBrain(this);
	}

	onAction(deltaTime) {
		let blast = new PyroBlast({name: this.name + " fire blast", rot:this.rot, level: this.level, parent: this});
		blast.pos = addVectors(this.pos, scaleVector(this.forward, this.radius + blast.radius + 1));
		this.level.entities.push(blast);
	}
}

class PyroDroneBrain extends Brain {
	#aStarPath = [];
	#patrolingTime = 0;
	#pursuingTime = 0;
	#nextPatrolPos = this.pos;

	constructor(body) {
		super(body);

		// 180 degrees in front (90 deg per side) = 0 fovThreshold
		this.fovThreshold = 0.9;

		this.minDistanceHunt = this.body.radius * 2;
		this.maxDistanceHunt = 50 + rndFloat(-5, 25) ;
		this.minDistanceSafe = 75 + rndFloat(-10, 10);
		this.maxDistanceSafe = 175 + rndFloat(-50, 10);

		this.turnPreferance = rndFloat(-1, 1);

		this.state = "idle";
	}

	think(deltaTime) {
		super.think(deltaTime);
		// if (debug) { console.log("bef: name, state", this.name, this.state); }

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
		// case "pursue":
		// 	this.statePursue(deltaTime);
		// 	break;
		default:
			this.stateIdle(deltaTime);
			break;
		}
		// if (debug) { console.log("aft: name, state", this.name, this.state); }
	}

	draw2D() {
		var nextI = this.#aStarPath.length - 1;
		if (nextI < 0) { return; }

		var lastX = this.pos.x;
		var lastY = this.pos.y;
		colorEmptyCircle(lastX, lastY, 3, "green");
		var nextE = this.#aStarPath[nextI];
		var goalE = this.lastTarget ? this.lastTarget?.pos : this.#nextPatrolPos;
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
		this.state = "patrol";

		if (this.canSeePlayer) {
			// is player looking at us?
			if (this.targetSeesUs &&
				this.distance <= this.minDistance
			) {
				this.state = "flee";
			} else {
				this.state = "attack";
			}
		// } else if (this.lastTarget) {
		// 	this.setDirectionVector(this.lastTarget.pos);
		// 	this.state = "pursue";
		}
	}

	stateAttack(deltaTime) {
		this.#aStarPath = [];
		this.#patrolingTime = 0;
		this.#pursuingTime = 0;

		if (this.canSeePlayer) {
			if (this.distance > this.minDistance) {
				this.moveDelta.x += this.dPrFwDv;
				this.rotateDelta -= this.dPrRiDv;
			} else if (this.distance <= this.minDistance) {
				if (this.targetSeesUs) {
					this.state = "flee";
				} else if (this.distance <= this.minDistanceSafe) {
					this.triggerAction();
				}
			}
		// } else if (this.lastTarget) {
		// 	this.setDirectionVector(this.lastTarget.pos);
		// 	this.state = "pursue";
		} else {
			this.state = 'idle'
		}
	}

	stateFlee(deltaTime) {
		this.#aStarPath = [];
		this.#patrolingTime = 0;
		this.#pursuingTime = 0;

		if (this.distance < this.maxDistance) {
			this.rotateDelta += this.dPrRiDv;
			this.rotateDelta += this.turnPreferance * 0.5;
			this.moveDelta.x -= this.dPrFwDv;
		} else if (this.distance > this.maxDistance) {
			this.rotateDelta -= this.dPrRiDv;
			this.moveDelta.x += this.dPrFwDv;
			this.setDirectionVector(this.lastTarget?.pos);
			this.state = "idle";
		}
	}

	statePatrol(deltaTime) {
		if (this.#aStarPath.length === 0 ||
			this.#pursuingTime > 0
		) {
			this.#aStarPath = [];
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

			this.#patrolingTime = this.#aStarPath?.length * PYRODRONE_PATROL_TIME_MULTIPLE ?? 0;
			this.#pursuingTime = 0;
		}

		if (this.#patrolingTime <= 0) {
			const nextTimerChoice = Math.random();
			if (nextTimerChoice < 0.8) {
				// keep trying current path to the position
				this.#patrolingTime = this.#aStarPath?.length * PYRODRONE_PATROL_TIME_MULTIPLE ?? 0;
			} else if (nextTimerChoice < 0.97) {
				// find another path to the same pos
				this.#aStarPath = this.pathFinder.aStarSearch(this.pos, this.#nextPatrolPos).path;
				this.#patrolingTime = this.#aStarPath?.length * PYRODRONE_PATROL_TIME_MULTIPLE ?? 0;
			} else {
				// start over with a new patrol pos and path
				this.#aStarPath = [];
				this.#patrolingTime = 0;
				this.state = "idle";
				return;
			}
		}

		const nextI = this.#aStarPath?.length - 1;
		const nextE = nextI >= 0 ? this.#aStarPath[nextI] : null;
		if (nextE) {
			const canSeeNextPos =
				lineOfSight(this.pos, nextE, this.level.walls);

			if (canSeeNextPos) {
				this.setDirectionVector(nextE);
				
				if (this.dPrFwDv > 0.999) {
					this.moveDelta.x += this.dPrFwDv;
				} else if (Math.random() > 0.9) {
					this.moveDelta.x -= this.dPrFwDv;
					this.rotateDelta += this.dPrRiDv;

					if (Math.random() < 0.5) {
						this.moveDelta.y -= 2;
					} else {
						this.moveDelta.y += 2;
					}

					this.#patrolingTime += 2;
				// } else if (this.dPrFwDv > 0) {
				// 	this.moveDelta.x += this.dPrFwDv;
				// 	this.rotateDelta -= this.dPrRiDv; 
				} else if (this.dPrFwDv >= 0) {
					this.rotateDelta -= this.dPrRiDv; 

					this.#patrolingTime += 1;
				} else if (this.dPrFwDv > -1) {
					if (this.dPrRiDv > 0) { 
						this.rotateDelta -= 2 - this.dPrRiDv;
					} else { 
						this.rotateDelta -= 2 + this.dPrRiDv;
					}

					this.#patrolingTime += 1;
				} else {
					this.rotateDelta += 2 * this.turnPreferance;

					this.#patrolingTime += 1;
				} 

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

	statePursue(deltaTime) {
		if (this.lastTarget?.pos) {
			if (this.#aStarPath.length === 0 ||
				this.#patrolingTime > 0
			) {
				this.#aStarPath =
					this.pathFinder.aStarSearch(this.pos, this.lastTarget.pos).path;
				this.#pursuingTime = 
					this.#aStarPath?.length * PYRODRONE_PURSUE_TIME_MULTIPLE ?? 0;
				this.#patrolingTime = 0;
			}
	
			if (this.#pursuingTime <= 0) {
				const nextTimerChoice = Math.random();
				if (nextTimerChoice > 0.95) {
					// find another path to the same pos
					this.#aStarPath = this.pathFinder.aStarSearch(this.pos, this.#nextPatrolPos).path;
					this.#pursuingTime = this.#aStarPath?.length * PYRODRONE_PURSUE_TIME_MULTIPLE ?? 0;
				} else if (nextTimerChoice > 0.05) {
					// keep trying current path to the position
					this.#pursuingTime = this.#aStarPath?.length * PYRODRONE_PURSUE_TIME_MULTIPLE ?? 0;
				} else {
					// start over with a new patrol pos and path
					this.#aStarPath = [];
					this.#pursuingTime = 0;
					this.state = "idle";
					return;
				}
			}
		
			const nextI = this.#aStarPath.length - 1;
			const nextE = nextI >= 0 ? this.#aStarPath[nextI] : null;
			if (nextE) {
				const canSeeNextPos =
					lineOfSight(this.pos, nextE, this.level.walls);
	
				if (this.#aStarPath?.length > 0 && canSeeNextPos
				) {
					this.setDirectionVector(nextE);
	
					if (this.dPrFwDv > 0.999) {
						this.moveDelta.x += this.dPrFwDv;
					} else if (this.dPrFwDv > 0.9) {
						this.moveDelta.x += this.dPrFwDv;
						this.rotateDelta -= this.dPrRiDv;
					} else if (this.dPrFwDv > -0.9) {
						this.rotateDelta -= this.dPrRiDv;
						this.#pursuingTime += 1;
					} else {
						this.rotateDelta += this.turnPreferance;
						this.#pursuingTime += 2;
					}
	
					const closeEnough =
						distanceBetweenTwoPoints(this.pos, nextE) <= this.body.radius;
					if (closeEnough) {
						this.#aStarPath.pop();
					}
				}

				this.#pursuingTime--;
			}
	
			// the current position is the next pursue position, so start new path
			const dist = distanceBetweenTwoPoints(this.pos, this.lastTarget.pos);
			if (dist <= this.body.radius * 2) {
				// start over with a new pursue pos and path
				this.#aStarPath = [];
				this.#pursuingTime = 0;
				this.lastTarget = null;
			}
		}
		this.state = "idle";				
	}
}

class PyroBlast extends TurretShot {
	// Attempting to subclass TurretShot class in Turret.js by Michael Fewkes, Christer Kaitila, and possibly others
	constructor(entityToOverride = {}) {
		super(entityToOverride);
			
		this.moveSpeed = 100;
		this.maxHealth = 100;
		this.health = this.maxHealth;
		this.explosionDamage = 100;
		this.range = 20;
		this.parent = entityToOverride.parent || null;

		this.sprite = new SpriteClass(
			'./images/fireSpritesheet.png', 
            1, 1, 
            600, 400
		);
		this.radius = 4;
		this.lifeSpan = 250;
 	}

	onUpdatePre(deltaTime) {
		this.moveDelta.x = 2;
	}

	onDestroy(deltaTime) {
		super.onDestroy(deltaTime);
	}

}