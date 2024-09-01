// a simple particle fx system
// work in progress

var particles = {
    active: [],
    pool: [], // todo
    update: function(deltaTime) {
        for (let i=0; i<particles.active.length; i++) {
            particles.active[i].update(deltaTime);
        }

        // // hmm these don't seem to get rendered, not sure why =(
        // if (Math.random()<0.5) {
        //     let px = 0;
        //     let py = -20;
        //     sparksFX(px,py,1); // spam particle debug test
        // }
    }
}

class Particle  {
	
    constructor() {
        this.timeLeft = 2;
        this.pos = {x:0,y:0,z:0};
        this.vel = {x:0,y:0,z:0};
        this.size = 0.1; // tiny!
        this.alpha = 1;
        this.gravity = 100; // units per second accel
        this.distance = Infinity;
		this.sprite = new SpriteClass(
            './images/particles.png', 
			1, 1,   // could have columns and rows for variety or flipbook anim
			16, 16  // very small sprites
		);
	}

    update(deltaTime) {
        this.timeLeft -= deltaTime;
        if (this.timeLeft <= 0) {
            // console.log("particle needs to be destroyed!");
            // this.destroy(); // BUGS OUT THE ENGINE.FIXME
            particles.active.splice(particles.active.indexOf(this), 1);
            // TODO: pool!!!!!!!!!!!!! or truly destroy the object
        }
        // friction
        this.vel.x *= 0.99;
        this.vel.y *= 0.99;
        // gravity accel
        this.vel.z -= this.gravity * deltaTime;
        // move
        this.pos.x += this.vel.x * deltaTime;
		this.pos.y += this.vel.y * deltaTime;
		this.pos.z += this.vel.z * deltaTime;
    }

	draw3D() {
        var drawAngle = wrap(radToDeg(angleBetweenTwoPoints(player.pos, this.pos) - player.rot), -180, 180);
		this.distance = distanceBetweenTwoPoints(this.pos, player.pos);
        let particleHeightScale = heightScale * this.size;
        var size = particleHeightScale * canvas.height / this.distance;
		var drawX = canvas.width*0.5 + drawAngle * canvas.width/FOV;
		var drawY = canvas.height*0.5 - this.pos.z; // we subtract "z" for a "height" offset
        //this.sprite.setColumn(0); // todo animate or rotate?
		//console.log("particle is being rendered in 3d at "+drawX.toFixed(2)+","+drawY.toFixed(2)+" size:"+size.toFixed(2)+" dist:"+this.distance.toFixed(2));
		this.sprite.drawAt(drawX, drawY, size);
	}

    draw2D() {}
}

function sparksFX(x=0,y=0,num=1) {
    //console.log("spawning "+num+" sparks!");
    //console.log("player pos is: "+player.pos.x+","+player.pos.y);
    //x = x+player.pos.x;
    //y = y+player.pos.y + 5;
    for (let i=0; i<num; i++) {
        let p = new Particle();
        p.pos.x = x + Math.random();//*10-5;
        p.pos.y = y + Math.random();//*10-5;
        p.vel.x = Math.random()*4 - 2;
        p.vel.y = Math.random()*4 - 2;
        p.vel.z = 50 + Math.random()*50;
        particles.active.push(p);
    }
}

