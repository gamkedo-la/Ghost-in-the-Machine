// a simple particle fx system
// work in progress

var particles = {
    pool: [], // todo
    update: function(deltaTime) {
        // hmm these don't seem to get rendered, not sure why =(
        // sparksFX(0,0); // spam particle debug test
    }
}

class Particle extends EntityClass {
	constructor(entityToOverride = {}) {
		super(entityToOverride);
        this.timeLeft = 1;
        this.vel = {x:0,y:0};
		this.sprite = new SpriteClass(
			
            //'./images/particles.png', 
			//1, 1,   // could have columns and rows for variety or flipbook anim
			//16, 16  // very small sprites

   			'./images/testEntitySS.png', 
			8, 6, 
			100, 100

		);
	}

    update(deltaTime) {
        
        this.timeLeft -= deltaTime;
        if (this.timeLeft <= 0) {
            console.log("particle needs to be destroyed!");
            // this.destroy(); // BUGS OUT THE ENGINE? FIXME
            currentMap.entities.splice(currentMap.entities.indexOf(this), 2);
            // TODO: pool!!!!!!!!!!!!!
        }

        this.pos.x += this.vel.x * deltaTime;
		this.pos.y += this.vel.y * deltaTime;

        // since there is no z axis in this world
        this.z_offset = 0;//this.timeLeft * 10;
    }

	draw3D() {
		//console.log("particle is being rendered!");
        var drawAngle = wrap(radToDeg(angleBetweenTwoPoints(player.pos, this.pos) - player.rot), -180, 180);
		var size = heightScale * canvas.height / this.distance;
		var drawX = canvas.width*0.5 + drawAngle * canvas.width/FOV;
		var drawY = canvas.height*0.5;
		this.sprite.setColumn(0); // todo
		this.sprite.drawAt(drawX, drawY+this.z_offset, size);
	}
}

function sparksFX(x,y) {
    console.log("spawning sparks!");
    //console.log("player pos is: "+player.pos.x+","+player.pos.y);
    //x = x+player.pos.x;
    //y = y+player.pos.y + 5;
    for (let i=0; i<4; i++) {
        let p = new Particle();
        p.pos.x = x + Math.random();//*10-5;
        p.pos.y = y + Math.random();//*10-5;
        p.vel.x = 0;//Math.random()*1 - .5;
        p.vel.y = 0;//Math.random()*1 - .5;
        p.vel.z = 0;//Math.random()*1;
        currentMap.entities.push(p); // hmm does this work???
    }
}

