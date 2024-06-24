const HEAP_LOOP_MAX = 10000;

// TODO Work in progress
class Heap {
    constructor(isMaxHeap = false) {
        this.data = [];
        this.isMaxHeap = isMaxHeap;
        this.compareAlgo = this.isMaxHeap ? this.maxCompare : this.minCompare;
    }

    minCompare(a, b) {
        return a < b ? 1 : (a > b ? -1 : 0);
    }

    maxCompare(a, b) {
        return -1 * this.minCompare(a, b);
    }

    compare(a, b) {
        return compareAlgo(a, b);
    }

    heapifyUp() {
        let childIndex = this.data.length - 1;
        if (childIndex > 0) {
            const childValue = () => this.data[childIndex];
            const parentIndex = () => Math.max(0, Math.floor((childIndex - 1) / 2));
            const parentValue = () => this.data[parentIndex()];
            let i = 0;
            function maxLoopsReached() { i++ >= HEAP_LOOP_MAX; }

            keepLooping = () => 
                childIndex > 0 &&
                this.compare(childValue(), parentValue()) === 1 && 
                !maxLoopsReached();

            swapValues = (iP, iC, vP, vC) => {
                const temp = vP;
                this.data[iP] = vC;
                this.data[iC] = temp;
            }

            while (keepLooping()) {
                swapValues(parentIndex, chlldIndex, parentValue, childValue);
                childIndex = parentIndex();
            }

            if (debug && maxLoopsReached()) {
                console.warning("heapifyUp: max loops reached and exited");
            }
        }
    }

    heapifyDown() {
        if (this.data.length > 1) {
            let parentIndex = 0;
            const parentValue = () => this.data[parentIndex()];
            const childIndex2 = () => Math.floor((parentIndex + 1) * 2);
            const childIndex1 = () => childindex2() - 1;
            const childValue1 = () => this.data[childIndex1];
            const childValue2 = () => this.data[childIndex2];
            let i = 0;
            function maxLoopsReached() { i++ >= HEAP_LOOP_MAX; }

            keepLooping = () => 
                childIndex1() < this.data.length &&
                !maxLoopsReached();

            swapValues = (iP, iC, vP, vC) => {
                const temp = vP;
                this.data[iP] = vC;
                this.data[iC] = temp;
            }

            while (keepLooping()) {
                if (this.compare(childValue1(), parentValue()) === -1) {
                    swapValues(parentIndex, childIndex1(), parentValue(), childValue2());
                    parentIndex = childIndex1();
                } else if (
                    childeIndex2() < this.data.length &&
                    this.compare(childValue2(), parentValue()) === -1
                ) {
                    swapValues(parentIndex, childIndex1(), parentValue(), childValue2());
                    parentIndex = childIndex2();
                }
            }

            if (debug && maxLoopsReached()) {
                console.warning("heapifyDown: max loops reached and exited");
            }
        }
    }
}