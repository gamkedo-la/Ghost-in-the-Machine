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
			S1R4Level.startIndex = 0;
			S1R4Level.load();
		}
	}
}


var S1R4Level = new LevelClass();
S1R4Level.levelJSON = '{"playerStart":{"x":0,"y":0,"rot":4.71238898038469},"startIndex":0,"startList":[{"x":0,"y":0,"rot":4.71238898038469},{"x":351,"y":-620,"rot":4.71238898038469}],"walls":[{"p1":{"x":-40,"y":-276},"p2":{"x":-70,"y":-19},"color":"blue","textureOffset":0,"transparency":false,"texture":"blueWall"},{"p1":{"x":-70,"y":-19},"p2":{"x":-25,"y":9},"color":"blue","textureOffset":87.45048261797638,"transparency":false,"texture":"blueWall"},{"p1":{"x":18,"y":8},"p2":{"x":57,"y":-11},"color":"blue","textureOffset":47.56674597010772,"transparency":false,"texture":"blueWall"},{"p1":{"x":57,"y":-11},"p2":{"x":19,"y":-274},"color":"blue","textureOffset":81.38698523978496,"transparency":false,"texture":"blueWall"},{"p1":{"x":19,"y":-274},"p2":{"x":246,"y":-395},"color":"red","textureOffset":0,"transparency":false,"texture":"redWall"},{"p1":{"x":246,"y":-395},"p2":{"x":240,"y":-670},"color":"red","textureOffset":72.35300843410687,"transparency":false,"texture":"redWall"},{"p1":{"x":240,"y":-670},"p2":{"x":64,"y":-806},"color":"red","textureOffset":23.00747601086914,"transparency":false,"texture":"redWall"},{"p1":{"x":64,"y":-806},"p2":{"x":35,"y":-811},"color":"red","textureOffset":47.23767992412422,"transparency":false,"texture":"redWall"},{"p1":{"x":-19,"y":-813},"p2":{"x":-48,"y":-807},"color":"red","textureOffset":81.88670275961931,"transparency":false,"texture":"redWall"},{"p1":{"x":-48,"y":-807},"p2":{"x":-222,"y":-696},"color":"red","textureOffset":78.02856065883623,"transparency":false,"texture":"redWall"},{"p1":{"x":-222,"y":-696},"p2":{"x":-231,"y":-396},"color":"red","textureOffset":41.93262819686015,"transparency":false,"texture":"redWall"},{"p1":{"x":-231,"y":-396},"p2":{"x":-40,"y":-276},"color":"red","textureOffset":43.282324583470654,"transparency":false,"texture":"redWall"},{"p1":{"x":-10,"y":-317},"p2":{"x":4,"y":-335},"color":"orange","textureOffset":0,"transparency":false,"texture":"dirtWall"},{"p1":{"x":4,"y":-335},"p2":{"x":-18,"y":-337},"color":"orange","textureOffset":28.03508501982759,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-18,"y":-337},"p2":{"x":-10,"y":-317},"color":"orange","textureOffset":48.942305363572814,"transparency":false,"texture":"dirtWall"},{"p1":{"x":44,"y":-421},"p2":{"x":69,"y":-423},"color":"orange","textureOffset":45.967477524976886,"transparency":false,"texture":"dirtWall"},{"p1":{"x":69,"y":-423},"p2":{"x":54,"y":-404},"color":"orange","textureOffset":96.76620160466592,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-82,"y":-399},"p2":{"x":-98,"y":-422},"color":"orange","textureOffset":99.7593776197773,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-98,"y":-422},"p2":{"x":-77,"y":-430},"color":"orange","textureOffset":79.93789214221528,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-77,"y":-430},"p2":{"x":-82,"y":-399},"color":"orange","textureOffset":4.659942684657551,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-176,"y":-486},"p2":{"x":-154,"y":-488},"color":"orange","textureOffset":99.48636185864757,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-154,"y":-488},"p2":{"x":-165,"y":-465},"color":"orange","textureOffset":20.393582202392793,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-165,"y":-465},"p2":{"x":-176,"y":-486},"color":"orange","textureOffset":75.34455788203206,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-48,"y":-501},"p2":{"x":-37,"y":-477},"color":"orange","textureOffset":1.16904278602874,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-37,"y":-477},"p2":{"x":-24,"y":-504},"color":"orange","textureOffset":65.17661843491044,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-24,"y":-504},"p2":{"x":-48,"y":-501},"color":"orange","textureOffset":64.84309971034435,"transparency":false,"texture":"dirtWall"},{"p1":{"x":73,"y":-510},"p2":{"x":96,"y":-511},"color":"orange","textureOffset":20.05332296723418,"transparency":false,"texture":"dirtWall"},{"p1":{"x":96,"y":-511},"p2":{"x":80,"y":-490},"color":"orange","textureOffset":50.27061163166093,"transparency":false,"texture":"dirtWall"},{"p1":{"x":80,"y":-490},"p2":{"x":73,"y":-510},"color":"orange","textureOffset":14.278187280542625,"transparency":false,"texture":"dirtWall"},{"p1":{"x":131,"y":-468},"p2":{"x":155,"y":-470},"color":"orange","textureOffset":42.274939883439856,"transparency":false,"texture":"dirtWall"},{"p1":{"x":155,"y":-470},"p2":{"x":143,"y":-446},"color":"orange","textureOffset":83.10683145928579,"transparency":false,"texture":"dirtWall"},{"p1":{"x":143,"y":-446},"p2":{"x":131,"y":-468},"color":"orange","textureOffset":51.43498875926059,"transparency":false,"texture":"dirtWall"},{"p1":{"x":187,"y":-573},"p2":{"x":155,"y":-575},"color":"orange","textureOffset":92.03427048209392,"transparency":false,"texture":"dirtWall"},{"p1":{"x":155,"y":-575},"p2":{"x":174,"y":-549},"color":"orange","textureOffset":12.658661319721887,"transparency":false,"texture":"dirtWall"},{"p1":{"x":174,"y":-549},"p2":{"x":187,"y":-573},"color":"orange","textureOffset":34.683505081814246,"transparency":false,"texture":"dirtWall"},{"p1":{"x":33,"y":-600},"p2":{"x":-3,"y":-603},"color":"orange","textureOffset":71.12007292749809,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-3,"y":-603},"p2":{"x":17,"y":-578},"color":"orange","textureOffset":32.367910291266924,"transparency":false,"texture":"dirtWall"},{"p1":{"x":17,"y":-578},"p2":{"x":27,"y":-601},"color":"orange","textureOffset":52.52412216290935,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-113,"y":-592},"p2":{"x":-143,"y":-593},"color":"orange","textureOffset":6.212720751641882,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-143,"y":-593},"p2":{"x":-131,"y":-577},"color":"orange","textureOffset":6.37934114771457,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-131,"y":-577},"p2":{"x":-113,"y":-592},"color":"orange","textureOffset":6.37934114771457,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-198,"y":-554},"p2":{"x":-178,"y":-555},"color":"orange","textureOffset":71.76147934526227,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-178,"y":-555},"p2":{"x":-194,"y":-529},"color":"orange","textureOffset":72.01132329027013,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-194,"y":-529},"p2":{"x":-198,"y":-554},"color":"orange","textureOffset":77.29807373974506,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-180,"y":-667},"p2":{"x":-156,"y":-672},"color":"orange","textureOffset":74.72432870773196,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-156,"y":-672},"p2":{"x":-165,"y":-649},"color":"orange","textureOffset":19.877342150357208,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-165,"y":-649},"p2":{"x":-180,"y":-667},"color":"orange","textureOffset":66.85912285492657,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-82,"y":-655},"p2":{"x":-57,"y":-657},"color":"orange","textureOffset":88.48621690792481,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-57,"y":-657},"p2":{"x":-73,"y":-634},"color":"orange","textureOffset":39.284940987613936,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-73,"y":-634},"p2":{"x":-82,"y":-655},"color":"orange","textureOffset":19.463455510051972,"transparency":false,"texture":"dirtWall"},{"p1":{"x":56,"y":-686},"p2":{"x":91,"y":-680},"color":"orange","textureOffset":62.326976707198355,"transparency":false,"texture":"dirtWall"},{"p1":{"x":91,"y":-680},"p2":{"x":70,"y":-654},"color":"orange","textureOffset":17.43259479849246,"transparency":false,"texture":"dirtWall"},{"p1":{"x":70,"y":-654},"p2":{"x":56,"y":-686},"color":"orange","textureOffset":51.64809413986052,"transparency":false,"texture":"dirtWall"},{"p1":{"x":33,"y":-757},"p2":{"x":10,"y":-756},"color":"orange","textureOffset":47.25740435313173,"transparency":false,"texture":"dirtWall"},{"p1":{"x":10,"y":-756},"p2":{"x":22,"y":-746},"color":"orange","textureOffset":77.47469301755848,"transparency":false,"texture":"dirtWall"},{"p1":{"x":22,"y":-746},"p2":{"x":33,"y":-757},"color":"orange","textureOffset":33.67968653569159,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-54,"y":-752},"p2":{"x":-87,"y":-747},"color":"orange","textureOffset":60.678775558105826,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-87,"y":-747},"p2":{"x":-72,"y":-731},"color":"orange","textureOffset":94.44516092367854,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-72,"y":-731},"p2":{"x":-54,"y":-752},"color":"orange","textureOffset":13.762282918291646,"transparency":false,"texture":"dirtWall"},{"p1":{"x":44,"y":-421},"p2":{"x":54,"y":-404},"color":"orange","textureOffset":0,"transparency":false,"texture":"dirtWall"},{"p1":{"x":-19,"y":-813},"p2":{"x":-19,"y":-888},"color":"darkgrey","textureOffset":0,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-19,"y":-888},"p2":{"x":401,"y":-881},"color":"darkgrey","textureOffset":50,"transparency":false,"texture":"metalWall1"},{"p1":{"x":401,"y":-881},"p2":{"x":381,"y":-610},"color":"darkgrey","textureOffset":50.58329282969953,"transparency":false,"texture":"metalWall1"},{"p1":{"x":381,"y":-610},"p2":{"x":366,"y":-609},"color":"darkgrey","textureOffset":67.95334492050733,"transparency":false,"texture":"metalWall1"},{"p1":{"x":338,"y":-611},"p2":{"x":317,"y":-611},"color":"darkgrey","textureOffset":98.99968565660038,"transparency":false,"texture":"metalWall1"},{"p1":{"x":317,"y":-611},"p2":{"x":333,"y":-851},"color":"darkgrey","textureOffset":8.999685656600377,"transparency":false,"texture":"metalWall1"},{"p1":{"x":333,"y":-851},"p2":{"x":31,"y":-838},"color":"darkgrey","textureOffset":14.327106196265504,"transparency":false,"texture":"metalWall1"},{"p1":{"x":31,"y":-838},"p2":{"x":35,"y":-811},"color":"darkgrey","textureOffset":37.123824468931616,"transparency":false,"texture":"metalWall1"},{"p1":{"x":45,"y":-830},"p2":{"x":55,"y":-846},"color":"red","textureOffset":0,"transparency":false,"texture":"redWall"},{"p1":{"x":55,"y":-846},"p2":{"x":61,"y":-835},"color":"red","textureOffset":88.67962264113206,"transparency":false,"texture":"redWall"},{"p1":{"x":133,"y":-834},"p2":{"x":146,"y":-849},"color":"red","textureOffset":34.048704598336485,"transparency":false,"texture":"redWall"},{"p1":{"x":146,"y":-849},"p2":{"x":152,"y":-839},"color":"red","textureOffset":32.543037011128575,"transparency":false,"texture":"redWall"},{"p1":{"x":238,"y":-838},"p2":{"x":255,"y":-853},"color":"red","textureOffset":9.220212477815494,"transparency":false,"texture":"redWall"},{"p1":{"x":255,"y":-853},"p2":{"x":268,"y":-839},"color":"red","textureOffset":56.80858054061446,"transparency":false,"texture":"redWall"},{"p1":{"x":34,"y":-902},"p2":{"x":52,"y":-880},"color":"red","textureOffset":0,"transparency":false,"texture":"redWall"},{"p1":{"x":52,"y":-880},"p2":{"x":62,"y":-897},"color":"red","textureOffset":84.25340807103788,"transparency":false,"texture":"redWall"},{"p1":{"x":130,"y":-898},"p2":{"x":144,"y":-882},"color":"red","textureOffset":61.55776274097025,"transparency":false,"texture":"redWall"},{"p1":{"x":144,"y":-882},"p2":{"x":156,"y":-897},"color":"red","textureOffset":74.16067899566326,"transparency":false,"texture":"redWall"},{"p1":{"x":237,"y":-896},"p2":{"x":254,"y":-880},"color":"red","textureOffset":76.31613216179414,"transparency":false,"texture":"redWall"},{"p1":{"x":254,"y":-880},"p2":{"x":273,"y":-894},"color":"red","textureOffset":9.768482760369182,"transparency":false,"texture":"redWall"},{"p1":{"x":-25,"y":9},"p2":{"x":-62,"y":42},"color":"black","textureOffset":0,"transparency":false},{"p1":{"x":-62,"y":42},"p2":{"x":50,"y":33},"color":"black","textureOffset":95.78221024962158,"transparency":false},{"p1":{"x":50,"y":33},"p2":{"x":18,"y":8},"color":"black","textureOffset":19.39246296183319,"transparency":false},{"p1":{"x":338,"y":-611},"p2":{"x":320,"y":-589},"color":"black","textureOffset":0,"transparency":false},{"p1":{"x":320,"y":-589},"p2":{"x":373,"y":-593},"color":"black","textureOffset":84.25340807103788,"transparency":false},{"p1":{"x":373,"y":-593},"p2":{"x":366,"y":-609},"color":"black","textureOffset":15.760698707770302,"transparency":false}],"entities":[{"pos":{"x":389,"y":-868},"name":"Kynakat","rot":3.142,"roboType":"Turret"},{"pos":{"x":-203,"y":-686},"name":"Johe","rot":0.524,"roboType":"Turret"},{"pos":{"x":211,"y":-660},"name":"Benan","rot":2.269,"roboType":"Turret"},{"pos":{"x":-168,"y":-507},"name":"Jarob","rot":5.934,"roboType":"Turret"},{"pos":{"x":-8,"y":-409},"name":"Jaby","rot":1.571,"roboType":"Turret"},{"pos":{"x":142,"y":-501},"name":"Janaty","rot":3.316,"roboType":"Turret"},{"pos":{"x":-12,"y":-701},"name":"Kyhor","rot":4.712,"roboType":"Turret"}],"triggerZones":[{"editID":0,"topleft":{"x":-152,"y":17},"bottomright":{"x":170,"y":86},"type":"AABB"},{"editID":1,"topleft":{"x":310,"y":-605},"bottomright":{"x":396,"y":-567},"type":"AABB"}]}';
S1R4Level.onLoad = function() {
	for (var entity in this.entities) {
		if (this.entities[entity] == player || this.entities[entity].name == "Kynakat") continue;

		this.entities[entity].health = 20;
	}

	var doortrigger1 = this.getTriggerZoneByEditID(0);
	doortrigger1.onTriggerEnter = function(entity) {
		if (entity == player) {
			S1R3Level.startIndex = 1;
			S1R3Level.load();
		}
	}

	var doortrigger2 = this.getTriggerZoneByEditID(1);
	doortrigger2.onTriggerEnter = function(entity) {
		if (entity == player) {
			S1R5Level.startIndex = 0;
			S1R5Level.load();
		}
	}
}


var S1R5Level = new LevelClass();
S1R5Level.levelJSON = '{"playerStart":{"x":0,"y":0,"rot":4.71238898038469},"startIndex":0,"startList":[{"x":0,"y":0,"rot":4.71238898038469},{"x":8,"y":-221,"rot":1.5707963267948948}],"walls":[{"p1":{"x":-134,"y":15},"p2":{"x":-14,"y":15},"color":"darkgrey","textureOffset":0,"transparency":false,"texture":"metalWall1"},{"p1":{"x":15,"y":15},"p2":{"x":125,"y":13},"color":"darkgrey","textureOffset":90,"transparency":false,"texture":"metalWall1"},{"p1":{"x":125,"y":13},"p2":{"x":127,"y":-63},"color":"darkgrey","textureOffset":90.18180315800532,"transparency":false,"texture":"metalWall1"},{"p1":{"x":123,"y":-95},"p2":{"x":115,"y":-155},"color":"darkgrey","textureOffset":72.93522543987581,"transparency":false,"texture":"metalWall1"},{"p1":{"x":113,"y":-184},"p2":{"x":115,"y":-234},"color":"darkgrey","textureOffset":68.93390053171072,"transparency":false,"texture":"metalWall1"},{"p1":{"x":115,"y":-234},"p2":{"x":23,"y":-235},"color":"darkgrey","textureOffset":69.33374065958287,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-10,"y":-235},"p2":{"x":-136,"y":-235},"color":"darkgrey","textureOffset":19.388086880500396,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-136,"y":-235},"p2":{"x":-136,"y":-187},"color":"darkgrey","textureOffset":79.3880868805004,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-136,"y":-159},"p2":{"x":-136,"y":-100},"color":"darkgrey","textureOffset":39.388086880500396,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-136,"y":-100},"p2":{"x":-139,"y":-71},"color":"darkgrey","textureOffset":29.388086880500396,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-139,"y":-46},"p2":{"x":-134,"y":15},"color":"darkgrey","textureOffset":70.9356816227654,"transparency":false,"texture":"metalWall1"},{"p1":{"x":-139,"y":-71},"p2":{"x":-149,"y":-73},"color":"blue","textureOffset":0,"transparency":false,"texture":"blueWall"},{"p1":{"x":-149,"y":-73},"p2":{"x":-153,"y":-112},"color":"blue","textureOffset":1.980390271855697,"transparency":false,"texture":"blueWall"},{"p1":{"x":-153,"y":-112},"p2":{"x":-207,"y":-113},"color":"blue","textureOffset":94.0263059501089,"transparency":false,"texture":"blueWall"},{"p1":{"x":-207,"y":-113},"p2":{"x":-204,"y":-10},"color":"blue","textureOffset":34.118890605740035,"transparency":false,"texture":"blueWall"},{"p1":{"x":-204,"y":-10},"p2":{"x":-154,"y":-11},"color":"blue","textureOffset":64.55569119081224,"transparency":false,"texture":"blueWall"},{"p1":{"x":-154,"y":-11},"p2":{"x":-152,"y":-46},"color":"blue","textureOffset":64.6556811928117,"transparency":false,"texture":"blueWall"},{"p1":{"x":-152,"y":-46},"p2":{"x":-139,"y":-46},"color":"blue","textureOffset":15.226644051973835,"transparency":false,"texture":"blueWall"},{"p1":{"x":-136,"y":-187},"p2":{"x":-148,"y":-188},"color":"blue","textureOffset":0,"transparency":false,"texture":"blueWall"},{"p1":{"x":-148,"y":-188},"p2":{"x":-155,"y":-237},"color":"blue","textureOffset":20.415945787922965,"transparency":false,"texture":"blueWall"},{"p1":{"x":-155,"y":-237},"p2":{"x":-220,"y":-233},"color":"blue","textureOffset":15.39069261850625,"transparency":false,"texture":"blueWall"},{"p1":{"x":-220,"y":-233},"p2":{"x":-209,"y":-128},"color":"blue","textureOffset":66.62029882510365,"transparency":false,"texture":"blueWall"},{"p1":{"x":-209,"y":-128},"p2":{"x":-153,"y":-127},"color":"blue","textureOffset":22.366480442636202,"transparency":false,"texture":"blueWall"},{"p1":{"x":-153,"y":-127},"p2":{"x":-150,"y":-163},"color":"blue","textureOffset":82.45575904025395,"transparency":false,"texture":"blueWall"},{"p1":{"x":-150,"y":-163},"p2":{"x":-136,"y":-159},"color":"blue","textureOffset":43.70359640402279,"transparency":false,"texture":"blueWall"},{"p1":{"x":113,"y":-184},"p2":{"x":126,"y":-186},"color":"blue","textureOffset":0,"transparency":false,"texture":"blueWall"},{"p1":{"x":126,"y":-186},"p2":{"x":128,"y":-234},"color":"blue","textureOffset":31.52946437965906,"transparency":false,"texture":"blueWall"},{"p1":{"x":128,"y":-234},"p2":{"x":185,"y":-235},"color":"blue","textureOffset":11.945950358231642,"transparency":false,"texture":"blueWall"},{"p1":{"x":185,"y":-235},"p2":{"x":187,"y":-131},"color":"blue","textureOffset":82.03366290780059,"transparency":false,"texture":"blueWall"},{"p1":{"x":187,"y":-131},"p2":{"x":134,"y":-132},"color":"blue","textureOffset":22.225952823468106,"transparency":false,"texture":"blueWall"},{"p1":{"x":134,"y":-132},"p2":{"x":128,"y":-157},"color":"blue","textureOffset":52.32028405141091,"transparency":false,"texture":"blueWall"},{"p1":{"x":128,"y":-157},"p2":{"x":115,"y":-155},"color":"blue","textureOffset":9.419486695059732,"transparency":false,"texture":"blueWall"},{"p1":{"x":123,"y":-95},"p2":{"x":132,"y":-96},"color":"blue","textureOffset":0,"transparency":false,"texture":"blueWall"},{"p1":{"x":132,"y":-96},"p2":{"x":136,"y":-123},"color":"blue","textureOffset":90.55385138137417,"transparency":false,"texture":"blueWall"},{"p1":{"x":136,"y":-123},"p2":{"x":187,"y":-122},"color":"blue","textureOffset":63.50073266049776,"transparency":false,"texture":"blueWall"},{"p1":{"x":187,"y":-122},"p2":{"x":187,"y":-18},"color":"blue","textureOffset":73.59876245477176,"transparency":false,"texture":"blueWall"},{"p1":{"x":187,"y":-18},"p2":{"x":137,"y":-21},"color":"blue","textureOffset":13.598762454771759,"transparency":false,"texture":"blueWall"},{"p1":{"x":137,"y":-21},"p2":{"x":135,"y":-65},"color":"blue","textureOffset":14.497953909499529,"transparency":false,"texture":"blueWall"},{"p1":{"x":135,"y":-65},"p2":{"x":127,"y":-63},"color":"blue","textureOffset":54.95226482040431,"transparency":false,"texture":"blueWall"},{"p1":{"x":-14,"y":15},"p2":{"x":-25,"y":42},"color":"black","textureOffset":0,"transparency":false},{"p1":{"x":-25,"y":42},"p2":{"x":26,"y":41},"color":"black","textureOffset":91.547594742265,"transparency":false},{"p1":{"x":26,"y":41},"p2":{"x":15,"y":15},"color":"black","textureOffset":1.6456245365390032,"transparency":false},{"p1":{"x":-10,"y":-235},"p2":{"x":-25,"y":-268},"color":"black","textureOffset":0,"transparency":false},{"p1":{"x":-25,"y":-268},"p2":{"x":30,"y":-266},"color":"black","textureOffset":62.491379207837156,"transparency":false},{"p1":{"x":30,"y":-266},"p2":{"x":23,"y":-235},"color":"black","textureOffset":12.85489544051768,"transparency":false}],"entities":[{"pos":{"x":-186,"y":-223},"name":"Jasky","rot":4.712,"roboType":"BitBunny"},{"pos":{"x":159,"y":-226},"name":"Kykate","rot":4.712,"roboType":"BitBunny"},{"pos":{"x":-178,"y":-24},"name":"Benjohty","rot":4.712,"roboType":"BitBunny"},{"pos":{"x":-180,"y":-140},"name":"Jastor","rot":4.712,"roboType":"BitBunny"},{"pos":{"x":161,"y":-144},"name":"Mikbit","rot":4.712,"roboType":"BitBunny"},{"pos":{"x":-181,"y":-103},"name":"Bybeney","rot":4.712,"roboType":"BitBunny"},{"pos":{"x":160,"y":-36},"name":"Miko","rot":4.712,"roboType":"BitBunny"},{"pos":{"x":164,"y":-113},"name":"Jakybit","rot":4.712,"roboType":"BitBunny"}],"triggerZones":[{"editID":0,"topleft":{"x":-50,"y":23},"bottomright":{"x":51,"y":69},"type":"AABB"},{"editID":1,"topleft":{"x":-41,"y":-283},"bottomright":{"x":54,"y":-241},"type":"AABB"}]}';
S1R5Level.onLoad = function() {
	this.opendoor = false;

	this.doorwall1 = new WallClass();
	this.doorwall1.p1 = {x:-10, y:-235};
	this.doorwall1.p2 = {x:23, y:-235};
	this.doorwall1.p1ClosePos = {x:-10, y:-235};
	this.doorwall1.p1OpenPos = {x:23, y:-235};
	this.doorwall1.texture = new Image();
	this.doorwall1.texture.src = './images/redWall.png';
	this.walls.push(this.doorwall1);

	this.doorwall2 = new WallClass();
	this.doorwall2.p1 = {x:-14, y:15};
	this.doorwall2.p2 = {x:15, y:15};
	this.doorwall2.p1ClosePos = {x:-14, y:15};
	this.doorwall2.p1OpenPos = {x:15, y:15};
	this.doorwall2.texture = new Image();
	this.doorwall2.texture.src = './images/blueWall.png';
	this.walls.push(this.doorwall2);

	this.enemiesleft = 0;
	for (var entity in this.entities) {
		if (this.entities[entity] == player) continue;

		this.enemiesleft++;
		this.entities[entity].brain.onDestroy = function() {
			this.level.enemiesleft--;

			if (this.level.enemiesleft <= 0) {
				this.level.opendoor = true;
			}
		}
	}

	var doortrigger1 = this.getTriggerZoneByEditID(0);
	doortrigger1.onTriggerEnter = function(entity) {
		if (entity == player) {
			S1R4Level.startIndex = 1;
			S1R4Level.load();
		}
	}

	var doortrigger2 = this.getTriggerZoneByEditID(1);
	doortrigger2.onTriggerEnter = function(entity) {
		if (entity == player) {
			S2R1Level.startIndex = 0;
			S2R1Level.load();
		}
	}
}
S1R5Level.onUpdate = function(deltaTime) {
	if (this.opendoor) {
		if (this.doorwall1.p1.x > this.doorwall1.p1OpenPos.x) {
			this.doorwall1.p1.x -= 0.1;
		}
		if (this.doorwall1.p1.x < this.doorwall1.p1OpenPos.x) {
			this.doorwall1.p1.x += 0.1;
		}
		if (this.doorwall1.p1.y > this.doorwall1.p1OpenPos.y) {
			this.doorwall1.p1.y -= 0.1;
		}
		if (this.doorwall1.p1.y < this.doorwall1.p1OpenPos.y) {
			this.doorwall1.p1.y += 0.1;
		}
		if (this.doorwall2.p1.x > this.doorwall2.p1OpenPos.x) {
			this.doorwall2.p1.x -= 0.1;
		}
		if (this.doorwall2.p1.x < this.doorwall2.p1OpenPos.x) {
			this.doorwall2.p1.x += 0.1;
		}
		if (this.doorwall2.p1.y > this.doorwall2.p1OpenPos.y) {
			this.doorwall2.p1.y -= 0.1;
		}
		if (this.doorwall2.p1.y < this.doorwall2.p1OpenPos.y) {
			this.doorwall2.p1.y += 0.1;
		}
	}
}