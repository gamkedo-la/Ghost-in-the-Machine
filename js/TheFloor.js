// a hack to give cheap and fast floor rendering
// that uses a single div with a 3d css transform

const FLOOR_ENABLED = true;

class TheFloorClass {

    constructor() {
        if (!FLOOR_ENABLED) return;
        
        console.log("initializing the floor");

        this.floorHOLDER = document.createElement("DIV");
        this.floorHOLDER.style = `
            perspective:256px;
            display:block;
            width:800px;
            height:300px;
            overflow:hidden;
            background:none;
            margin:auto;
            padding:0;`;
        document.getElementById("gameDiv").appendChild(this.floorHOLDER);

        this.floor = document.createElement("DIV");
        this.floor.style = `
            position:absolute;
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
        rot = Math.sin(performance.now()/2000)*45;
        // console.log("floor rot="+rot.toFixed(2));
        
        let xform = "rotate3d(1, 0, 0, 90deg) translate3d(-512px, 0px, 792px) rotate3d(0,0,1,"+rot+"deg)";
        this.floor.style.transform = xform;

    }

}