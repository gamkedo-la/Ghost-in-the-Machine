const HEAP_LOOP_MAX = 1000;

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

class Heap {
    #data = [];
    #basicDiff = (a, b) => a - b; 
    #compareFx = this.#basicDiff;
    #isMaxHeap = false;

    constructor(isMaxHeapIn, compareFxIn) {
        this.#isMaxHeap ??= isMaxHeapIn;
        this.#compareFx ??= compareFxIn;
    }

    constructor() {
        this.constructor(false);
    }

    get isMaxHeap() { return this.#isMaxHeap; }

    add(value) {
        this.#data.push(value); 
        this.#heapifyUp();
    }

    poll() {
        // get root value
        let returnValue = this.#data[0];
        let lastElement = this.#data.pop();
        if (this.#data.length > 0) {
            // move last element to root
            this.#data[0] = lastElement;
            this.#heapifyDown();
        }
        return returnValue;
    }

    #minCompare(a, b) {
        return this.#compareFx(a, b) < 0;
    }

    #maxCompare(a, b) {
        return this.#compareFx(a, b) > 0;
    }

    #compare(a, b) {
        let compareAlgo = this.#isMaxHeap ? this.#maxCompare : this.#minCompare;
        return compareAlgo(a, b);
    }

    #heapifyUp() {
        let childIndex = this.#data.length - 1;
        if (childIndex > 0) {
            const childValue = () => this.#data[childIndex];
            const parentIndex = () => Math.max(0, Math.floor((childIndex - 1) / 2));
            const parentValue = () => this.#data[parentIndex()];
            let i = 0;
            function maxLoopsReached() { i++ >= HEAP_LOOP_MAX; }

            const keepLooping = () => 
                childIndex > 0 &&
                this.#compare(childValue(), parentValue()) && 
                !maxLoopsReached();

            const swapValues = (iP, iC, vP, vC) => {
                const temp = vP;
                this.#data[iP] = vC;
                this.#data[iC] = temp;
            }

            while (keepLooping() === true) {
                swapValues(parentIndex(), childIndex, parentValue(), childValue());
                childIndex = parentIndex();
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

            let noSwapsYet = false;
            const keepLooping = () => !noSwapsYet && !maxLoopsReached();

            const swapValues = (iP, iC, vP, vC) => {
                const temp = vP;
                this.#data[iP] = vC;
                this.#data[iC] = temp;
            }

            const indexInBounds = (index = this.#data.length) => 
                index < this.#data.length;

            const getDataValue = (index) => 
                indexInBounds(index) ? this.#data[index] : null;

            while (keepLooping()) {
                let parentValue = this.#data[parentIndex];
                let childIndex2 = Math.floor((parentIndex + 1) * 2);
                let childIndex1 = childIndex2 - 1;
                let childValue1 = getDataValue(childIndex1);
                let childValue2 = getDataValue(childIndex2);

                if (
                    childIndex1 < this.#data.length &&
                    this.#compare(childValue1, parentValue)
                ) {
                    swapValues(parentIndex, childIndex1, parentValue, childValue1);
                    parentIndex = childIndex1;
                } else if (
                    childIndex2 < this.#data.length &&
                    this.#compare(childValue2, parentValue)
                ) {
                    swapValues(parentIndex, childIndex2, parentValue, childValue2);
                    parentIndex = childIndex2;
                } else {
                    noSwaps = true;
                }
            }

            if (debug && maxLoopsReached()) {
                console.warning("heapifyDown: max loops reached and exited");
            }
        }
    }
}