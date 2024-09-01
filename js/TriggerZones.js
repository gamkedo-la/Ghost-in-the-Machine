class TriggerZone {
	constructor(level) {
		this.level = level;
		this._inZone = [];
		this.editID = -1;
	}

	checkOverlaps() {
		var entities = this.level.entities;

		for (var i = entities.length - 1; i >= 0; i--) {
			var overlapping = this.isOverlapping(entities[i]);
			var isInZone = this._inZone.includes(entities[i]);

			if (overlapping && !isInZone) {
				this.onTriggerEnter(entities[i]);
				this._inZone.push(entities[i]);
			} else if (!overlapping && isInZone) {
				this.onTriggerExit(entities[i]);
				this._inZone.splice(this._inZone.indexOf(entities[i]), 1);
			}
		}
	}

	isOverlapping(entity) {
		return false;
	}

	onTriggerEnter(entity) {}
	onTriggerExit(entity) {}
}

class CircleTriggerZone extends TriggerZone {
	constructor(level, pos, radius) {
		super(level);

		this.pos = {x:pos.x, y:pos.y};
		this.radius = radius;
	}

	isOverlapping(entity) {
		return distanceBetweenTwoPoints(this.pos, entity.pos) < this.radius;
	}
}

class AABBTriggerZone extends TriggerZone {
	constructor(level, topleftpos, bottomrightpos) {
		super(level);

		this.topleft = {x:topleftpos.x < bottomrightpos.x ? topleftpos.x : bottomrightpos.x, 
		y:topleftpos.y < bottomrightpos.y ? topleftpos.y : bottomrightpos.y};
		
		this.bottomright = {x:topleftpos.x > bottomrightpos.x ? topleftpos.x : bottomrightpos.x, 
		y:topleftpos.y > bottomrightpos.y ? topleftpos.y : bottomrightpos.y};
	}

	isOverlapping(entity) {
		return entity.pos.x >= this.topleft.x && 
			   entity.pos.x <= this.bottomright.x &&
			   entity.pos.y >= this.topleft.y && 
			   entity.pos.y <= this.bottomright.y;
	}
}