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
		this.sprite.xScale = 1.3;
		this.sprite.yScale = 1.3;

		this.brain = new TurretBrain(this);

       // the 3d sound code changes this.pos.x and y if we simply use "this" as the parent below
       // let posObj = this;
       let posObj = {pos:{x:this.pos.x,y:this.pos.y}};
       this.fireSound = AudioMan.createSound3D("./audio/turretFire.wav", posObj, false, 1, 1, false);
       this.explosionSound = AudioMan.createSound3D("./audio/explosionShort.wav", posObj, false, 1, 1, false);
        
	}

	onAction(deltaTime) {
		let shot = new TurretShot({name: this.name + " shot", rot:this.rot, level: this.level, parent: this});
		shot.pos = addVectors(this.pos, scaleVector(this.forward, this.radius + shot.radius + 1));
		this.level.entities.push(shot);

        this.fireSound.play();
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
		
		this.moveSpeed = 50;
		this.rotateSpeed = 1;

		this.maxHealth = 1;
		this.health = this.maxHealth;

		this.explosionDamage = 50;
		this.range = 10;
		this.parent = entityToOverride.parent || null;

		this.sprite = new SpriteClass(
			'./images/projectile-1-blue.png', 
            12, 1, 
            400, 400
		);
		this.radius = 2;
 	}

	onUpdatePre(deltaTime) {
		this.moveDelta.x = 1;
	}

	onAction() {
		this.level.markForDestruction(this);
	}

	onCollisionWall() {
		this.level.markForDestruction(this);
	}

	onCollisionEntity(other) {
		if (other == this.parent) return;

		this.level.markForDestruction(this);
	}

	onDestroy() {
		//Explosion code
		sparksFX(this.pos.x,this.pos.y,15);

        if (this.parent && this.parent.explosionSound) {
            this.parent.explosionSound.pos.x = this.pos.x;
            this.parent.explosionSound.pos.y = this.pos.y;
            this.parent.explosionSound.play();
        }

		for (let i = 0; i < this.level.entities.length; i++) {
			let entity = this.level.entities[i];
			if (entity == this.parent) continue;

			let distance = distanceBetweenTwoPoints(this.pos, entity.pos);

			if (distance <= this.range && lineOfSight(this.pos, entity.pos, this.level.walls)) {
				entity.takeDamage((1 - distance/this.range) * this.explosionDamage);
				sparksFX(entity.pos.x,entity.pos.y,5);
			}
		}
	}
}