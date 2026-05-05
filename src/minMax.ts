interface Options {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key?: (value: any) => any;
}

export function min<T>(values: T[], options: Options = {}): T {
    const key = options.key ?? ((v: T) => v);
    return minMax(values, (a, b) => key(a) < key(b));
}

export function max<T>(values: T[], options: Options = {}): T {
    const key = options.key ?? ((v: T) => v);
    return minMax(values, (a, b) => key(a) > key(b));
}

function minMax<T>(values: T[], isPreferred: (prev: T, curr: T) => boolean): T {
    if (values.length === 0) {
        throw new Error("No values given");
    }
    let result: T = values[0];
    for (const value of values.slice(1)) {
        if (isPreferred(value, result)) {
            result = value;
        }
    }
    return result;
}
