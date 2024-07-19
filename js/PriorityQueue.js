class PriorityQueue {
    #compareFx = (a, b) => a.priority - b.priority; 
	#data = new MinHeap(this.#compareFx);

	enqueue(element, priority) {
		this.#data.add({element, priority});
	}

	dequeue() {
		return this.#data.poll();
	}

	empty() {
		return this.#data.empty();
	}
}

function testPriorityQueue() { if(debug) { priorityQueueTest(); } }
function priorityQueueTest() {
    // PriorityQueue test
    if (debug) { console.log("new PriorityQueue() test"); }	
    const testPriorityQueue = new PriorityQueue();
    testPriorityQueue.enqueue( { x: 1, y: 0 }, 1);
    testPriorityQueue.enqueue( { x: 0, y: 0 }, 0);
    testPriorityQueue.enqueue( { x: -1, y: 0 }, 1);
    testPriorityQueue.enqueue( { x: -2, y: 0 }, 2);
    const loopMax = 20;
    let loop = 0;
    let value = testPriorityQueue.dequeue();
    const keepLooping = () => loop++ <= loopMax && value !== null;
    while (keepLooping()) {
        if (debug && value !== null) { console.log(value); }	
        value = testPriorityQueue.dequeue();
    }
    if (debug) { console.log("new PriorityQueue() test done"); }	
}
