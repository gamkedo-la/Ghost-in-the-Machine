// a hack to give cheap and fast floor rendering
// that uses a single div with a 3d css transform
// this is not proper raycasting floor rendering 
// which requires trigonometry I have yet to master
// this cheap hack may never line up 100% perfectly...

// for some reason changing the css has no effect,
// the values stay "locked" and are read-only???
const FLOOR_ENABLED = false; // what a stupid waste of time

class TheFloorClass {

    constructor() {
        if (!FLOOR_ENABLED) return;
        
        //console.log("initializing the floor");
        //document.body.style.perspective = "888px"; // hmmmmmm

        this.floorHOLDER = document.createElement("DIV");
        this.floorHOLDER.style = `
            position:absolute;
            perspective:256px;
            display:block;
            width:800px;
            height:300px;
            top:50%;
            bottom:50%;
            left:0%;
            right:100%;
            overflow:hidden;
            background:cyan;
            margin:0;
            padding:0;`;
        document.getElementById("gameDiv").appendChild(this.floorHOLDER);

        this.floor = document.createElement("DIV");
        this.floor.style = `
            image-rendering:pixelated; /*no effect*/
            OMITbackground-size:128px; /*blurry if we scale this way*/
            position:absolute;
            display:block;
            background:red;
            background-image:url(images/floorTile.png);
            width:2048px;
            height:2048px;
            /* HUH? changing this in code has no effect: */
            transform:rotate3d(1,0,0,90deg) translate3d(-512px, 0px, 792px);
            margin:0;
            padding:0;`;
        this.floorHOLDER.appendChild(this.floor);

    }

    draw(x=0,y=0,rot=0) {
        if (!FLOOR_ENABLED) return;

        // spin around for now
        rot = Math.sin(performance.now()/1000)*360;
        // console.log("floor rot="+rot.toFixed(2));
        
        // NO EFFECT? WTF!!!!!!!!!!!!!!!!!!!!!!
        // this does NOT change the value?!?!?
        let xform = "rotate3d(1, "+rot+"deg, 0, 90deg) translate3d(-512px, 0px, 792px)";
        this.floor.style.transform = xform; // NO EFFECT?!

        // these two values "should" be identical but are NOT
        console.log("the xform="+xform); // expected value
        console.log("css xform="+this.floor.style.transform); // no change!
        // LIES LIES LIES

    }

}