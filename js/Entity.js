class EntityClass {
	constructor(entityClone = {}) {
		this.name = entityClone.name || "";
        this.pos = entityClone.pos ? {x:entityClone.pos.x, y:entityClone.pos.y} : {x:0, y:0};
		this.rot = entityClone.rot || d270;
		this.forward = {x:0, y:0};
		this.forward.x = Math.cos(this.rot);
		this.forward.y = Math.sin(this.rot);
		this.right = {x:0, y:0};
		this.right.x =  this.forward.y;
		this.right.y = -this.forward.x;
		this.moveSpeed = 20;
		this.rotateSpeed = 2;
		this.moveDelta = {x:0, y:0};
		this.rotateDelta = 0;
		this.actionTriggered = false;
		this.level = null;
		this.distance = Infinity;
	}

	get x() {return this.pos.x;}
	get y() {return this.pos.y;}

	onUpdate(deltaTime) {}
	update(deltaTime) {
		this.onUpdate(deltaTime);

		if (this.actionTriggered) {
			this.action(deltaTime);
			this.actionTriggered = false;
		}

		//update rotation
		this.rot += this.rotateDelta * deltaTime;
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

		//collision checking
		if (this.moveDelta.y != 0 || this.moveDelta.x != 0) {
			var newPos = {x:this.pos.x + deltaX*5*deltaTime, y:this.pos.y + deltaY*5*deltaTime};
			for (var i in this.level.walls) {
				if (isLineIntersecting(this.pos, newPos, this.level.walls[i].p1, this.level.walls[i].p2)) {
					deltaX = 0;
					deltaY = 0;
					break;
				}
			}
		}
		this.pos.x += deltaX * deltaTime;
		this.pos.y += deltaY * deltaTime;

		//housekeeping
		this.distance = distanceBetweenTwoPoints(this.pos, player.pos);
		this.rotateDelta = 0;
		this.moveDelta.x = 0;
		this.moveDelta.y = 0;
	}

	onAction(deltaTime) {};
	action(deltaTime) {
		this.onAction(deltaTime);
	};

	draw2D() {
		colorLine(this.pos.x, this.pos.y, this.pos.x + this.forward.x * 10, this.pos.y +this.forward.y * 10, 2, "white");
		colorEmptyCircle(this.pos.x, this.pos.y, 5, "grey");
	}

	draw3D() {}

	destroy() {
		gameObjects.splice(gameObjects.indexoOf(this), 2);
	}
}

class SceneEntity extends EntityClass {
	constructor(entityClone = {}) {
		super(entityClone);

		this._image = new Image();
		this._image.src = './images/shadow.png';

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
			this._image, 
			drawX - size/2, drawY + size * 0.3, 
			size, size * 0.5
		);
		
		var viewRot = wrap((player.rot - this.rot) / d360 * this.sprite.getColumns(), -this.sprite.getColumns(), 0) + this.sprite.getColumns() * 1.5;
		this.sprite.setColumn(viewRot);
		this.sprite.drawAt(drawX, drawY, size);
	}
}