const ASTAR_LEVEL_COLS = 1000;
const ASTAR_LEVEL_ROWS = 1000;
const ASTAR_MAX_SEARCH_LOOPS = 50;
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
		return y * LEVEL_ROWS + x;
	}

	let frontier = new PriorityQueue();
	frontier.enqueue(base, 0);
	let pathToHere = Array(LEVEL_COLS * LEVEL_ROWS).fill(ASTAR_PATH_INIT);
	let costToHere = Array(LEVEL_COLS * LEVEL_ROWS).fill(ASTAR_COST_INIT);
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
	let loops = 0;
	while (!frontier.empty() && loops++ < max_loops) {
		let current = frontier.dequeue();
		const currentIndex = posXYToArrayIndex(current.x, current.y);

		if (current.x == goal.x &&
			current.y == goal.y) { break; }

		for (let { dx, dy } of directions) {
			let next = { x: current.x + dx, y: current.y + dy };

			if (next.x < 0 || next.x >= LEVEL_COLS ||
				next.y < 0 || next.y >= LEVEL_ROWS) {
				continue;
			}

			const nextIndex = posXYToArrayIndex(next.x, next.y);
			// set next tile cost to 1 for walkable and higher for less so
			let nextTileCost = ASTAR_COST_EASY;

            // TODO add wall positioning to next tile cost
			const nextWallPos =
				getClosestIntersection(current, next, currentMap.walls);
			if (nextTileCost === ASTAR_COST_EASY && nextWallPos !== null) {
				nextTileCost = ASTAR_COST_MAX;
			}

			// TODO add entity positioning to next tile cost
			if (nextTileCost === ASTAR_COST_EASY) {
				for(let e of currentMap.entities) {
					if (next.x >= e.x - e.sprite._w &&
						next.x <= e.x + e.sprite._w &&
						next.y >= e.y - e.sprite._h &&
						next.y <= e.y + e.sprite._h
					) {
						nextTileCost = ASTAR_COST_MAX;
					}
				}	
			}

			const newCost = costToHere[currentIndex] + nextTileCost;

			if ((newCost > 0 && costToHere[nextIndex] === 0) || 
				newCost < costToHere[nextIndex]
			) {
				// use new cost to get to the next tile
				costToHere[nextIndex] = newCost;
				const priority = newCost + heuristic(next, goal);
				frontier.enqueue(next, priority);
				pathToHere[nextIndex] = currentIndex;
				lastIndex = nextIndex;
			}
		}
	}

	const pathToLast = (() => {	
		const baseIndex = posXYToArrayIndex(base.x, base.y);
		let pathToLast = Array(LEVEL_COLS * LEVEL_ROWS).fill(-1);
		let nextIndex = lastIndex;
		let currentIndex = nextIndex > -1 ? pathToHere[nextIndex] : -1;
		while (currentIndex > -1 && currentIndex != baseIndex) {
			pathToLast[currentIndex] = nextIndex;
			nextIndex = currentIndex;
			currentIndex = pathToHere[nextIndex];
		}
		pathToLast[currentIndex] = nextIndex;
		return pathToLast;
	})();

	return { path: pathToLast, cost: costToHere };
}