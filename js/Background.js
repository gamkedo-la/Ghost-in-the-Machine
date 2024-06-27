// Background.js
// drawns the sky and floor

const WIND_SPEED = -0.02; // (pixels per ms)

// FIXME: guessed this magic number: use math instead!
// so that the sky image offset exactly matches player.rot  
// I guess we need to calculate...
// how many radians per canvas pixel (using FOV + canvas width)
const SKY_ROTATION_FACTOR = -320;

var skyTexture = new Image();
skyTexture.src = './images/sky.png';
skyTexture.onload = function() { this.loaded=true; }

var floorTexture = new Image();
floorTexture.src = './images/floor.png';
floorTexture.onload = function() { this.loaded=true; }

function drawBackground() {

    if (!skyTexture.loaded) return;
    if (!floorTexture.loaded) return;

    // scrolling tiled sky image based on player rotation
    let wind_offset = performance.now() * WIND_SPEED;
    let skyX = Math.round(wind_offset + (player.rot * SKY_ROTATION_FACTOR)) % skyTexture.width;
    let skyY = Math.round(canvas.height/2-skyTexture.height);
    //console.log("sky rot:"+player.rot.toFixed(2)+" pos:"+skyX);
    canvasContext.drawImage(skyTexture,skyX,skyY);
  	canvasContext.drawImage(skyTexture,skyX+skyTexture.width,skyY);

  	// a single static floor gradient with no perspective or rotation
    if (!FLOOR_ENABLED) canvasContext.drawImage(floorTexture,0,canvas.height/2);

}
