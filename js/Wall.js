function WallClass(wallClone = {}) {
	this.p1 = wallClone.p1 || {x:0, y:0};
	this.p2 = wallClone.p2 || {x:0, y:0};
	this.color = wallClone.color || "darkgrey";
	this.texture = wallClone.texture || null;
	this.textureOffset = wallClone.textureOffset || 0;
	this.transparency = wallClone.transparency || false;

	this.draw2D = function(){
		colorLine(this.p1.x, this.p1.y, this.p2.x, this.p2.y, 2, this.color);
		if (debug) {
			// colorText(this.p1.x + ":" + this.p1.y, this.p1.x, this.p1.y, this.color, font = "15px Arial");
			// colorText(this.p2.x + ":" + this.p2.y, this.p2.x, this.p2.y, this.color, font = "15px Arial");
		}
	};
}

//Checks if there are no walls in between two points
function lineOfSight(v1, v2, walls) {
	for (var i in walls) {
		if (isLineIntersecting(v1, v2, walls[i].p1, walls[i].p2)) {
			return false;
		}
	}
	return true;
};

function getAllIntersections(p1, p2, walls) {
	var crossPoints = [];

	for (var i in walls) {
		var point = getPointAtLineIntersection(p1, p2, walls[i].p1, walls[i].p2);
		if (point != null) {
			var distance = distanceBetweenTwoPoints(p1, point);
			newPoint = point;
			newPoint.wall = walls[i];
			newPoint.distance = distance;

			crossPoints.push(newPoint);
		}
	}
	crossPoints.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
	return crossPoints;
}

function getClosestIntersection(p1, p2, walls) {
	var closestPoint = null;
	var distance = 1000;

	for (var i in walls) {
		var point = getPointAtLineIntersection(p1, p2, walls[i].p1, walls[i].p2);
		if (point != null) {
			var newDistance = distanceBetweenTwoPoints(p1, point);

			if (newDistance < distance) {
				closestPoint = point;
				closestPoint.wall = walls[i];
				closestPoint.distance = newDistance;
				distance = newDistance;
			}
		}
	}

	return closestPoint;
}

function getOverlappingWallEdgesAsPointPairList(pos, walls) {
	var pointPairList = [];
	var snapDistance = 5;

	for (var i = 0; i < walls.length; i++) {
		var distanceP1 = distanceBetweenTwoPoints(pos, walls[i].p1);
		var distanceP2 = distanceBetweenTwoPoints(pos, walls[i].p2);

		if (distanceP1 < snapDistance) {
			pointPairList.push([walls[i].p1, walls[i].p2]);
		}
		if (distanceP2 < snapDistance) {
			pointPairList.push([walls[i].p2, walls[i].p1]);
		}
	}

	return pointPairList;
}

function circleIsOnLineSegment(p = { x: 0, y: 0 }, radius = 0, line) {
	// find perpendicular distance of circle to infinite line of segment
	let returnValue = false;
	const x = p.x;
	const y = p.y;
	const p1X = line.p1.x;
	const p1Y = line.p1.y;
	const p2X = line.p2.x;
	const p2Y = line.p2.y;
	const a = p2Y - p1Y;
	const b = p1X - p2X;
	const c = p2X * p1Y - p1X * p2Y;
	const num = a * x + b * y + c;
	const den = Math.sqrt(a ** 2 + b ** 2);
	const dist = den === 0 ? 0 : Math.abs(num / den);
	// compare perpendicular distance to circle radius
	if (radius >= dist) {
		// find the projection factor
		const pFNum = (x - p1X) * (p2X - p1X) + (y - p1Y) * (p2Y - p1Y);
		const pFDen = (p2X - p1X) ** 2 + (p2Y - p1Y) ** 2;
		const pF = pFDen === 0 ? 0 : pFNum / pFDen;
		// find distance from circle center to closest point on segment
		const cPDist = (() => {
			let returnValue;
			if (pF >= 0 && pF <= 1) {
				// find closest point on the segment
				const cPX = p1X + (pF * (p2X - p1X));
				const cPY = p1Y + (pF * (p2Y - p1Y));
				const cP = { x: cPX, y: cPY };
				returnValue = distanceBetweenTwoPoints(p, cP);
			} else {
				const p1D = distanceBetweenTwoPoints(p, line.p1);
				const p2D = distanceBetweenTwoPoints(p, line.p2);
				returnValue = p1D < p2D ? p1D : p2D;
			}
			return returnValue;
		})();
		
		// compare closest point distance to radius
		if (cPDist <= radius) {
			returnValue = true;
		}
	} 
	return returnValue;
}

function circleIsOnWall(p = { x: 0, y: 0 }, radius = 0, walls) {
	// where p is the center point of the circle
	let returnValue = false;
	for (var wall of walls) {
		if (returnValue) { break; }
		returnValue = circleIsOnLineSegment(p, radius, wall);
	} 
	return returnValue;
}

function testCircleIsOnLineSegment() { 
	if(debug) { circleIsOnLineSegmentTest(); } 
}
function circleIsOnLineSegmentTest() {
	if (debug) { 
		console.log("circleIsOnLineSegmentTest() tests");

		console.log("circleIsOnLineSegmentTest() test 1");
		let pC = { x: 5, y: 6 };
		let rC = 7;
		let p1 = { x: 1, y: 2 };
		let p2 = { x: 3, y: 4 };
		let expected = true;
		let cIols = circleIsOnLineSegment(pC, rC, { p1, p2 });
		let testResult = cIols ? "passed" : "failed";
		console.log("circle center - pC = { x:", pC.x, ", y:", pC.y, " };");
		console.log("radius - rC = ", rC, ";");
		console.log("wall point 1 - p1 = { x:", p1.x, ", y:", p1.y, " };");
		console.log("wall point 2 - p1 = { x:", p2.x, ", y:", p2.y, " };");
		console.log(
			"circleIsOnLineSegment(pC, rC, { p1, p2 }) === ", 
			cIols, "and should be \"true\"");
		console.log("circleIsOnLineSegmentTest() test 1", testResult);

		console.log("circleIsOnLineSegmentTest() test 2");
		rC = 0.5;
		expected = false;
		cIols = circleIsOnLineSegment(pC, rC, { p1, p2 });
		testResult = !cIols ? "passed" : "failed";
		console.log("circle center - pC = { x:", pC.x, ", y:", pC.y, " };");
		console.log("radius - rC = ", rC, ";");
		console.log("wall point 1 - p1 = { x:", p1.x, ", y:", p1.y, " };");
		console.log("wall point 2 - p1 = { x:", p2.x, ", y:", p2.y, " };");
		console.log(
			"circleIsOnLineSegment(pC, rC, { p1, p2 }) === ", 
			cIols, "and should be ", expected.toString());
		console.log("circleIsOnLineSegmentTest() test 2", testResult);

		console.log("circleIsOnLineSegmentTest() test 3");
		pC = { x: 50, y: 50 };
		rC = 5;
		p1 = { x: -100, y: -100 };
		p2 = { x: 300, y: -100 };
		expected = false;
		cIols = circleIsOnLineSegment(pC, rC, { p1, p2 });
		testResult = !cIols ? "passed" : "failed";
		console.log("circle center - pC = { x:", pC.x, ", y:", pC.y, " };");
		console.log("radius - rC = ", rC, ";");
		console.log("wall point 1 - p1 = { x:", p1.x, ", y:", p1.y, " };");
		console.log("wall point 2 - p1 = { x:", p2.x, ", y:", p2.y, " };");
		console.log(
			"circleIsOnLineSegment(pC, rC, { p1, p2 }) === ", 
			cIols, "and should be ", expected.toString());
		console.log("circleIsOnLineSegmentTest() test 3", testResult);

		console.log("circleIsOnLineSegmentTest() test done");
	}
}

function testCircleIsOnWall(walls) { if(debug) { circleIsOnWallTest(walls); } }
function circleIsOnWallTest(walls = [{ p1: { x: 0, y: -100}, p2: { x: 300, y: -100 }}]) {
    if (debug) { 
		console.log("circleIsOnWallTest() tests");

		console.log("circleIsOnWallTest() test 1");
		let pC = { x: 50, y: 50 };
		let rC = 5;
		let expected = false;
		let cIow = circleIsOnWall(pC, rC, walls);
		let testResult = cIow === expected ? "passed" : "failed";
		console.log("circle center - pC = { x:", pC.x, ", y:", pC.y, " };");
		console.log("radius - rC = ", rC, ";");
		console.log("walls = currentMap.walls;")
		console.log(
			"circleIsOnWall(pC, rC, walls) === ", 
			cIow, "and should be ", expected.toString());
		console.log("circleIsOnWallTest() test 1", testResult);

		console.log("circleIsOnWallTest() test 2");
		pC = { x: 300, y: -100 };
		rC = 5;
		expected = true;
		cIow = circleIsOnWall(pC, rC, walls);
		testResult = cIow === expected ? "passed" : "failed";
		console.log("circle center - pC = { x:", pC.x, ", y:", pC.y, " };");
		console.log("radius - rC = ", rC, ";");
		console.log("walls = currentMap.walls;")
		console.log(
			"circleIsOnWall(pC, rC, walls) === ", 
			cIow, "and should be ", expected.toString());
		console.log("circleIsOnWallTest() test 2", testResult);

		console.log("circleIsOnWallTest() test done");
	}
}
