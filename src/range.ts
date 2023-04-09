interface RangeIterator {
    next: () => { done: boolean; value: number };
    map: <T>(callback: (value: number) => T) => T[];
    [Symbol.iterator]: () => RangeIterator;
}

function range(stop: number): RangeIterator;
function range(start: number, stop: number): RangeIterator;
function range(start: number, stop: number, step: number): RangeIterator;
function range(a: number, b?: number, step = 1): RangeIterator {
    let start: number, stop: number;
    if (b != null) {
        start = a;
        stop = b;
    } else {
        start = 0;
        stop = a;
    }

    return {
        next() {
            const value = start;
            start += step;
            return { done: value >= stop, value };
        },

        map<T>(callback: (value: number) => T): T[] {
            const result: T[] = [];
            for (;;) {
                const res = this.next();
                if (res.done) {
                    break;
                }
                result.push(callback(res.value));
            }
            return result;
        },

        [Symbol.iterator]() {
            return this;
        }
    };
}

export { range };
