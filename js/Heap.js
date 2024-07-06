const HEAP_LOOP_MAX = 1000;

class Heap {
    #data = [];
    #basicDiff = (a, b) => a - b; 
    #compareFx = null;
    #isMaxHeap = false;

    constructor(isMaxHeapIn = false, compareFxIn = this.#basicDiff) {
        this.#isMaxHeap ||= isMaxHeapIn;
        this.#compareFx ??= compareFxIn;
    }

    get isMaxHeap() { return this.#isMaxHeap; }

    add(value) {
        this.#data.push(value); 
        this.#heapifyUp();
    }

    poll() {
        const lastElement = this.#data.pop() ?? null;
        let returnValue = lastElement;
        if (this.#data.length > 0) {
            // move last element to root and true-up heap
            returnValue = this.#data[0];
            this.#data[0] = lastElement;
            this.#heapifyDown();
        }
        return returnValue;
    }

    #minCompare = (a, b) => this.#compareFx(a, b) < 0;
    #maxCompare = (a, b) => this.#compareFx(a, b) > 0;

    #compare(a, b) {
        let compareAlgo = this.#isMaxHeap ? this.#maxCompare : this.#minCompare;
        return compareAlgo(a, b);
    }

    #indexInBounds = (index = this.#data.length) => 
        index >= 0 && index < this.#data.length;

    #getDataValue = (index) => 
        this.#indexInBounds(index) ? this.#data[index] : null;

    #swapValues = (iP, iC, vP, vC) => {
        const temp = vP;
        this.#data[iP] = vC;
        this.#data[iC] = temp;
    }

    #heapifyUp() {
        let childIndex = this.#data.length - 1;
        if (childIndex > 0) {
            let i = 0;
            function maxLoopsReached() { i++ >= HEAP_LOOP_MAX; }

            let lookForSwaps = true;
            const keepLooping = () => 
                childIndex > 0 &&
                lookForSwaps && 
                !maxLoopsReached();

            while (keepLooping() === true) {
                let childValue = this.#getDataValue(childIndex);
                let parentIndex =  Math.max(0, Math.floor((childIndex - 1) / 2));
                let parentValue = this.#getDataValue(parentIndex);

                if (
                    this.#indexInBounds(childIndex) &&
                    this.#compare(childValue, parentValue)
                ) {
                    this.#swapValues(parentIndex, childIndex, parentValue, childValue);
                    childIndex = parentIndex;
                } else {
                    // stop if no swaps
                    lookForSwaps = false;
                }
            }

            if (debug && maxLoopsReached()) {
                console.warning("heapifyUp: max loops reached and exited");
            }
        }
    }

    #heapifyDown() {
        if (this.#data.length > 1) {
            let parentIndex = 0;
            let i = 0;
            const maxLoopsReached = () => i++ >= HEAP_LOOP_MAX;

            let lookForSwaps = true;
            const keepLooping = () => 
                this.#indexInBounds(parentIndex) && 
                lookForSwaps && 
                !maxLoopsReached();

            while (keepLooping()) {
                let parentValue = this.#getDataValue(parentIndex);
                let childIndex2 = Math.floor((parentIndex + 1) * 2);
                let childIndex1 = childIndex2 - 1;
                let childValue1 = this.#getDataValue(childIndex1);
                let childValue2 = this.#getDataValue(childIndex2);

                if (
                    this.#indexInBounds(childIndex1) &&
                    this.#compare(childValue1, parentValue)
                ) {
                    this.#swapValues(parentIndex, childIndex1, parentValue, childValue1);
                    parentIndex = childIndex1;
                } else if (
                    this.#indexInBounds(childIndex2) &&
                    this.#compare(childValue2, parentValue)
                ) {
                    this.#swapValues(parentIndex, childIndex2, parentValue, childValue2);
                    parentIndex = childIndex2;
                } else {
                    // stop if no swap
                    lookForSwaps = false;
                }
            }

            if (debug && maxLoopsReached()) {
                console.warning("heapifyDown: max loops reached and exited");
            }
        }
    }
}

class MinHeap extends Heap {
    constructor(compareFxIn) {
      super(false, compareFxIn)
    }
}

class MaxHeap extends Heap {
    constructor(compareFxIn) {
      super(true, compareFxIn)
    }
}

function testAllHeaps() { heapTest(); minHeapTest(); maxHeapTest(); }
function heapTest() {
    // Heap test
    if (debug) { console.log("new Heap() test"); }	
    const testHeap = new Heap();
    testHeap.add(1);
    testHeap.add(0);
    testHeap.add(-1);
    testHeap.add(-2);
    const loopMax = 20;
    let loop = 0;
    let value = testHeap.poll();
    const keepLooping = () => loop++ <= loopMax && value !== null;
    while (keepLooping()) {
        if (debug && value !== null) { console.log(value); }	
        value = testHeap.poll();
    }
    if (debug) { console.log("new Heap() test done"); }	
}

function minHeapTest() {
    // MinHeap test
    if (debug) { console.log("new MinHeap() test"); }	
    const testHeap = new MinHeap();
    testHeap.add(4);
    testHeap.add(3);
    testHeap.add(2);
    testHeap.add(1);
    const loopMax = 20;
    let loop = 0;
    let value = testHeap.poll();
    const keepLooping = () => loop++ <= loopMax && value !== null;
    while (keepLooping()) {
        if (debug && value !== null) { console.log(value); }	
        value = testHeap.poll();
    }
    if (debug) { console.log("new MinHeap() test done"); }	
}

function maxHeapTest() {
    // MaxHeap test
    if (debug) { console.log("new MaxHeap() test"); }	
    const testHeap = new MaxHeap();
    testHeap.add(1);
    testHeap.add(2);
    testHeap.add(3);
    testHeap.add(4);
    const loopMax = 20;
    let loop = 0;
    let value;
    const keepLooping = () => loop++ <= loopMax && value !== null;
    while (keepLooping()) {
        value = testHeap.poll();
        if (debug && value) { console.log(value); }	
    }
    if (debug) { console.log("new MaxHeap() test done"); }	
}
