interface Options {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key?: (value: any) => any;
}

export const min = <T>(values: T[], options: Options = {}): T => {
    const key = options.key ? options.key : (v: T) => v;
    return minMax(values, (a, b) => key(a) < key(b));
};

export const max = <T>(values: T[], options: Options = {}): T => {
    const key = options.key ? options.key : (v: T) => v;
    return minMax(values, (a, b) => key(a) > key(b));
};

const minMax = <T>(
    values: T[],
    isPreferred: (prev: T, curr: T) => boolean
): T => {
    if (values.length === 0) {
        throw Error("No values given");
    }
    return values.reduce(
        (prev, curr) => (isPreferred(curr, prev) ? curr : prev),
        values[0]
    );
};
