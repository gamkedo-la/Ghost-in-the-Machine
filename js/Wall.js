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
