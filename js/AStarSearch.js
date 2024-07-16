const ASTAR_LEVEL_COLS = 1000;
const ASTAR_LEVEL_ROWS = 1000;
const ASTAR_LEVEL_GRID = ASTAR_LEVEL_COLS * ASTAR_LEVEL_ROWS;
const ASTAR_MAX_SEARCH_LOOPS = 10000;
const ASTAR_PATH_INIT = -1;
const ASTAR_COST_INIT = 0;
const ASTAR_COST_MAX = 100;
const ASTAR_COST_EASY = 1;

function aStarSearch(base, goal) {
	// A* using the following as a reference and inspiration
	// https://www.redblobgames.com/pathfinding/a-star/implementation.html
	// Differences from Dijkstra's and A* can be found in the "Algorithm Changes" section
	// https://www.redblobgames.com/pathfinding/a-star/implementation.html#algorithm

	// Also, reusing and modifying some astar.js code from 
	// HomeTeamGameDev Adventures of Salvator (2024; Project Lead Vince McKeown)
	// https://hometeamgamedev.itch.io/adventure-of-salvatore
	// https://github.com/gamkedo-la/Adventure-of-Salvatore

	function heuristic( first, second ) {
		// Manhattan distance
		const value = 
			Math.abs(first.x - second.x) +
			Math.abs(first.y - second.y); 
		return value;
	}

	function posXYToArrayIndex(x, y) {
		const gridCoord = posXYToAstarLevelGrid(x, y);
		return gridCoord.row * ASTAR_LEVEL_COLS + gridCoord.col;
	}

	function posXYToAstarLevelGrid(x, y) {
		const col = Math.floor(ASTAR_LEVEL_COLS / 2 + x);
		const row = Math.floor(ASTAR_LEVEL_ROWS / 2 + y);
		return { col: col, row: row };
	}
	
	function arrayIndexToPosXY(index) {
        const gridCoord = arrayIndexToAstarLevelGrid(index);
		const x = gridCoord.col - Math.floor(ASTAR_LEVEL_COLS / 2);
		const y = gridCoord.row - Math.floor(ASTAR_LEVEL_ROWS / 2);
		return { x: x, y: y };
	}

	function arrayIndexToAstarLevelGrid(index) {
		const col = Math.floor(index % ASTAR_LEVEL_COLS);
		const row = Math.floor(index / ASTAR_LEVEL_COLS);
		return { col: col, row: row };
	}

	let frontier = new PriorityQueue();
	frontier.enqueue(base, 0);
	let pathToGoal = Array(ASTAR_LEVEL_GRID).fill(ASTAR_PATH_INIT);
	let costToGoal = Array(ASTAR_LEVEL_GRID).fill(ASTAR_COST_INIT);
	let directions = [
		{ dx: 0, dy: -1 },
		{ dx: 1, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: 1, dy: 1 },
		{ dx: 0, dy: 1 },
		{ dx: -1, dy: 1 },
		{ dx: -1, dy: 0 },
		{ dx: -1, dy: -1 },
		{ dx: 0, dy: 0 },
	];

	var lastIndex = -1;
	const max_loops = ASTAR_MAX_SEARCH_LOOPS;
	let loop = 0;
	while (!frontier.empty() && loop++ < max_loops) {
		const current = frontier.dequeue();
		const curElem = current.element;

		if (curElem.x == goal.x && curElem.y == goal.y) { break; }

		for (let { dx, dy } of directions) {
			let next = { x: curElem.x + dx, y: curElem.y + dy };

			const nextGridCoord = posXYToAstarLevelGrid(next.x, next.y);
			if (nextGridCoord.x < 0 || nextGridCoord.x >= ASTAR_LEVEL_COLS ||
				nextGridCoord.y < 0 || nextGridCoord.y >= ASTAR_LEVEL_ROWS) {
				continue;
			}

			// set next tile cost to 1 for walkable and higher for less so
			let nextTileCost = ASTAR_COST_EASY;

            // add wall collision  to next tile cost
			const nextWallPos =
				getClosestIntersection(current, next, currentMap.walls);
			if (nextTileCost === ASTAR_COST_EASY && nextWallPos !== null) {
				nextTileCost = ASTAR_COST_MAX;
			}

			// add entity collision to next tile cost
			if (nextTileCost === ASTAR_COST_EASY) {
				for(let ent of currentMap.entities) {
					if (next.x >= ent.x - ent.sprite._w &&
						next.x <= ent.x + ent.sprite._w &&
						next.y >= ent.y - ent.sprite._h &&
						next.y <= ent.y + ent.sprite._h
					) {
						nextTileCost = ASTAR_COST_MAX;
					}
				}	
			}

			const currentIndex = posXYToArrayIndex(curElem.x, curElem.y);
			const newCost = costToGoal[currentIndex] + nextTileCost;
			const nextIndex = posXYToArrayIndex(next.x, next.y);
			if ((newCost > 0 && costToGoal[nextIndex] === 0) || 
				newCost < costToGoal[nextIndex]
			) {
				// use new cost to get to the next tile
				costToGoal[nextIndex] = newCost;
				const priority = newCost + heuristic(next, goal);
				frontier.enqueue(next, priority);
				pathToGoal[nextIndex] = currentIndex;
				lastIndex = nextIndex;
			} else {
				// if (debug) { 
				// 	console.log("newCost, costToGoal[nextIndex]", newCost, costToGoal[nextIndex]); 
				// }
			}
		}
	}

	if (debug) { console.log("lastIndex: ", lastIndex); }

	const pathAndCostToLast = () => {	
		const baseIndex = posXYToArrayIndex(base.x, base.y);
		let pathToLast = [];
		let costToLast = [];
		let nextIndex = lastIndex;
		let currentIndex = nextIndex > -1 ? pathToGoal[nextIndex] : -1;
		let loop = 0;
		const keepLooping = () => 
			loop < max_loops &&
			currentIndex > -1 && 
			nextIndex > -1 &&
			currentIndex != baseIndex;

		while (keepLooping()) {
			pathToLast[loop] = arrayIndexToPosXY(nextIndex);
			costToLast[loop] = costToGoal[nextIndex];
			nextIndex = currentIndex;
			currentIndex = pathToGoal[nextIndex];
			loop++;
		}

		if (debug && loop >= max_loops) { console.log("loop < max_loops"); }
		if (debug && currentIndex <= -1) { console.log("currentIndex > -1"); }
		if (debug && nextIndex <= -1) { console.log("nextIndex > -1"); }
		if (debug && currentIndex === baseIndex) { console.log("currentIndex != baseIndex"); }

		if (currentIndex === baseIndex) {
			pathToLast[loop] = arrayIndexToPosXY(nextIndex);
			costToLast[loop] = costToGoal[nextIndex];
		}
		return { path: pathToLast.reverse(), cost: costToLast.reverse() };
	}

	return pathAndCostToLast();
}

function testAStarSearch() { if(debug) { aStarSearchTest(); } }
function aStarSearchTest() {
    // AStarSearch test
    if (debug) { console.log("AStarSearch() test"); }		
    const loopMax = 20;
    let loop1 = 0;
	for(let circleRadius = 20; 
		circleRadius < 200 && loop1++ < loopMax; 
		circleRadius += 40
	) {
		let loop2 = 0;
		for(let circleAngle = 0; 
			circleAngle < Math.PI && loop2++ < loopMax; 
			circleAngle += 0.02
		) {
			let base = { 
				x: Math.cos(circleAngle) * circleRadius, 
				y: Math.sin(circleAngle) * circleRadius 
			};
			let goal = { 
				x: Math.cos(circleAngle) * -1 * circleRadius, 
				y: Math.sin(circleAngle) * -1 * circleRadius 
			};
			const aStarResults = aStarSearch(base, goal);

			if (debug) { 
				console.log(
					"base.x, base.y, goal.x, goal.y: ", 
					base.x, base.y, goal.x, goal.y); 
			}
			for (let p = 0; p < aStarResults.path.length; p++) {
			    let path = aStarResults.path[p]; 
			    let cost = aStarResults.cost[p]; 
				if (debug) { console.log("loop, x, y, cost: ", p, path.x, path.y, cost); }
			}
		}
	}
    if (debug) { console.log("AStarSearch() test done"); }	
}
