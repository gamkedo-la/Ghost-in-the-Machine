var S1R1Level = new LevelClass();
S1R1Level.levelJSON = '{"playerStart":{"x":-27,"y":24,"rot":0.8726646259971629},"startIndex":0,"startList":[{"x":-27,"y":24,"rot":0.8726646259971629},{"x":-279,"y":-359,"rot":6.2831853071795845}],"walls":[{"p1":{"x":-81,"y":-201},"p2":{"x":-238,"y":-105},"color":"green","textureOffset":0,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-238,"y":-105},"p2":{"x":-230,"y":100},"color":"green","textureOffset":40.24454896625093,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-230,"y":100},"p2":{"x":-108,"y":223},"color":"green","textureOffset":91.80493072448735,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-108,"y":223},"p2":{"x":57,"y":221},"color":"green","textureOffset":24.230975322062704,"transparency":false,"texture":"metalWall1"},{"p1":{"x":57,"y":221},"p2":{"x":176,"y":89},"color":"green","textureOffset":74.35218299136613,"transparency":false,"texture":"metalWall1"},{"p1":{"x":176,"y":89},"p2":{"x":156,"y":-82},"color":"green","textureOffset":51.56910841155786,"transparency":false,"texture":"metalWall1"},{"p1":{"x":156,"y":-82},"p2":{"x":-14,"y":-206},"color":"green","textureOffset":73.22528779233062,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-14,"y":-206},"p2":{"x":-36,"y":-276},"color":"green","textureOffset":77.4115913310643,"transparency":false,"texture":"blueWall"},{"p1":{"x":-36,"y":-276},"p2":{"x":-38,"y":-308},"color":"green","textureOffset":11.169044444829979,"transparency":false,"texture":"blueWall"},{"p1":{"x":-38,"y":-308},"p2":{"x":79,"y":-318},"color":"green","textureOffset":31.79343528245795,"transparency":false,"texture":"redWall"},{"p1":{"x":79,"y":-318},"p2":{"x":70,"y":-403},"color":"green","textureOffset":6.05916330146124,"transparency":false,"texture":"blueWall"},{"p1":{"x":70,"y":-403},"p2":{"x":-277,"y":-399},"color":"green","textureOffset":60.81058915578535,"transparency":false,"texture":"redWall"},{"p1":{"x":-277,"y":-399},"p2":{"x":-277,"y":-366},"color":"green","textureOffset":31.04112904791191,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-278,"y":-353},"p2":{"x":-278,"y":-327},"color":"green","textureOffset":71.21349161885007,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-278,"y":-327},"p2":{"x":1,"y":-357},"color":"green","textureOffset":51.21349161885007,"transparency":false,"texture":"redWall"},{"p1":{"x":1,"y":-357},"p2":{"x":-99,"y":-328},"color":"green","textureOffset":57.29617037227581,"transparency":false,"texture":"redWall"},{"p1":{"x":-99,"y":-328},"p2":{"x":-71,"y":-282},"color":"green","textureOffset":98.49739972229918,"transparency":false,"texture":"redWall"},{"p1":{"x":-71,"y":-282},"p2":{"x":-81,"y":-201},"color":"green","textureOffset":37.01388043574957,"transparency":false,"texture":"blueWall"},{"p1":{"x":-277,"y":-366},"p2":{"x":-314,"y":-390},"color":"black","textureOffset":0,"transparency":false},{"p1":{"x":-314,"y":-390},"p2":{"x":-314,"y":-332},"color":"black","textureOffset":3.1128874149274566,"transparency":false},{"p1":{"x":-314,"y":-332},"p2":{"x":-278,"y":-353},"color":"black","textureOffset":3.1128874149274566,"transparency":false}],"triggerZones":[{"editID":0,"topleft":{"x":-330,"y":-401},"bottomright":{"x":-284,"y":-309},"type":"AABB"}]}';
S1R1Level.onLoad = function() {
	var doortrigger = this.getTriggerZoneByEditID(0);
	doortrigger.onTriggerEnter = function(entity) {
		if (entity == player) {
			S1R2Level.startIndex = 0;
			S1R2Level.load();
		}
	}
}

var S1R2Level = new LevelClass();
S1R2Level.levelJSON = '{"playerStart":{"x":0,"y":0,"rot":4.71238898038469},"startIndex":0,"startList":[{"x":0,"y":0,"rot":4.71238898038469},{"x":80,"y":-190,"rot":1.2217304763960288}],"walls":[{"p1":{"x":-12,"y":9},"p2":{"x":-24,"y":9},"color":"orange","textureOffset":0,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-24,"y":9},"p2":{"x":-35,"y":-127},"color":"orange","textureOffset":20,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-35,"y":-127},"p2":{"x":51,"y":-132},"color":"orange","textureOffset":84.44127759314006,"transparency":false,"texture":"metalWall1"},{"p1":{"x":51,"y":-132},"p2":{"x":71,"y":31},"color":"orange","textureOffset":45.89353976441089,"transparency":false,"texture":"metalWall1"},{"p1":{"x":71,"y":31},"p2":{"x":128,"y":27},"color":"orange","textureOffset":88.11764140218679,"transparency":false,"texture":"metalWall1"},{"p1":{"x":128,"y":27},"p2":{"x":115,"y":-99},"color":"orange","textureOffset":59.519426488652925,"transparency":false,"texture":"metalWall1"},{"p1":{"x":111,"y":-126},"p2":{"x":106,"y":-155},"color":"orange","textureOffset":99.15490406917235,"transparency":false,"texture":"metalWall1"},{"p1":{"x":106,"y":-155},"p2":{"x":233,"y":-167},"color":"orange","textureOffset":93.43368346041558,"transparency":false,"texture":"metalWall1"},{"p1":{"x":233,"y":-167},"p2":{"x":250,"y":-46},"color":"orange","textureOffset":69.09037708923051,"transparency":false,"texture":"metalWall1"},{"p1":{"x":250,"y":-46},"p2":{"x":149,"y":-41},"color":"orange","textureOffset":90.97416861770489,"transparency":false,"texture":"metalWall1"},{"p1":{"x":149,"y":-41},"p2":{"x":150,"y":46},"color":"orange","textureOffset":2.2110350342727543,"transparency":false,"texture":"metalWall1"},{"p1":{"x":150,"y":46},"p2":{"x":56,"y":55},"color":"orange","textureOffset":72.26850440052101,"transparency":false,"texture":"metalWall1"},{"p1":{"x":56,"y":55},"p2":{"x":22,"y":-105},"color":"orange","textureOffset":16.56718596266319,"transparency":false,"texture":"metalWall1"},{"p1":{"x":22,"y":-105},"p2":{"x":4,"y":-106},"color":"orange","textureOffset":52.29332441005022,"transparency":false,"texture":"metalWall1"},{"p1":{"x":4,"y":-106},"p2":{"x":23,"y":7},"color":"orange","textureOffset":32.57088818324968,"transparency":false,"texture":"metalWall1"},{"p1":{"x":23,"y":7},"p2":{"x":11,"y":8},"color":"orange","textureOffset":78.43300903374711,"transparency":false,"texture":"metalWall1"},{"p1":{"x":11,"y":8},"p2":{"x":37,"y":27},"color":"black","textureOffset":98.84895482167008,"transparency":false},{"p1":{"x":37,"y":27},"p2":{"x":-31,"y":28},"color":"black","textureOffset":82.04499999179603,"transparency":false},{"p1":{"x":-31,"y":28},"p2":{"x":-12,"y":9},"color":"black","textureOffset":64.19618310491137,"transparency":false},{"p1":{"x":115,"y":-99},"p2":{"x":73,"y":-91},"color":"green","textureOffset":0,"transparency":false,"texture":"blueWall"},{"p1":{"x":73,"y":-91},"p2":{"x":55,"y":-191},"color":"green","textureOffset":27.551166528638987,"transparency":false,"texture":"blueWall"},{"p1":{"x":55,"y":-191},"p2":{"x":69,"y":-193},"color":"green","textureOffset":96.40098093847132,"transparency":false,"texture":"blueWall"},{"p1":{"x":91,"y":-196},"p2":{"x":105,"y":-195},"color":"green","textureOffset":90.37736252764097,"transparency":false,"texture":"blueWall"},{"p1":{"x":105,"y":-195},"p2":{"x":112,"y":-167},"color":"green","textureOffset":62.42386786849352,"transparency":false,"texture":"blueWall"},{"p1":{"x":112,"y":-167},"p2":{"x":94,"y":-164},"color":"green","textureOffset":19.355233819988484,"transparency":false,"texture":"blueWall"},{"p1":{"x":94,"y":-164},"p2":{"x":100,"y":-124},"color":"green","textureOffset":1.8381097289350805,"transparency":false,"texture":"blueWall"},{"p1":{"x":100,"y":-124},"p2":{"x":111,"y":-126},"color":"green","textureOffset":56.943727820229185,"transparency":false,"texture":"blueWall"},{"p1":{"x":105,"y":-195},"p2":{"x":91,"y":-196},"color":"black","textureOffset":0,"transparency":false},{"p1":{"x":91,"y":-196},"p2":{"x":114,"y":-234},"color":"black","textureOffset":48.66068747318505,"transparency":false},{"p1":{"x":114,"y":-234},"p2":{"x":11,"y":-240},"color":"black","textureOffset":91.6053792801871,"transparency":false},{"p1":{"x":11,"y":-240},"p2":{"x":69,"y":-193},"color":"black","textureOffset":5.607351664856651,"transparency":false}],"entities":[{"pos":{"x":168,"y":-94},"name":"Byjator","rot":5.236,"roboType":"BitBunny"}],"triggerZones":[{"editID":0,"topleft":{"x":-42,"y":15},"bottomright":{"x":40,"y":53},"type":"AABB"},{"editID":2,"topleft":{"x":26,"y":-237},"bottomright":{"x":121,"y":-202},"type":"AABB"}]}';
S1R2Level.onLoad = function() {
	this.opendoor = false;

	this.doorwall = new WallClass();
	this.doorwall.p1 = {x:111, y:-126};
	this.doorwall.p2 = {x:115, y:-99};
	this.doorwall.p1ClosePos = {x:111, y:-126};
	this.doorwall.p1OpenPos = {x:115, y:-99};
	this.doorwall.texture = new Image();
	this.doorwall.texture.src = './images/blueWall.png';
	this.walls.push(this.doorwall);

	var doortrigger1 = this.getTriggerZoneByEditID(0);
	doortrigger1.onTriggerEnter = function(entity) {
		if (entity == player) {
			S1R1Level.startIndex = 1;
			S1R1Level.load();
		}
	}

	var doortrigger2 = this.getTriggerZoneByEditID(2);
	doortrigger2.onTriggerEnter = function(entity) {
		if (entity == player) {
			S1R3Level.startIndex = 0;
			S1R3Level.load();
		}
	}

	this.getEntityByName("Byjator").health = 15;
	this.getEntityByName("Byjator").brain.onDestroy = function(deltaTime) {
		this.level.opendoor = true;
	}
}
S1R2Level.onUpdate = function(deltaTime) {
	if (this.opendoor) {
		if (this.doorwall.p1.x > this.doorwall.p1OpenPos.x) {
			this.doorwall.p1.x -= 0.1;
		}
		if (this.doorwall.p1.x < this.doorwall.p1OpenPos.x) {
			this.doorwall.p1.x += 0.1;
		}
		if (this.doorwall.p1.y > this.doorwall.p1OpenPos.y) {
			this.doorwall.p1.y -= 0.1;
		}
		if (this.doorwall.p1.y < this.doorwall.p1OpenPos.y) {
			this.doorwall.p1.y += 0.1;
		}
	}
}


var S1R3Level = new LevelClass();
S1R3Level.levelJSON = '{"playerStart":{"x":0,"y":0,"rot":4.71238898038469},"startIndex":0,"startList":[{"x":0,"y":0,"rot":4.71238898038469},{"x":-128,"y":-77,"rot":1.5707963267948948}],"walls":[{"p1":{"x":-13,"y":17},"p2":{"x":-36,"y":15},"color":"blue","textureOffset":70.18512172212593,"transparency":false,"texture":"blueWall"},{"p1":{"x":-36,"y":15},"p2":{"x":-27,"y":-17},"color":"blue","textureOffset":1.0530493344298293,"transparency":false,"texture":"blueWall"},{"p1":{"x":-27,"y":-17},"p2":{"x":-25,"y":-113},"color":"blue","textureOffset":33.468452106323014,"transparency":false,"texture":"blueWall"},{"p1":{"x":-25,"y":-113},"p2":{"x":9,"y":-157},"color":"blue","textureOffset":93.6767628389473,"transparency":false,"texture":"blueWall"},{"p1":{"x":9,"y":-157},"p2":{"x":137,"y":-162},"color":"blue","textureOffset":49.734313817260954,"transparency":false,"texture":"blueWall"},{"p1":{"x":137,"y":-162},"p2":{"x":223,"y":-128},"color":"blue","textureOffset":30.7105040721774,"transparency":false,"texture":"blueWall"},{"p1":{"x":223,"y":-128},"p2":{"x":236,"y":45},"color":"blue","textureOffset":55.48074580792877,"transparency":false,"texture":"blueWall"},{"p1":{"x":236,"y":45},"p2":{"x":190,"y":133},"color":"blue","textureOffset":90.35826309841468,"transparency":false,"texture":"blueWall"},{"p1":{"x":190,"y":133},"p2":{"x":-28,"y":139},"color":"darkgrey","textureOffset":83.33359008292746,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-28,"y":139},"p2":{"x":-35,"y":229},"color":"red","textureOffset":64.15912184836452,"transparency":false,"texture":"redWall"},{"p1":{"x":-35,"y":229},"p2":{"x":-225,"y":218},"color":"red","textureOffset":66.87723953516502,"transparency":false,"texture":"redWall"},{"p1":{"x":-225,"y":218},"p2":{"x":-230,"y":-88},"color":"red","textureOffset":60.677728931500724,"transparency":false,"texture":"redWall"},{"p1":{"x":-230,"y":-88},"p2":{"x":-139,"y":-91},"color":"red","textureOffset":21.26590769714403,"transparency":false,"texture":"redWall"},{"p1":{"x":-121,"y":-90},"p2":{"x":-52,"y":-87},"color":"red","textureOffset":92.2301517949586,"transparency":false,"texture":"redWall"},{"p1":{"x":-52,"y":-87},"p2":{"x":-56,"y":30},"color":"red","textureOffset":83.1476601403017,"transparency":false,"texture":"redWall"},{"p1":{"x":-12,"y":84},"p2":{"x":107,"y":75},"color":"darkgrey","textureOffset":34.03838607329749,"transparency":false,"texture":"metalWall1"},{"p1":{"x":107,"y":75},"p2":{"x":106,"y":-99},"color":"blue","textureOffset":27.436894535579768,"transparency":false,"texture":"blueWall"},{"p1":{"x":106,"y":-99},"p2":{"x":30,"y":-104},"color":"blue","textureOffset":67.46562993048678,"transparency":false,"texture":"blueWall"},{"p1":{"x":30,"y":-104},"p2":{"x":13,"y":-95},"color":"blue","textureOffset":29.10859090367137,"transparency":false,"texture":"blueWall"},{"p1":{"x":13,"y":-95},"p2":{"x":17,"y":-28},"color":"blue","textureOffset":21.462431520384797,"transparency":false,"texture":"blueWall"},{"p1":{"x":17,"y":-28},"p2":{"x":39,"y":7},"color":"blue","textureOffset":92.65539930237821,"transparency":false,"texture":"blueWall"},{"p1":{"x":39,"y":7},"p2":{"x":14,"y":16},"color":"blue","textureOffset":6.055931474265947,"transparency":false,"texture":"blueWall"},{"p1":{"x":-12,"y":84},"p2":{"x":-56,"y":30},"color":"red","textureOffset":0,"transparency":false,"texture":"redWall"},{"p1":{"x":-113,"y":-90},"p2":{"x":-42,"y":-129},"color":"black","textureOffset":0,"transparency":false},{"p1":{"x":-42,"y":-129},"p2":{"x":-208,"y":-142},"color":"black","textureOffset":7.248188403476888,"transparency":false},{"p1":{"x":-208,"y":-142},"p2":{"x":-147,"y":-91},"color":"black","textureOffset":52.72546096363976,"transparency":false},{"p1":{"x":-13,"y":17},"p2":{"x":-27,"y":50},"color":"black","textureOffset":0,"transparency":false},{"p1":{"x":-27,"y":50},"p2":{"x":51,"y":52},"color":"black","textureOffset":58.46896657869843,"transparency":false},{"p1":{"x":51,"y":52},"p2":{"x":14,"y":16},"color":"black","textureOffset":38.725334703944895,"transparency":false}],"entities":[{"pos":{"x":191,"y":24},"name":"Bite","rot":1.571,"roboType":"BitBunny"},{"pos":{"x":157,"y":47},"name":"Nabentor","rot":1.571,"roboType":"BitBunny"},{"pos":{"x":128,"y":25},"name":"Bykatnany","rot":1.571,"roboType":"BitBunny"},{"pos":{"x":-116,"y":-84},"name":"Naey","rot":1.571,"roboType":"Turret"},{"pos":{"x":-143,"y":-84},"name":"Benky","rot":1.571,"roboType":"Turret"}],"triggerZones":[{"editID":0,"topleft":{"x":-233,"y":-180},"bottomright":{"x":-33,"y":-96},"type":"AABB"},{"editID":2,"topleft":{"x":-30,"y":27},"bottomright":{"x":56,"y":60},"type":"AABB"}]}';
S1R3Level.onLoad = function() {
	var doortrigger1 = this.getTriggerZoneByEditID(2);
	doortrigger1.onTriggerEnter = function(entity) {
		if (entity == player) {
			S1R2Level.startIndex = 1;
			S1R2Level.load();
		}
	}

	var doortrigger2 = this.getTriggerZoneByEditID(0);
	doortrigger2.onTriggerEnter = function(entity) {
		if (entity == player) {
			// S1R4Level.startIndex = 0;
			// S1R4Level.load();
		}
	}

}