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

		this.maxHealth = entityToOverride.maxHealth || 100;
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
				// TODO: This is janky, easy to get stuck in eachother
				const distApart =
					distanceBetweenTwoPoints(
						this.pos, ent.pos);
				ent.brain.setDirectionVector(this.pos);

				if (distApart < this.radius + ent.radius) {
					// deltaX += ent.directionVector * distApart;

					// deltaX *= Math.floor(Math.random() * 3) - 1;
					// deltaY *= Math.floor(Math.random() * 3) - 1;
					// this.onCollisionEntity(ent);
					// break;
				}
			}

			var newPos = {x:this.pos.x + deltaX, y:this.pos.y + deltaY};
			for (var i in this.level.walls) {
				if (distanceBetweenTwoPoints(getNearestPointOnLine(this.level.walls[i].p1, this.level.walls[i].p2, newPos), newPos) <= this.radius) {
					// TODO: Collide and Slide
					deltaX = 0;
					deltaY = 0;
					this.onCollisionWall();
					break;
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

		if (this.health <= 0) this.level.markForDestruction(this);
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
		var drawAngle = wrap(radToDeg(angleBetweenTwoPoints(player.pos, this.pos) - player.rot), -180, 180);

		var size = heightScale * canvas.height / this.distance;
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
	// point to North initially
	#directionVector = { x: 0, y: -1 };
	#dPrFwDv = 0;
	#dPrRiDv = 0;

	constructor(body) {
		this.body = body;
		this.setDirectionVector();
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

	set moveDelta(value) {this.body.moveDelta = value;}
	set rotateDelta(value) {this.body.rotateDelta = value;}

	triggerAction() {this.body.triggerAction();}

	think(deltaTime) {}

	get directionVector() { return this.#directionVector; }
	get dPrFwDv() { return this.#dPrFwDv; }
	get dPrRiDv() { return this.#dPrRiDv; }
	setDirectionVector = (targetPos = { x: 0, y: 0 }) => {
		this.#directionVector =
			normalizeVector(subtractVectors(targetPos, this.pos));
		this.#dPrFwDv =
			dotProductOfVectors(this.forward, this.#directionVector);
		this.#dPrRiDv =
			dotProductOfVectors(this.right, this.#directionVector);
	}

	isInBounds(x, y) {
		// TODO: measure x, y boundaries from finding eventually ray casting
		// or communicating with other similar entities
		return currentMap.isInBounds(x, y);
	};
}