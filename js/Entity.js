const ENTITY_ROTATE_SPEED = 2;
const ENTITY_PATH_ATTEMPTS = 10;
// 60 degrees forward in FOV; where 30 deg on each side = 90 deg * 1/3
const ENTITY_FOV_ALIGNMENT_THRESHOLD = 0.67;

class EntityClass {
	constructor(entityToOverride = {}) {
		this.name = entityToOverride.name || "";
		this.pos = entityToOverride.pos ? {x:entityToOverride.pos.x, y:entityToOverride.pos.y} : {x:0, y:0};
		this.rot = entityToOverride.rot || d270;
		this.forward = {x:0, y:0};
		this.forward.x = Math.cos(this.rot);
		this.forward.y = Math.sin(this.rot);
		this.right = {x:0, y:0};
		this.right.x =  this.forward.y;
		this.right.y = -this.forward.x;
		this.radius = 5;
		this.moveSpeed = 20;
		this.rotateSpeed = 2;
		this.moveDelta = {x:0, y:0};
		this.rotateDelta = 0;
		this.actionTriggered = false;
		this.level = entityToOverride.level || null;
		this.distance = Infinity;

		this.maxHealth = entityToOverride.maxHealth || 50;
		this.health = this.maxHealth;

		this.actionCooldownTime = 1.5;
		this._actionCooldown = this.actionCooldownTime;

		this.pathFinder = new PathFindingComponent(this);

		this.brain = entityToOverride.brain || new Brain(this);
	}

	get x() {return this.pos.x;}
	get y() {return this.pos.y;}

	onCollisionWall() {}
	onCollisionEntity(other) {}
	onUpdatePre(deltaTime) {}
	onUpdatePost(deltaTime) {}
	update(deltaTime) {
		this.onUpdatePre(deltaTime);

		this.brain.think(deltaTime);

		this._actionCooldown -= deltaTime;
		if (this._actionCooldown <= 0 && this.actionTriggered) {
			this.action(deltaTime);
			this._actionCooldown = this.actionCooldownTime;
		} else if (this._actionCooldown > 0.05) {
			this.actionTriggered = false;
		}

		//update rotation
		this.rot += this.rotateDelta * this.rotateSpeed * deltaTime;
		if (this.rot > 2*pi) this.rot -= 2*pi;
		if (this.rot < 0) this.rot += 2*pi;

		//calculate forward vector
		this.forward.x = Math.cos(this.rot);
		this.forward.y = Math.sin(this.rot);
		this.right.x =  this.forward.y;
		this.right.y = -this.forward.x;

		//apply movement
		this.moveDelta = normalizeVector(this.moveDelta);
		var deltaX = 0;
		var deltaY = 0;
		//forward back movement
		deltaX += this.forward.x * this.moveSpeed * this.moveDelta.x;
		deltaY += this.forward.y * this.moveSpeed * this.moveDelta.x;
		//left right movement
		deltaX -= this.forward.y * this.moveSpeed * this.moveDelta.y;
		deltaY += this.forward.x * this.moveSpeed * this.moveDelta.y;

		deltaX *= deltaTime;
		deltaY *= deltaTime;

		//collision checking
		if (this.moveDelta.y != 0 || this.moveDelta.x != 0) {
			for (var i in this.level.entities) {
				const ent = this.level.entities[i];
				if (ent == this) continue;
				ent.brain.setDirectionVector(this.pos);

				const distApart =
					distanceBetweenTwoPoints(
						this.pos, ent.pos);

				if (distApart < this.radius + ent.radius) {
					//deltaX += ent.brain.directionVector.x * distApart;
					//deltaY += ent.brain.directionVector.y * distApart;
		  
					// Get penetration vector
					var pDirection = normalizeVector(subtractVectors(this.pos, ent.pos));
					var pMagnitude = (this.radius + ent.radius) - distApart;
					var pVector = scaleVector(pDirection, pMagnitude);
		  
					// Move entity out of collision
					deltaX += pVector.x;
					deltaY += pVector.y;

					// deltaX *= Math.floor(Math.random() * 3) - 1;
					// deltaY *= Math.floor(Math.random() * 3) - 1;
					this.onCollisionEntity(ent);
					break;
				}
			}

			var newPos = {x:this.pos.x + deltaX, y:this.pos.y + deltaY};
			let wallCollisions = 0;
			for (var i in this.level.walls) {
				const nearestPoint = getNearestPointOnLine(this.level.walls[i].p1, this.level.walls[i].p2, newPos);
				if (distanceBetweenTwoPoints(nearestPoint, newPos) < this.radius) {
					// Collide and Slide
					deltaX = 0;
					deltaY = 0;
					this.onCollisionWall();
					break;

					const toLineVec = subtractVectors(nearestPoint, newPos);
					if (toLineVec.x !== 0) { deltaX = 0; }
					if (toLineVec.y !== 0) { deltaY = 0; }
				}
			}
		}

		this.pos.x += deltaX;
		this.pos.y += deltaY;

		//housekeeping
		this.distance = distanceBetweenTwoPoints(this.pos, player.pos);
		this.rotateDelta = 0;
		this.moveDelta.x = 0;
		this.moveDelta.y = 0;

		this.onUpdatePost(deltaTime);
	}

	onAction(deltaTime) {};
	action(deltaTime) {
		this.onAction(deltaTime);
		this.actionTriggered = false;
	};
	triggerAction() {
		this.actionTriggered = true;
	}

	onTakeDamage(amount) {}
	takeDamage(amount) {
		this.health -= amount;
		this.onTakeDamage(amount);

		if (this.health <= 0) {
			this.destroy();
		};
	}

	onDestroy() {}
	destroy() {
		this.level.markForDestruction(this);
	}

	draw2D() {
		colorLine(this.pos.x, this.pos.y, this.pos.x + this.forward.x * (this.radius + 3), this.pos.y +this.forward.y * (this.radius + 3), 2, "white");
		colorEmptyCircle(this.pos.x, this.pos.y, this.radius, "grey");

		// add coordinate helper at center 0, 0
		if (debug) {
			let colorLf = "cyan";
			let colorRt = "orange";
			let colorUp = "yellow";
			let colorDn = "violet";
			let colorNo = "none";
			let colorLR = this.pos.x < 0 ? colorLf : this.pos.x > 0 ? colorRt : colorNo;
			let colorUD = this.pos.y < 0 ? colorUp : this.pos.y > 0 ? colorDn : colorNo;
			colorLine(0, this.pos.y, this.pos.x, this.pos.y, 1, colorLR);
			colorLine(this.pos.x, 0, this.pos.x, this.pos.y, 1, colorUD);
		}

		if (this.brain.draw2D != undefined) {
			this.brain.draw2D();
		}
	}

	draw3D() {}
}

class SceneEntity extends EntityClass {
	constructor(entityToOverride = {}) {
		super(entityToOverride);

		this._shadowImage = new Image();
		this._shadowImage.src = './images/shadow.png';

		this.sprite = new SpriteClass(
			'./images/testEntitySS.png',
			8, 6,
			100, 100
		);
	}

	draw3D() {
		if (this === player) return;
	
		var drawAngle = wrap(radToDeg(angleBetweenTwoPoints(player.pos, this.pos) - player.rot), -180, 180);

		var vectorFromPlayer = subtractVectors(this.pos, player.pos);
		var renderDistance = Math.max(player.radius, dotProductOfVectors(vectorFromPlayer, player.forward));
		var size = heightScale * canvas.height / renderDistance;
		var drawX = canvas.width*0.5 + drawAngle * canvas.width/FOV;
		var drawY = canvas.height*0.5;

		// Draw shadow
		canvasContext.drawImage(
			this._shadowImage,
			drawX - size/2, drawY + size * 0.3,
			size, size * 0.5
		);

		var viewRot = wrap((angleBetweenTwoPoints(player.pos, this.pos) - this.rot) / d360 * this.sprite.getColumns(), -this.sprite.getColumns(), 0) + this.sprite.getColumns() * 1.5 + 0.5;
		this.sprite.setColumn(viewRot);
		this.sprite.drawAt(drawX, drawY, size);
	}
}

class Brain {
	#directionVector;
	#dPrFwDv;
	#dPrRiDv;
	#lastTarget = null;
	#fovThreshold = ENTITY_FOV_ALIGNMENT_THRESHOLD;

	constructor(body) {
		this.body = body;
		this.minDistanceSafe = 50 + rndFloat(-10, 10);
		this.maxDistanceSafe = 150 + rndFloat(-50, 10);
		this.minDistanceHunt = this.minDistanceSafe;
		this.maxDistanceHunt = this.maxDistanceSafe;
		this.minDistance = this.minDistanceSafe;
		this.maxDistance = this.maxDistanceSafe;
		this.turnPreferance = rndFloat(-1, 1);
	}

	get name() {return this.body.name;}
	get pos() {return this.body.pos;}
	get x() {return this.body.pos.x;}
	get y() {return this.body.pos.y;}
	get rot() {return this.body.pos.y;}
	get forward() {return this.body.forward;}
	get right() {return this.body.right;}
	get moveSpeed() {return this.body.moveSpeed;}
	get rotateSpeed() {return this.body.rotateSpeed;}
	get moveDelta() {return this.body.moveDelta;}
	get rotateDelta() {return this.body.rotateDelta;}
	get actionTriggered() {return this.body.actionTriggered;}
	get level() {return this.body.level;}
	get distance() {return this.body.distance;}
	get pathFinder() { return this.body.pathFinder; }

	set moveDelta(value) { this.body.moveDelta = value; }
	set rotateDelta(value) { this.body.rotateDelta = value; }

	triggerAction() { this.body.triggerAction(); }

	think(deltaTime) {
		this.inLineOfSight = lineOfSight(this.pos, player.pos, this.level.walls);
		this.setDirectionVector(player.pos);
		this.canSeePlayer = 
			this.dPrFwDv > this.#fovThreshold && 
			this.inLineOfSight;
		if (this.canSeePlayer) {
			if (this.lastTarget) {
				if (this.lastTarget.pos.x !== player.pos.x ||
					this.lastTarget.pos.y !== player.pos.y ||
					this.lastTarget.radius !== player.radius    
				) {
					this.lastTarget.pos.x = player.pos.x;
					this.lastTarget.pos.y = player.pos.y;
					this.lastTarget.radius = player.radius;
					this.lastTarget.forward = player.forward;
					this.lastTarget.right = player.right;
				}
			} else {
				this.lastTarget = new EntityTarget(player);
			}
		}
		
		this.lastTarget?.brain.setDirectionVector(this.pos);
		this.targetSeesUs = 
			this.lastTarget?.brain.dPrFwDv > this.lastTarget?.brain.fovThreshold && 
			this.inLineOfSight;

		this.minDistance = this.targetSeesUs ? this.minDistanceSafe : this.minDistanceHunt;
		this.minDistance += this.lastTarget?.radius ?? 0;
		this.maxDistance = this.targetSeesUs ? this.maxDistanceSafe : this.maxDistanceHunt;
	}

	onDestroy() {}

	get directionVector() { return this.#directionVector; }
	get dPrFwDv() { return this.#dPrFwDv; }
	get dPrRiDv() { return this.#dPrRiDv; }

	setDirectionVector(targetPos) {
		if (targetPos) {
			this.#directionVector = 
				normalizeVector(subtractVectors(targetPos, this.pos));
			this.#dPrFwDv =
				dotProductOfVectors(this.forward, this.#directionVector);
			this.#dPrRiDv =
				dotProductOfVectors(this.right, this.#directionVector);
		}
	}

	get lastTarget() { return this.#lastTarget; }
	set lastTarget(target) { this.#lastTarget = target; }
	get fovThreshold() { return this.#fovThreshold; }
	set fovThreshold(fovt) { this.#fovThreshold = fovt; }

	isInBounds(point) {
		// measure x, y boundaries from finding eventually ray casting
		// or communicating with other similar entities
		return currentMap.isInBounds(point);
	};
}

class EntityClone extends EntityClass {
	constructor(entity) {
		super(entity);
		this.name = entity?.name ? entity.name + " Clone" : "Clone";
		this.pos = { x: entity?.pos.x ?? 0, y: entity?.pos.y ?? 0};
		this.radius = entity?.radius || 5;
		this.moveSpeed = entity?.moveSpeed || 20;
		this.rotateSpeed = entity?.rotateSpeed || 2;
		this.moveDelta = 
			{ x: entity?.moveDelta.x ?? 0, y: entity?.moveDelta.y ?? 0};
		this.rotateDelta = entity?.rotateDelta || 0;
		this.actionTriggered = entity?.actionTriggered || false;
		this.level = entity?.level || null;
		this.distance = entity?.distance || Infinity;

		this.maxHealth = entity?.maxHealth ?? 100;
		this.health = this.maxHealth;

		this.actionCooldownTime = 
			entity?.actionCooldownTime || 1.5;
		this._actionCooldown = this.actionCooldownTime;

		this.pathFinder = new PathFindingComponent(this);

		this.brain = new Brain(this);
	}
}

class EntityTarget extends EntityClone {
	constructor(entity) {
		super(entity);
		this.name = entity?.name ? 
			entity.name + " Target" : 
			"Target";
		this.pos = { x: entity?.pos.x ?? 0, y: entity?.pos.y ?? 0 };
		this.radius = entity?.radius || 5;
	}
}

