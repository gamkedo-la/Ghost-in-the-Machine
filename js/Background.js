// Background.js
// drawns the sky and floor

var skyTexture = new Image();
skyTexture.src = './images/sky.png';
skyTexture.onload = function() { this.loaded=true; }

var floorTexture = new Image();
floorTexture.src = './images/floor.png';
floorTexture.onload = function() { this.loaded=true; }

function drawBackground() {

    if (!skyTexture.loaded) return;
    if (!floorTexture.loaded) return;

    // FIXME: guessed this magic number: use math instead!
    // I guess we need to calculate
    // how many radians per canvas pixel (using FOV + canvas width)
    
    // scrolling tiled sky image based on player rotation
    let skyX = Math.round(player.rot * -320) % skyTexture.width;
    let skyY = Math.round(canvas.height/2-skyTexture.height);
    console.log("sky rot:"+player.rot.toFixed(2)+" pos:"+skyX);
  	canvasContext.drawImage(skyTexture,skyX,skyY);
  	canvasContext.drawImage(skyTexture,skyX+skyTexture.width,skyY);

  	// a single static floor gradient with no perspective or rotation
    canvasContext.drawImage(floorTexture,0,canvas.height/2);

}
