// a hack to give cheap and fast floor rendering
// that uses a single div with a 3d css transform

var FLOOR_ENABLED = false;

// debug key: "F" to enable!
window.addEventListener('keydown',(e) => { if (e.key=="f") FLOOR_ENABLED = !FLOOR_ENABLED; });

class TheFloorClass {

    constructor() {
       
        //console.log("initializing the floor");

        this.floorHOLDER = document.createElement("DIV");
        this.floorHOLDER.style = `
            
            position:absolute;
            top:300px;
            left:50%;
            margin-left:-400px;
            pointer-events: none;
            z-index:-1;
            perspective:256px;
            perspective-origin:top; 
            display:block;
            width:800px;
            height:300px;
            overflow:hidden;
            background:none;
            OMITmargin:auto;
            padding:0;`;
        document.getElementById("gameDiv").appendChild(this.floorHOLDER);

        this.floor = document.createElement("DIV");
        this.floor.style = `
            position:absolute;
            top:0; left:0;
            pointer-events: none;
            display:block;
            background:red;
            background-image:url(images/floorTile.png);
            width:2048px;
            height:2048px;
            transform:rotate3d(1,0,0,90deg) translate3d(-512px, 0px, 792px);
            margin:0;
            padding:0;`;
        this.floorHOLDER.appendChild(this.floor);

    }

    draw(x=0,y=0,rot=0) {
        if (!FLOOR_ENABLED) return;

        // wobble back and forth - just a tech demo for now
        // rot = Math.sin(performance.now()/2000)*45;

        rot = rot * (180/Math.PI) * -1; // radians to degrees except MIRRORED... why?
        // plus an extra 90 degrees for some reason
        rot += 90;
        //console.log("floor draw at "+x.toFixed(2)+","+y.toFixed(2)+" rot:"+rot.toFixed(2)+ "(player.rot="+player.rot.toFixed(2)+")");
        
        // hmm these do not seem correct at all =(
        let floorPXscale = 8; // how far to scroll the div per world unity
        let floorx = -1024 + ((x*floorPXscale) % 256); // the % is to loop one tile worth
        let floory = 512 + ((y*floorPXscale) % 256);
        let floorz = 792 + 128; // magic height
        // FIXME: I think this should be translate THEN rotate, perhaps done one axis at a time via rotateX() translateX() etc
        let xform = "rotate3d(1, 0, 0, 90deg) rotate3d(0,0,1,"+rot+"deg) translate3d("+floorx+"px, "+floory+"px, "+floorz+"px)";
        this.floor.style.transform = xform;

        // fake scroll lol this will never line up perfectly will it?
        // this.floor.style.backgroundPosition = x+"px "+y+"px";

    }

}